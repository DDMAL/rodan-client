import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Configuration from '../../../Configuration';
import Events from '../../../Shared/Events';
import ViewNavigationNodeRoot from './ViewNavigationNodeRoot';
import ViewStatusUser from './User/ViewStatusUser';

/**
 * Layout view for main work area. This is responsible for loading views within the main region.
 */
class LayoutViewNavigation extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this._initializeRadio();
        this.addRegions({
            regionNavigationTree: '#region-navigation_tree',
            regionStatusUser: '#region-status_user'
        });
        this.viewStatusUser = new ViewStatusUser({user: null});
    }


    /**
     * On show initialize the transfer info.
     */
    onShow()
    {
        this._populateUploadCount();
        this.regionStatusUser.show(this.viewStatusUser);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.on(Events.EVENT__AUTHENTICATION_LOGIN_SUCCESS, options => this._handleAuthenticationSuccess(options));
        this.rodanChannel.on(Events.EVENT__AUTHENTICATION_LOGOUT_SUCCESS, () => this._handleDeauthenticationSuccess());
        this.rodanChannel.on(Events.EVENT__TRANSFERMANAGER_UPLOAD_FAILED, () => this._populateUploadCount());
        this.rodanChannel.on(Events.EVENT__TRANSFERMANAGER_UPLOAD_SUCCEEDED, () => this._populateUploadCount());
        this.rodanChannel.reply(Events.REQUEST__SHOW_ABOUT, () => this._handleRequestShowAbout());
        this.rodanChannel.reply(Events.REQUEST__SHOW_HELP, () => this._handleRequestShowHelp());
    }

    /**
     * Handle authentication.
     */
    _handleAuthenticationSuccess(options)
    {
        var model = new Backbone.Model({name: 'Projects'});
        var object = {model: model, collection: this.rodanChannel.request(Events.REQUEST__GLOBAL_PROJECT_COLLECTION)};
        this.regionNavigationTree.show(new ViewNavigationNodeRoot(object)); 

        this.viewStatusUser = new ViewStatusUser({user: options.user});
        this.regionStatusUser.show(this.viewStatusUser);
        this.$el.find('#button-navigation_logout').prop('disabled', false);
    }

    /**
     * Handle deauthentication.
     */
    _handleDeauthenticationSuccess()
    {
        this.regionNavigationTree.reset(); 

        this.viewStatusUser = new ViewStatusUser({user: null});
        this.regionStatusUser.show(this.viewStatusUser);
        this.$el.find('#button-navigation_logout').prop('disabled', true);
    }

    /**
     * Populates the upload count.
     */
    _populateUploadCount()
    {
        var count = this.rodanChannel.request(Events.REQUEST__TRANSFERMANAGER_GET_UPLOAD_COUNT);
        this.$el.find('#navigation-upload_count_pending').text(count.pending);
        this.$el.find('#navigation-upload_count_completed').text(count.completed);
        this.$el.find('#navigation-upload_count_failed').text(count.failed);
    }

    /**
     * Handle button logout.
     */
    _handleButtonLogout()
    {
        this.rodanChannel.request(Events.REQUEST__AUTHENTICATION_LOGOUT);
    }

    /**
     * Handle button about.
     */
    _handleButtonAbout()
    {
        this.rodanChannel.request(Events.REQUEST__SHOW_ABOUT);
    }

    /**
     * Handle button help.
     */
    _handleButtonHelp()
    {
        this.rodanChannel.request(Events.REQUEST__SHOW_HELP);
    }

    /**
     * Handle request show about.
     */
    _handleRequestShowAbout()
    {

        var hostname = this.rodanChannel.request(Events.REQUEST__SERVER_GET_HOSTNAME);
        var version = this.rodanChannel.request(Events.REQUEST__SERVER_GET_VERSION);
        var serverDate = this.rodanChannel.request(Events.REQUEST__SERVER_DATE);
        serverDate = serverDate.toString();
        var html = _.template($('#template-misc_about').html())({hostname: hostname,
                                                                 version: version,
                                                                 date: serverDate,
                                                                 name: Configuration.ADMIN_CLIENT.NAME,
                                                                 email: Configuration.ADMIN_CLIENT.EMAIL});
        this.rodanChannel.request(Events.REQUEST__MODAL_SHOW_SIMPLE, {title: 'About', text: html});
    }

    /**
     * Handle request show help.
     */
    _handleRequestShowHelp()
    {
        this.rodanChannel.request(Events.REQUEST__MODAL_SHOW_SIMPLE, {title: 'I want to help you, too :(', text: 'Just email ryan.bannon@gmail.com and ask your question'});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewNavigation.prototype.template = '#template-navigation';
LayoutViewNavigation.prototype.ui = {
    buttonLogout: '#button-navigation_logout',
    buttonAbout: '#button-navigation_about',
    buttonHelp: '#button-navigation_help'
};
LayoutViewNavigation.prototype.events = {
    'click @ui.buttonLogout': '_handleButtonLogout',
    'click @ui.buttonAbout': '_handleButtonAbout',
    'click @ui.buttonHelp': '_handleButtonHelp'
};

export default LayoutViewNavigation;
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../Shared/Events';
import ViewNavigationNodeRoot from './ViewNavigationNodeRoot';
import ViewStatusServer from './Server/ViewStatusServer';
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
            regionStatusServer: '#region-status_server',
            regionStatusUser: '#region-status_user'
        });
        this.viewStatusServer = new ViewStatusServer();
        this.viewStatusUser = new ViewStatusUser({user: null});
    }


    /**
     * On show initialize the transfer info.
     */
    onShow()
    {
        this._populateUploadCount();
        this.regionStatusServer.show(this.viewStatusServer);
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
     * Handle button.
     */
    _handleButton()
    {
        this.rodanChannel.request(Events.REQUEST__AUTHENTICATION_LOGOUT);
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewNavigation.prototype.template = '#template-navigation';
LayoutViewNavigation.prototype.ui = {
    buttonLogout: '#button-navigation_logout'
};
LayoutViewNavigation.prototype.events = {
    'click @ui.buttonLogout': '_handleButton'
};

export default LayoutViewNavigation;
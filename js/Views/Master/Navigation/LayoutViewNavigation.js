import _ from 'underscore';
import Backbone from 'backbone';
import Configuration from 'js/Configuration';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import ViewNavigationNodeRoot from './ViewNavigationNodeRoot';

/**
 * Layout view for main work area. This is responsible for loading views within the main region.
 */
export default class LayoutViewNavigation extends Marionette.LayoutView
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
            regionNavigationTree: '#region-navigation_tree'
        });
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__AUTHENTICATION_LOGIN_SUCCESS, options => this._handleAuthenticationSuccess(options));
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__AUTHENTICATION_LOGOUT_SUCCESS, () => this._handleDeauthenticationSuccess());
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__SHOW_ABOUT, () => this._handleRequestShowAbout());
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__SHOW_HELP, () => this._handleRequestShowHelp());
    }

    /**
     * Handle authentication.
     */
    _handleAuthenticationSuccess()
    {
        var model = new Backbone.Model({name: 'Projects'});
        var object = {model: model, collection: Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_PROJECT_COLLECTION)};
        this.regionNavigationTree.show(new ViewNavigationNodeRoot(object)); 
        this.$el.find('#button-navigation_logout').prop('disabled', false);
    }

    /**
     * Handle deauthentication.
     */
    _handleDeauthenticationSuccess()
    {
        this.regionNavigationTree.reset(); 
        this.$el.find('#button-navigation_logout').prop('disabled', true);
    }

    /**
     * Handle button logout.
     */
    _handleButtonLogout()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__AUTHENTICATION_LOGOUT);
    }

    /**
     * Handle button about.
     */
    _handleButtonAbout()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SHOW_ABOUT);
    }

    /**
     * Handle button help.
     */
    _handleButtonHelp()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SHOW_HELP);
    }

    /**
     * Handle request show about.
     */
    _handleRequestShowAbout()
    {
        var user = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__AUTHENTICATION_USER);
        var serverConfig = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_CONFIGURATION);
        var hostname = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_GET_HOSTNAME);
        var version = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_GET_VERSION);
        var serverDate = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_DATE);
        serverDate = serverDate.toString();
        var username = user ? user.get('username') : 'no user';
        var name = user ? user.get('first_name') + ' ' + user.get('last_name') : 'no user';
        var html = _.template($('#template-misc_about').html())({hostname: hostname,
                                                                 version: version,
                                                                 username: username,
                                                                 name: name,
                                                                 serverConfiguration: serverConfig,
                                                                 date: serverDate,
                                                                 client: Configuration.CLIENT});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_SHOW_SIMPLE, {title: 'About', text: html});
    }

    /**
     * Handle request show help.
     */
    _handleRequestShowHelp()
    {
        var html = _.template($('#template-misc_help').html())({email: Configuration.ADMIN_CLIENT.EMAIL, name: Configuration.ADMIN_CLIENT.NAME, url: Configuration.WEBSITE_URL});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_SHOW_SIMPLE, {title: 'Help', text: html});
    }
}
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
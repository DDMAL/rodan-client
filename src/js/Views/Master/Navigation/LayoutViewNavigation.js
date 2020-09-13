import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';
import Configuration from 'js/Configuration';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import ViewNavigationNodeRoot from './ViewNavigationNodeRoot';
import ViewResourceTypeDetailCollectionItem from 'js/Views/Master/Main/ResourceType/ViewResourceTypeDetailCollectionItem';
import ViewUser from 'js/Views/Master/Main/User/Individual/ViewUser';
import ViewProject from 'js/Views/Master/Main/Project/Individual/ViewProject';

/**
 * Layout view for main work area. This is responsible for loading views within the main region.
 */
export default class LayoutViewNavigation extends Marionette.View
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
        this._handleAppearance()
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
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__SHOW_API, () => this._handleRequestShowAPI());

        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__SHOW_NAVIGATION_PAGINATION, () => this._handleRequestShowPaginationButtons());
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__DISABLE_UPPER_NAVIGATION_PAGINATION, () => this._handleRequestDisableUpperPaginationButtons());
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__DISABLE_LOWER_NAVIGATION_PAGINATION, () => this._handleRequestDisableLowerPaginationButtons());
    }

    /**
     * Handle authentication.
     */
    _handleAuthenticationSuccess()
    {
        var model = new Backbone.Model({name: 'Projects'});
        var object = {model: model, collection: Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_PROJECT_COLLECTION)};
        this.showChildView('regionNavigationTree', new ViewNavigationNodeRoot(object));
        this.$el.find('#button-navigation_logout').prop('disabled', false);
        this.$el.find('#button-navigation_preferences').prop('disabled', false);
    }

    /**
     * Handle deauthentication.
     */
    _handleDeauthenticationSuccess()
    {
        this.getRegion('regionNavigationTree').empty();
        this.$el.find('#button-navigation_logout').prop('disabled', true);
        this.$el.find('#button-navigation_preferences').prop('disabled', true);
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
     * Handle button preferences.
     */
    _handleButtonPreferences()
    {
        var user = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__AUTHENTICATION_USER);
        var view = new ViewUser({model: user});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_SHOW, {title: user.get('username'), content: view});
    }

    /**
     * Handle button dev.
     */
    _handleButtonDev()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SHOW_API);
    }

    /**
     * Handle request show about.
     */
    _handleRequestShowAbout()
    {
        var serverConfig = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_CONFIGURATION);
        var hostname = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_GET_HOSTNAME);
        var version = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_GET_VERSION);
        var serverDate = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_DATE);
        serverDate = serverDate ? serverDate.toString() : 'unknown';
        var html = _.template($('#template-misc_about').html())({hostname: hostname,
                                                                 version: version,
                                                                 serverConfiguration: serverConfig,
                                                                 date: serverDate,
                                                                 client: Configuration.CLIENT});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_SHOW, {title: 'About', content: html});
    }

    /**
     * Handle request show help.
     */
    _handleRequestShowHelp()
    {
        var html = _.template($('#template-misc_help').html())({email: Configuration.ADMIN_CLIENT.EMAIL, name: Configuration.ADMIN_CLIENT.NAME, url: Configuration.WEBSITE_URL});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_SHOW, {title: 'Help', content: html});
    }

    /**
     * Handle request show API.
     */
    _handleRequestShowAPI()
    {
        var collection = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_RESOURCETYPE_COLLECTION);
        var view = new BaseViewCollection({collection: collection,
                                           template: _.template($('#template-resourcetype_collection').text()),
                                           childView: ViewResourceTypeDetailCollectionItem});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_SHOW, {title: 'Development', content: view});
    }



///////////////////////////////////////////////////////////////////////////////////////
// PROJECT NAVIGATION
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * 
     */
    _handleAppearance()
    {
        console.log("_handleAppearance");
        var attrs = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_PROJECT_COLLECTION)._pagination.attributes;

        if (attrs.total > 1)
        {
            // Show and enable them all
            this._handleRequestShowPaginationButtons()
            if (attrs.current === attrs.total)
            {
                this._handleRequestDisableUpperPaginationButtons()
            } 
            else if (attrs.current === 1)
            {
                this._handleRequestDisableLowerPaginationButtons()
            }

        }
        else
        {
            this._handleRequestHidePaginationButtons()
        }
        

    }
    /**
     * Handle request to navigate to the first page of projects
     */
    _handleRequestButtonFirst()
    {
        console.log("_handleRequestButtonFirst");
        Radio.channel('rodan').trigger(RODAN_EVENTS.REQUEST__NAVIGATION_PAGINATION_FIRST);
        this._handleAppearance()
    }

    /**
     * Handle request to navigate to the previous page of projects
     */
    _handleRequestNavigationPaginationPrevious()
    {
        console.log("_handleRequestNavigationPaginationPrevious");
        Radio.channel('rodan').trigger(RODAN_EVENTS.REQUEST__NAVIGATION_PAGINATION_PREVIOUS);
        this._handleAppearance()
    }

    /**
     * Handle request to navigate to the next page of projects
     */
    _handleRequestNavigationPaginationNext()
    {
        console.log("_handleRequestNavigationPaginationNext");
        Radio.channel('rodan').trigger(RODAN_EVENTS.REQUEST__NAVIGATION_PAGINATION_NEXT);
        this._handleAppearance()
    }

    /**
     * Handle request to navigate to the last page of projects
     */
    _handleRequestNavigationPaginationLast()
    {
        console.log("_handleRequestNavigationPaginationLast");
        Radio.channel('rodan').trigger(RODAN_EVENTS.REQUEST__NAVIGATION_PAGINATION_LAST);
        this._handleAppearance()
    }



    /**
     * Handle request to show pagination buttons when they are visible.
     */
    _handleRequestShowPaginationButtons()
    {
        this.$el.find('#button-navigation_first').show();
        this.$el.find('#button-navigation_previous').show();
        this.$el.find('#button-navigation_next').show();
        this.$el.find('#button-navigation_last').show();
        
        // Make sure they are clickable
        this.$el.find('#button-navigation_first').prop('disabled', false);
        this.$el.find('#button-navigation_previous').prop('disabled', false);
        this.$el.find('#button-navigation_next').prop('disabled', false);
        this.$el.find('#button-navigation_last').prop('disabled', false);
    }
    
    _handleRequestHidePaginationButtons()
    {
        this.$el.find('#button-navigation_first').hide();
        this.$el.find('#button-navigation_previous').hide();
        this.$el.find('#button-navigation_next').hide();
        this.$el.find('#button-navigation_last').hide();
    }

    /**
     * Handle request to disable upper-pagination buttons 
     */
    _handleRequestDisableUpperPaginationButtons()
    {
        this.$el.find('#button-navigation_first').prop('disabled', true);
        this.$el.find('#button-navigation_previous').prop('disabled', true);
        // this.$el.find('#button-navigation_next').prop('disabled', false);
        // this.$el.find('#button-navigation_last').prop('disabled', false);
    }
    
    /**
     * Handle request to disable lower-pagination buttons 
     */
    _handleRequestDisableLowerPaginationButtons()
    {
        // this.$el.find('#button-navigation_first').prop('disabled', false);
        // this.$el.find('#button-navigation_previous').prop('disabled', false);
        this.$el.find('#button-navigation_next').prop('disabled', true);
        this.$el.find('#button-navigation_last').prop('disabled', true);
    }
    /**
     * Handle request enable all pagination buttons???
     */

}
LayoutViewNavigation.prototype.template = _.template($('#template-navigation').text());
LayoutViewNavigation.prototype.ui = {
    buttonLogout: '#button-navigation_logout',
    buttonAbout: '#button-navigation_about',
    buttonHelp: '#button-navigation_help',
    buttonPreferences: '#button-navigation_preferences',
    buttonDev: '#button-navigation_dev',
    buttonPaginateFirst: '#button-navigation_first',
    buttonPaginatePrevious: '#button-navigation_previous',
    buttonPaginateNext: '#button-navigation_next',
    buttonPaginateLast: '#button-navigation_last'
};
LayoutViewNavigation.prototype.events = {
    'click @ui.buttonLogout': '_handleButtonLogout',
    'click @ui.buttonAbout': '_handleButtonAbout',
    'click @ui.buttonHelp': '_handleButtonHelp',
    'click @ui.buttonPreferences': '_handleButtonPreferences',
    'click @ui.buttonDev': '_handleButtonDev',
    'click @ui.buttonPaginateFirst': '_handleRequestButtonFirst',
    'click @ui.buttonPaginatePrevious': '_handleRequestNavigationPaginationPrevious',
    'click @ui.buttonPaginateNext': '_handleRequestNavigationPaginationNext',
    'click @ui.buttonPaginateLast': '_handleRequestNavigationPaginationLast'
};

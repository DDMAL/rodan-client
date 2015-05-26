import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Configuration from './VISRC_Configuration'
import VISRC_ControllerAuthentication from './Controllers/VISRC_ControllerAuthentication'
import VISRC_ControllerServer from './Controllers/VISRC_ControllerServer'
import VISRC_Events from './Shared/VISRC_Events'
import VISRC_LayoutViewMain from './Views/Master/Main/VISRC_LayoutViewMain'
import VISRC_LayoutViewNavigation from './Views/Master/Navigation/VISRC_LayoutViewNavigation'
import VISRC_ViewStatusUser from './Views/Master/Status/User/VISRC_ViewStatusUser'

/**
 * TODO docs
 */
class VISRC_Application extends Marionette.Application
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aOptions)
    {
        this.configuration = VISRC_Configuration;

        // TODO - what does this do?
        $.ajaxPrefilter(function(options, originalOptions, jqXHR)
        {
            console.log('ajax prefilter');
            options.xhrFields = {
                withCredentials: true
            };
        });

        this.addRegions({
            regionStatusUser: "#region-status_user"
        });
        this._initializeRadio();
        this._initializeControllers();
        this._initializeViews();
    }

    /**
     * Ready
     */
    onStart(aOptions)
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__GET_ROUTES);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    _initializeControllers(aOptions)
    {
        this.controllerServer = new VISRC_ControllerServer(this.configuration);
        this.controllerAuthentication = new VISRC_ControllerAuthentication(this.controllerServer);
    }

    /**
     * TODO docs
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.reply(VISRC_Events.REQUEST__APPLICATION, this);
        this.rodanChannel.on(VISRC_Events.EVENT__ROUTESLOADED, () => this._handleEventRoutesLoaded());
    }

    /**
     * Initialize all the views so they can respond to events.
     */
    _initializeViews()
    {   
        // Layout views.
        this.layoutViewNavigation = new VISRC_LayoutViewNavigation();
        this.layoutViewMain = new VISRC_LayoutViewMain();

        // Compositve views (won't change).
        this.viewStatusUser = new VISRC_ViewStatusUser();
    }

    /**
     * Handle EVENT__ROUTESLOADED.
     */
    _handleEventRoutesLoaded()
    {
        // Render layout views.
        this.layoutViewNavigation.render();
        this.layoutViewMain.render();

        // Render other views.
        this.getRegion('regionStatusUser').show(this.viewStatusUser);

        // Send event that the app has started.
        this.rodanChannel.trigger(VISRC_Events.EVENT__APPLICATION_READY);
        
        // DUMMY!!!!!
        this.rodanChannel.command(VISRC_Events.COMMAND__AUTHENTICATION_LOGIN, {username: "dummy", password: "dafdaedf2345"});
    }
}

export default VISRC_Application;
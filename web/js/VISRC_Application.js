import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Configuration from './VISRC_Configuration';
import VISRC_ControllerAuthentication from './Controllers/VISRC_ControllerAuthentication';
import VISRC_ControllerServer from './Controllers/VISRC_ControllerServer';
import VISRC_Events from './Shared/VISRC_Events';
import VISRC_JobCollection from './Collections/VISRC_JobCollection';
import VISRC_LayoutViewMain from './Views/Master/Main/VISRC_LayoutViewMain';
import VISRC_LayoutViewNavigation from './Views/Master/Navigation/VISRC_LayoutViewNavigation';
import VISRC_ProjectCollection from './Collections/VISRC_ProjectCollection';
import VISRC_RunJobCollection from './Collections/VISRC_RunJobCollection';
import VISRC_ResourceCollection from './Collections/VISRC_ResourceCollection';
import VISRC_ViewStatusUser from './Views/Master/Status/User/VISRC_ViewStatusUser';
import VISRC_WorkflowCollection from './Collections/VISRC_WorkflowCollection';
import VISRC_WorkflowRunCollection from './Collections/VISRC_WorkflowRunCollection';

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
        var that = this;

        // TODO - what does this do?
        $.ajaxPrefilter(function(options, originalOptions, jqXHR)
        {
            console.log('ajax prefilter');
            options.xhrFields = {
                withCredentials: true,
            };

            if (that.configuration.authenticationType == "session" && !options.beforeSend) 
            {
                options.beforeSend = function (xhr) 
                { 
                    xhr.setRequestHeader('X-CSRFToken', that.controllerServer.CSRFToken.value);
                }
            }
        });

        this.addRegions({
            regionStatusUser: "#region-status_user"
        });
        this._initializeRadio();
        this._initializeControllers();
        this._initializeCollections();
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
     * Initialize collections.
     */
    _initializeCollections()
    {
        this.jobCollection = new VISRC_JobCollection();
        this.projectCollection = new VISRC_ProjectCollection();
        this.resourceCollection = new VISRC_ResourceCollection();
        this.runJobCollection = new VISRC_RunJobCollection();
        this.workflowCollection = new VISRC_WorkflowCollection();
        this.workflowRunCollection = new VISRC_WorkflowRunCollection();
    }

    /**
     * TODO docs
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.reply(VISRC_Events.REQUEST__APPLICATION, this);
        this.rodanChannel.on(VISRC_Events.EVENT__ROUTESLOADED, () => this._handleEventRoutesLoaded());
        this.rodanChannel.on(VISRC_Events.EVENT__AUTHENTICATION_SUCCESS, () => this._dummy());
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

    // dummy to load projects after dummy login
    _dummy()
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__PROJECTS_SELECTED); 
    }
}

export default VISRC_Application;
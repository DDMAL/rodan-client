import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Configuration from './VISRC_Configuration';
import VISRC_ControllerAuthentication from './Controllers/VISRC_ControllerAuthentication';
import VISRC_ControllerServer from './Controllers/VISRC_ControllerServer';
import VISRC_Events from './Shared/VISRC_Events';
import VISRC_InputPortCollection from './Collections/VISRC_InputPortCollection';
import VISRC_InputPortTypeCollection from './Collections/VISRC_InputPortTypeCollection';
import VISRC_JobCollection from './Collections/VISRC_JobCollection';
import VISRC_OutputPortTypeCollection from './Collections/VISRC_OutputPortTypeCollection';
import VISRC_LayoutViewMain from './Views/Master/Main/VISRC_LayoutViewMain';
import VISRC_LayoutViewNavigation from './Views/Master/Navigation/VISRC_LayoutViewNavigation';
import VISRC_LayoutViewStatus from './Views/Master/Status/VISRC_LayoutViewStatus';
import VISRC_ProjectCollection from './Collections/VISRC_ProjectCollection';
import VISRC_RunJobCollection from './Collections/VISRC_RunJobCollection';
import VISRC_ResourceCollection from './Collections/VISRC_ResourceCollection';
import VISRC_ResourceTypeCollection from './Collections/VISRC_ResourceTypeCollection';
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
        var that = this;

        // TODO - what does this do?
        $.ajaxPrefilter(function(options, originalOptions, jqXHR)
        {
            console.log('ajax prefilter');
            options.xhrFields = {
                withCredentials: true,
            };

            if (VISRC_Configuration.SERVER_AUTHENTICATION_TYPE == "session" && !options.beforeSend) 
            {
                options.beforeSend = function (xhr) 
                { 
                    xhr.setRequestHeader('X-CSRFToken', that.controllerServer.CSRFToken.value);
                }
            }
        });

        this.addRegions({
            regionNavigation: "#region-navigation",
            regionStatus: "#region-status"
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
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.reply(VISRC_Events.REQUEST__APPLICATION, this);
        this.rodanChannel.on(VISRC_Events.EVENT__ROUTESLOADED, () => this._handleEventRoutesLoaded());
        this.rodanChannel.on(VISRC_Events.EVENT__AUTHENTICATION_SUCCESS, () => this._handleAuthenticationSuccess());
    }

    /**
     * TODO docs
     */
    _initializeControllers(aOptions)
    {
        this.controllerServer = new VISRC_ControllerServer();
        this.controllerAuthentication = new VISRC_ControllerAuthentication(this.controllerServer);
    }

    /**
     * Initialize collections.
     */
    _initializeCollections()
    {
        this.inputPortCollection = new VISRC_InputPortCollection();
        this.inputPortTypeCollection = new VISRC_InputPortTypeCollection();
        this.jobCollection = new VISRC_JobCollection();
        this.outputPortTypeCollection = new VISRC_OutputPortTypeCollection();
        this.projectCollection = new VISRC_ProjectCollection();
        this.resourceCollection = new VISRC_ResourceCollection();
        this.resourceTypeCollection = new VISRC_ResourceTypeCollection();
        this.runJobCollection = new VISRC_RunJobCollection();
        this.workflowCollection = new VISRC_WorkflowCollection();
        this.workflowRunCollection = new VISRC_WorkflowRunCollection();
    }

    /**
     * Initialize all the views so they can respond to events.
     */
    _initializeViews()
    {   
        this.layoutViewNavigation = new VISRC_LayoutViewNavigation();
        this.layoutViewMain = new VISRC_LayoutViewMain();
        this.layoutViewStatus = new VISRC_LayoutViewStatus();
    }

    /**
     * Handle EVENT__ROUTESLOADED.
     */
    _handleEventRoutesLoaded()
    {
        // Render layout views.
        this.layoutViewMain.render();
        this.regionNavigation.show(this.layoutViewNavigation);
        this.regionStatus.show(this.layoutViewStatus);

        // Send event that the app has started.
        this.rodanChannel.trigger(VISRC_Events.EVENT__APPLICATION_READY);

        // Check authentication.
        this.rodanChannel.command(VISRC_Events.COMMAND__AUTHENTICATION_CHECK); 
    }

    /**
     * Handle authentication success.
     */
    _handleAuthenticationSuccess()
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_RESOURCETYPES, {});
        this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_JOBS, {});
        this.rodanChannel.trigger(VISRC_Events.EVENT__PROJECTS_SELECTED); 
    }
}

export default VISRC_Application;
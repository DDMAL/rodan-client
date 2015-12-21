import moment from 'moment';
import _ from 'underscore';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import BehaviorTable from './Behaviors/BehaviorTable';
import Configuration from './Configuration';
import ControllerAuthentication from './Controllers/ControllerAuthentication';
import ControllerServer from './Controllers/ControllerServer';
import ErrorHandler from './Shared/ErrorHandler';
import Events from './Shared/Events';
import InputPortCollection from './Collections/InputPortCollection';
import InputPortTypeCollection from './Collections/InputPortTypeCollection';
import JobCollection from './Collections/JobCollection';
import OutputPortTypeCollection from './Collections/OutputPortTypeCollection';
import LayoutViewMain from './Views/Master/Main/LayoutViewMain';
import LayoutViewNavigation from './Views/Master/Navigation/LayoutViewNavigation';
import LayoutViewStatus from './Views/Master/Status/LayoutViewStatus';
import ProjectCollection from './Collections/ProjectCollection';
import RunJobCollection from './Collections/RunJobCollection';
import ResourceCollection from './Collections/ResourceCollection';
import ResourceTypeCollection from './Collections/ResourceTypeCollection';
import WorkflowCollection from './Collections/WorkflowCollection';
import WorkflowJobCoordinateSetCollection from './Collections/WorkflowJobCoordinateSetCollection';
import WorkflowRunCollection from './Collections/WorkflowRunCollection';

/**
 * Main app class.
 */
class Application extends Marionette.Application
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize the app.
     */
    initialize()
    {
        this.addRegions({
            regionNavigation: '#region-navigation',
            regionStatus: '#region-status'
        });
        this._initializeBehaviors();
        this._initializeDateTimeFormatter();
        this._initializeRadio();
        this._initializeControllers();
        this._initializeAjaxPrefilters();
        this._initializeCollections();
        this._initializeViews();
        this._errorHandler = new ErrorHandler();
    }

    /**
     * When app is ready, start communicating.
     */
    onStart()
    {
        this.rodanChannel.request(Events.COMMAND__GET_ROUTES);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes various helpers.
     */
    _initializeDateTimeFormatter()
    {
        moment.defaultFormat = Configuration.DATETIME_FORMAT;
        _.formatFromUTC = function(dateTime)
        {
            return moment(dateTime).format();
        };
    }

    /**
     * Initialize behaviors.
     */
    _initializeBehaviors()
    {
        Marionette.Behaviors.behaviorsLookup = function()
        {
            return {'Table': BehaviorTable};
        }
    }

    /**
     * Set event binding.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.on(Events.EVENT__ROUTESLOADED, () => this._handleEventRoutesLoaded());
        this.rodanChannel.on(Events.EVENT__AUTHENTICATION_SUCCESS, () => this._handleAuthenticationSuccess());
    }

    /**
     * Initialize controllers. These are not used for viewing; rather, they are server/auth control.
     */
    _initializeControllers()
    {
        this.controllerServer = new ControllerServer();
        this.controllerAuthentication = new ControllerAuthentication(this.controllerServer);
    }

    /**
     * Initialize AJAX prefilters. This allows the application a lower level of request monitoring (if desired).
     */
    _initializeAjaxPrefilters()
    {
        var that = this;
        $.ajaxPrefilter(function(options) {
            that.controllerAuthentication.ajaxPrefilter(options);
        });
    }

    /**
     * Initialize collections.
     */
    _initializeCollections()
    {
        this.inputPortCollection = new InputPortCollection();
        this.inputPortTypeCollection = new InputPortTypeCollection();
        this.jobCollection = new JobCollection();
        this.outputPortTypeCollection = new OutputPortTypeCollection();
        this.projectCollection = new ProjectCollection();
        this.resourceCollection = new ResourceCollection();
        this.resourceTypeCollection = new ResourceTypeCollection();
        this.runJobCollection = new RunJobCollection();
        this.workflowCollection = new WorkflowCollection();
        this.workflowJobCoordinateSetCollection = new WorkflowJobCoordinateSetCollection();
        this.workflowRunCollection = new WorkflowRunCollection();
    }

    /**
     * Initialize all the views so they can respond to events.
     */
    _initializeViews()
    {
        this.layoutViewNavigation = new LayoutViewNavigation();
        this.layoutViewMain = new LayoutViewMain();
        this.layoutViewStatus = new LayoutViewStatus();
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
        this.rodanChannel.trigger(Events.EVENT__APPLICATION_READY);

        // Check authentication.
        this.rodanChannel.request(Events.COMMAND__AUTHENTICATION_CHECK); 
    }

    /**
     * Handle authentication success.
     */
    _handleAuthenticationSuccess()
    {
        this.rodanChannel.request(Events.COMMAND__RESOURCETYPES_LOAD, {});
        this.rodanChannel.request(Events.COMMAND__LOAD_JOBS, {query: {enabled: 'True'}});
        this.rodanChannel.trigger(Events.EVENT__PROJECTS_SELECTED); 
    }
}

export default Application;
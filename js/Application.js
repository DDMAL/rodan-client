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
import EventTimer from './Shared/EventTimer';

import ControllerModal from './Controllers/ControllerModal';
import ProjectController from './Views/Master/Main/Project/ProjectController';
import ResourceController from './Views/Master/Main/Resource/ResourceController';
import RunJobController from './Views/Master/Main/RunJob/RunJobController';
import WorkflowController from './Views/Master/Main/Workflow/WorkflowController';
import WorkflowRunController from './Views/Master/Main/WorkflowRun/WorkflowRunController';
import WorkflowBuilderController from './Controllers/WorkflowBuilderController';
import WorkflowJobController from './Controllers/WorkflowJobController';
import WorkflowJobGroupController from './Controllers/WorkflowJobGroupController';
import WorkflowBuilderMenuController from './Controllers/WorkflowBuilderMenuController';

import GlobalInputPortTypeCollection from './Collections/Global/GlobalInputPortTypeCollection';
import GlobalJobCollection from './Collections/Global/GlobalJobCollection';
import GlobalResourceTypeCollection from './Collections/Global/GlobalResourceTypeCollection';
import GlobalOutputPortTypeCollection from './Collections/Global/GlobalOutputPortTypeCollection';
import GlobalProjectCollection from './Collections/Global/GlobalProjectCollection';

import LayoutViewMaster from './Views/Master/LayoutViewMaster';

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
            regionMaster: '#region-master'
        });

        // Non-network and non-GUI inits. Do these first.
        this._initializeBehaviors();
        this._initializeDateTimeFormatter();
        this._initializeRadio();
        this._initializeCollections();
        
        this._initializeAjaxPrefilters();
        this._initializeViews();
        this._initializeControllers();
        this._errorHandler = new ErrorHandler();
        this._eventTimer = new EventTimer({frequency: Configuration.EVENT_TIMER_FREQUENCY});
    }

    /**
     * When app is ready, start communicating.
     */
    onStart()
    {
        this.rodanChannel.request(Events.REQUEST__SERVER_GET_ROUTES);
    }

    /**
     * Timer request callback test.
     */
    timerRequestCallback(response)
    {
        console.log('Callback response: ' + response);
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
            // TODO - see https://github.com/DDMAL/rodan-client/issues/59
            try
            {
                return moment(dateTime).format();
            }
            catch(error)
            {
                return moment.moment(dateTime).format();
            }
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
        this.rodanChannel.on(Events.EVENT__SERVER_ROUTESLOADED, () => this._handleEventRoutesLoaded());
        this.rodanChannel.on(Events.EVENT__AUTHENTICATION_SUCCESS, () => this._handleAuthenticationSuccess());
    }

    /**
     * Initialize controllers. These are not used for viewing; rather, they are server/auth control.
     */
    _initializeControllers()
    {
        this.controllerServer = new ControllerServer();
        this.controllerAuthentication = new ControllerAuthentication(this.controllerServer);

        this.modalController = new ControllerModal();
        this.projectController = new ProjectController();
        this.resourceController = new ResourceController();
        this.runJobController = new RunJobController();
        this.workflowController = new WorkflowController();
        this.workflowRunController = new WorkflowRunController();
        this.workflowBuilderController = new WorkflowBuilderController();
        this.workflowJobController = new WorkflowJobController();
        this.workflowJobGroupController = new WorkflowJobGroupController();
        this.workflowBuilderMenuController = new WorkflowBuilderMenuController();
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
        this.jobCollection = new GlobalJobCollection();
        this.resourceTypeCollection = new GlobalResourceTypeCollection();
        this.inputPortTypeCollection = new GlobalInputPortTypeCollection();
        this.outputPortTypeCollection = new GlobalOutputPortTypeCollection();
        this.projectCollection = new GlobalProjectCollection();
    }

    /**
     * Initialize all the views so they can respond to events.
     */
    _initializeViews()
    {
        this._layoutViewMaster = new LayoutViewMaster();
    }

    /**
     * Handle EVENT__SERVER_ROUTESLOADED.
     */
    _handleEventRoutesLoaded()
    {
        // Render layout views.
        this.regionMaster.show(this._layoutViewMaster);

        // Send event that the app has started.
        this.rodanChannel.trigger(Events.EVENT__APPLICATION_READY);

        // Check authentication.
        this.rodanChannel.request(Events.REQUEST__AUTHENTICATION_CHECK); 
    }

    /**
     * Handle authentication success.
     */
    _handleAuthenticationSuccess()
    {
        var user = this.rodanChannel.request(Events.REQUEST__AUTHENTICATION_USER);
        this.rodanChannel.request(Events.REQUEST__GLOBAL_PROJECTS_LOAD, {data: {user: user.get('uuid')}});
        this.rodanChannel.request(Events.REQUEST__GLOBAL_INPUTPORTTYPES_LOAD);
        this.rodanChannel.request(Events.REQUEST__GLOBAL_OUTPUTPORTTYPES_LOAD);
        this.rodanChannel.request(Events.REQUEST__GLOBAL_RESOURCETYPES_LOAD);
        this.rodanChannel.request(Events.REQUEST__GLOBAL_JOBS_LOAD, {data: {enabled: 'True'}});
        this.rodanChannel.trigger(Events.EVENT__PROJECTS_SELECTED); 
    }
}

export default Application;
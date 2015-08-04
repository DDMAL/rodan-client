import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import ControllerAuthentication from './Controllers/ControllerAuthentication';
import ControllerServer from './Controllers/ControllerServer';
import ErrorHandler from './ErrorHandler';
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
        this._initializeRadio();
        this._initializeControllers();
        this._initializeCollections();
        this._initializeViews();
        this._errorHandler = new ErrorHandler();
    }

    /**
     * When app is ready, start communicating.
     */
    onStart()
    {
        this.rodanChannel.command(Events.COMMAND__GET_ROUTES);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
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
        this.rodanChannel.command(Events.COMMAND__AUTHENTICATION_CHECK); 
    }

    /**
     * Handle authentication success.
     */
    _handleAuthenticationSuccess()
    {
        this.rodanChannel.command(Events.COMMAND__LOAD_RESOURCETYPES, {});
        this.rodanChannel.command(Events.COMMAND__LOAD_JOBS, {});
        this.rodanChannel.trigger(Events.EVENT__PROJECTS_SELECTED); 
    }
}

export default Application;
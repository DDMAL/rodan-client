import BaseController from './BaseController';
import Events from '../Shared/Events';
import LayoutViewIndividualWorkflowRun from '../Views/Master/Main/WorkflowRun/Individual/LayoutViewIndividualWorkflowRun';
import ViewWorkflowRunList from '../Views/Master/Main/WorkflowRun/List/ViewWorkflowRunList';
import RunJobCollection from '../Collections/RunJobCollection';
import WorkflowRun from '../Models/WorkflowRun';
import WorkflowRunCollection from '../Collections/WorkflowRunCollection';

/**
 * Controller for WorkflowRun.
 */
class ControllerWorkflowRun extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Initialize
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel.on(Events.EVENT__WORKFLOWRUNS_SELECTED, options => this._handleEventListSelected(options), this);
        this.rodanChannel.on(Events.EVENT__WORKFLOWRUN_SELECTED, options => this._handleEventItemSelected(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWRUNS_SYNC, options => this._handleRequestWorkflowRunsSync(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWRUN_CREATE, options => this._handleRequestWorkflowRunCreate(options), this);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        var runJobs = new RunJobCollection();
        runJobs.fetch({data: {workflow_run: options.workflowrun.id}});
        this._viewItem = new LayoutViewIndividualWorkflowRun({collection: runJobs, model: options.workflowrun});
        this.rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this._viewItem);
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected(options)
    {
        var workflowRunCollection = new WorkflowRunCollection();
        workflowRunCollection.fetchSort(false, 'created', {data: {project: options.project.id}});
        this.rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__WORKFLOWRUNS_SYNC, 
                                                                       options: {collection: workflowRunCollection}, 
                                                                       callback: null});

        this._viewList = new ViewWorkflowRunList({collection: workflowRunCollection});
        this.rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this._viewList);
    }

    /**
     * handle request WorkflowRuns sync.
     */
    _handleRequestWorkflowRunsSync(options)
    {
        options.collection.syncList();
    }

    /**
     * Handle request create WorkflowRun.
     */
    _handleRequestWorkflowRunCreate(options)
    {
        var workflowRun = new WorkflowRun({workflow: options.workflow.get('url'), resource_assignments: options.assignments});
        workflowRun.save({}, {success: (model) => this._handleSuccess(model)});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - REST callbacks
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle success.
     */
    _handleSuccess(model)
    {
        var project = this.rodanChannel.request(Events.REQUEST__PROJECT_ACTIVE);
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWRUNS_SELECTED, {project: project});
    }
}

export default ControllerWorkflowRun;
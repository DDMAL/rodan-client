import Events from '../../../../Shared/Events';
import LayoutViewIndividualWorkflowRun from './Individual/LayoutViewIndividualWorkflowRun';
import ViewWorkflowRunList from './List/ViewWorkflowRunList';
import LayoutViewNewWorkflowRun from './NewWorkflowRun/LayoutViewNewWorkflowRun';
import BaseController from '../../../../Controllers/BaseController';
import RunJobCollection from '../../../../Collections/RunJobCollection';

/**
 * Controller for WorkflowRun views.
 */
class WorkflowRunController extends BaseController
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
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.on(Events.EVENT__WORKFLOWRUNS_SELECTED, () => this._handleEventListSelected());
        this._rodanChannel.on(Events.EVENT__WORKFLOWRUN_SELECTED, options => this._handleEventItemSelected(options), this);
        this._rodanChannel.on(Events.EVENT__WORKFLOWRUNCREATOR_SELECTED, options => this._handleCommandCreateWorkflowRun(options));
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        var runJobs = new RunJobCollection();
        runJobs.fetch({data: {workflow_run: options.workflowrun.id}});
        this._viewItem = new LayoutViewIndividualWorkflowRun({collection: runJobs, model: options.workflowrun});
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this._viewItem);
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        var project = this._rodanChannel.request(Events.REQUEST__PROJECT_ACTIVE);
        this._viewList = new ViewWorkflowRunList({project: project});
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this._viewList);
    }

    /**
     * Handle workflow run creation.
     */
    _handleCommandCreateWorkflowRun(options)
    {
        options.workflow.fetch();
        var collection = this._rodanChannel.request(Events.REQUEST__PROJECT_COLLECTION);
        var project = collection.where({'url': options.workflow.get('project')})[0];
        this._layoutViewNewWorkflowRun = new LayoutViewNewWorkflowRun({workflow: options.workflow, project: project});
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this._layoutViewNewWorkflowRun);
    }
}

export default WorkflowRunController;
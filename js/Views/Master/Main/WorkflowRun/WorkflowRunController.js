import Events from '../../../../Shared/Events';
import ViewWorkflowRun from './Individual/ViewWorkflowRun';
import ViewWorkflowRunList from './List/ViewWorkflowRunList';
import LayoutViewNewWorkflowRun from './NewWorkflowRun/LayoutViewNewWorkflowRun';
import BaseController from '../../../../Controllers/BaseController';

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
        this._rodanChannel.on(Events.EVENT__WORKFLOWRUNCREATOR_SELECTED, aPass => this._handleCommandCreateWorkflowRun(aPass));
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        this._viewItem = new ViewWorkflowRun({workflowRun: options.workflowRun});
        this._rodanChannel.request(Events.COMMAND__LAYOUTVIEW_SHOW, this._viewItem);
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        var project = this._rodanChannel.request(Events.REQUEST__PROJECT_ACTIVE);
        this._viewList = new ViewWorkflowRunList({project: project});
        this._rodanChannel.request(Events.COMMAND__LAYOUTVIEW_SHOW, this._viewList);
    }

    /**
     * Handle workflow run creation.
     */
    _handleCommandCreateWorkflowRun(aPass)
    {
        var collection = this._rodanChannel.request(Events.REQUEST__PROJECT_COLLECTION);
        var project = collection.where({'url': aPass.workflow.get('project')})[0];
        this._layoutViewNewWorkflowRun = new LayoutViewNewWorkflowRun({workflow: aPass.workflow, project: project});
        this._rodanChannel.request(Events.COMMAND__LAYOUTVIEW_SHOW, this._layoutViewNewWorkflowRun);
    }
}

export default WorkflowRunController;
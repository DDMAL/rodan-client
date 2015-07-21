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
     * Basic constructor.
     */
    constructor(aOptions)
    {
        super(aOptions);
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
        this._rodanChannel.on(Events.EVENT__WORKFLOWRUN_SELECTED, aPass => this._handleEventItemSelected(aPass));
        this._rodanChannel.on(Events.EVENT__WORKFLOWRUNCREATOR_SELECTED, aPass => this._handleCommandCreateWorkflowRun(aPass));
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aPass)
    {
        this._viewItem = new ViewWorkflowRun({workflowRun: aPass.workflowrun});
        this._rodanChannel.command(Events.COMMAND__LAYOUTVIEW_SHOW, this._viewItem);
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        this._viewList = new ViewWorkflowRunList();
        this._rodanChannel.command(Events.COMMAND__LAYOUTVIEW_SHOW, this._viewList);
    }

    /**
     * Handle workflow run creation.
     */
    _handleCommandCreateWorkflowRun(aPass)
    {
        this._layoutViewNewWorkflowRun = new LayoutViewNewWorkflowRun({workflow: aPass.workflow});
        this._rodanChannel.command(Events.COMMAND__LAYOUTVIEW_SHOW, this._layoutViewNewWorkflowRun);
    }
}

export default WorkflowRunController;
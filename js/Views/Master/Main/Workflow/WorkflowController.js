import Events from '../../../../Shared/Events';
import LayoutViewWorkflow from './LayoutViewWorkflow';
import ViewWorkflow from './Individual/ViewWorkflow';
import ViewWorkflowList from './List/ViewWorkflowList';
import BaseController from '../../../../Controllers/BaseController';

/**
 * Controller for all Workflow views.
 */
class WorkflowController extends BaseController
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
        this._rodanChannel.on(Events.EVENT__WORKFLOWS_SELECTED, aPass => this._handleEventListSelected(aPass));
        this._rodanChannel.on(Events.EVENT__WORKFLOW_SELECTED, () => this._handleEventItemSelected());
        this._rodanChannel.on(Events.COMMAND__WORKFLOW_DELETE, aPass => this._handleCommandDeleteWorkflow(aPass));
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected(aPass)
    {
        this._layoutView = new LayoutViewWorkflow();
        this._rodanChannel.command(Events.COMMAND__LAYOUTVIEW_SHOW, this._layoutView);
        this._viewList = new ViewWorkflowList({project: aPass.project});
        this._layoutView.showList(this._viewList);
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected()
    {
        this._viewItem = new ViewWorkflow();
        this._layoutView.showItem(this._viewItem);
    }

    /**
     * Handle command delete workflow.
     */
    _handleCommandDeleteWorkflow(aPass)
    {
        aPass.workflow.destroy();
    }
}

export default WorkflowController;
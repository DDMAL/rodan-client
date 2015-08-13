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
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.on(Events.EVENT__WORKFLOWS_SELECTED, options => this._handleEventListSelected(options));
        this._rodanChannel.on(Events.EVENT__WORKFLOW_SELECTED, () => this._handleEventItemSelected());
        this._rodanChannel.on(Events.COMMAND__WORKFLOW_DELETE, options => this._handleCommandDeleteWorkflow(options));
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected(options)
    {
        this._layoutView = new LayoutViewWorkflow();
        this._rodanChannel.request(Events.COMMAND__LAYOUTVIEW_SHOW, this._layoutView);
        this._viewList = new ViewWorkflowList({project: options.project});
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
    _handleCommandDeleteWorkflow(options)
    {
        options.workflow.destroy();
    }
}

export default WorkflowController;
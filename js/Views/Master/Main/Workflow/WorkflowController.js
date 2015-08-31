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
        this._rodanChannel.on(Events.EVENT__WORKFLOW_SELECTED, options => this._handleEventItemSelected(options));
        this._rodanChannel.reply(Events.COMMAND__WORKFLOW_DELETE, options => this._handleCommandDeleteWorkflow(options));
        this._rodanChannel.reply(Events.COMMAND__WORKFLOW_SHOWLAYOUTVIEW, options => this._handleCommandShowLayoutView(options));

    }
   
    /**
     * Handle show LayoutView.
     */
    _handleCommandShowLayoutView(options)
    {
        this._layoutView = options.layoutView;
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
    _handleEventItemSelected(options)
    {
        this._viewItem = new ViewWorkflow({model: options.workflow});
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
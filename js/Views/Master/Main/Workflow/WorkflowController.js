import Events from '../../../../Shared/Events';
import LayoutViewWorkflow from './LayoutViewWorkflow';
import ViewWorkflow from './Individual/ViewWorkflow';
import ViewWorkflowList from './List/ViewWorkflowList';
import Workflow from '../../../../Models/Workflow';
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
        this._rodanChannel.reply(Events.REQUEST__WORKFLOW_DELETE, options => this._handleCommandDeleteWorkflow(options));
        this._rodanChannel.reply(Events.REQUEST__WORKFLOW_SHOWLAYOUTVIEW, options => this._handleCommandShowLayoutView(options));
        this._rodanChannel.reply(Events.REQUEST__WORKFLOW_ADD, options => this._handleCommandAddWorkflow(options));
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
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this._layoutView);
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
        // Clear the individual view (if there).
        if (this._viewItem != null && options.workflow == this._viewItem.model)
        {
            this._layoutView.clearItemView();
        }

        // Remove.
        options.workflow.destroy();
        var collection = this._rodanChannel.request(Events.REQUEST__COLLECTION_WORKFLOW);
        collection.remove(options.workflow);
    }

    /**
     * Handle command add workflow.
     */
    _handleCommandAddWorkflow(options)
    {
        var workflows = this._rodanChannel.request(Events.REQUEST__COLLECTION_WORKFLOW);
        var workflow = workflows.create({project: options.project.get('url'), name: 'untitled'});
        return workflow;
    }
}

export default WorkflowController;
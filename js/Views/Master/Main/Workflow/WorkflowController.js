import Events from '../../../../Shared/Events';
import LayoutViewWorkflow from './LayoutViewWorkflow';
import ViewWorkflow from './Individual/ViewWorkflow';
import ViewWorkflowList from './List/ViewWorkflowList';
import Workflow from '../../../../Models/Workflow';
import BaseController from '../../../../Controllers/BaseController';
import WorkflowJobGroup from '../../../../Models/WorkflowJobGroup';
import WorkflowCollection from '../../../../Collections/WorkflowCollection';

/**
 * Controller for all Workflow views.
 */
class WorkflowController extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Initialization
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
        this._rodanChannel.reply(Events.REQUEST__WORKFLOW_IMPORT, options => this._handleRequestImportWorkflow(options));
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWS_SYNC, options => this._handleRequestWorkflowsSync(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
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
        this._collection = new WorkflowCollection()
        this._collection.fetch({data: {project: options.project.id}});
        this._rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__WORKFLOWS_SYNC, 
                                                                       options: {}, 
                                                                       callback: null});
        this._layoutView = new LayoutViewWorkflow();
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this._layoutView);
        this._viewList = new ViewWorkflowList({collection: this._collection});
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
        this._collection.remove(options.workflow);
    }

    /**
     * Handle command add workflow.
     */
    _handleCommandAddWorkflow(options)
    {
        return this._collection.create({project: options.project.get('url'), name: 'untitled'});
    }

    /**
     * Handle request import Workflow.
     */
    _handleRequestImportWorkflow(options)
    {
        var workflow = options.target;
        var originWorkflow = options.origin;
        var newGroup = new WorkflowJobGroup({'workflow': workflow.get('url'), 'origin': originWorkflow.get('url')});
        newGroup.save({}, {success: () => this._handleSuccessWorkflowJobGroupSave(workflow)});
    }

    /**
     * Handle request Workflows sync.
     */
    _handleRequestWorkflowsSync(options)
    {
        this._collection.syncList();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - REST handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Requests a GUI clear and loads the given Workflow.
     */
    _handleSuccessWorkflowJobGroupSave(workflow)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW, {workflow: workflow});
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_CLEAR);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW, {workflow: workflow});
    }
}

export default WorkflowController;
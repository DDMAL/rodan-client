import BaseController from './BaseController';
import Events from '../Shared/Events';
import LayoutViewModel from '../Views/Master/Main/LayoutViewModel';
import ViewWorkflow from '../Views/Master/Main/Workflow/Individual/ViewWorkflow';
import ViewWorkflowList from '../Views/Master/Main/Workflow/List/ViewWorkflowList';
import Workflow from '../Models/Workflow';
import WorkflowJobGroup from '../Models/WorkflowJobGroup';
import WorkflowCollection from '../Collections/WorkflowCollection';

/**
 * Controller for all Workflow views.
 */
class ControllerWorkflow extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Initialization
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        // Events.
        this.rodanChannel.on(Events.EVENT__WORKFLOW_SELECTED_COLLECTION, options => this._handleEventListSelected(options));
        this.rodanChannel.on(Events.EVENT__WORKFLOW_SELECTED, options => this._handleEventItemSelected(options));

        // Requests.
        this.rodanChannel.reply(Events.REQUEST__WORKFLOW_SAVE, options => this._handleRequestSaveWorkflow(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOW_DELETE, options => this._handleCommandDeleteWorkflow(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOW_CREATE, options => this._handleCommandAddWorkflow(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle list selection.
     */
    _handleEventListSelected(options)
    {
        this._collection = new WorkflowCollection()
        this._collection.fetch({data: {project: options.project.id}});
        this.rodanChannel.request(Events.REQUEST__TIMER_SET_FUNCTION, {function: () => this._collection.syncList()});
        this._layoutView = new LayoutViewModel();
        this.rodanChannel.request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: this._layoutView});
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
        if (this._viewItem !== null && options.workflow === this._viewItem.model)
        {
            this._layoutView.clearItemView();
        }
        options.workflow.destroy({success: (model) => this._handleDeleteSuccess(model, this._collection)});
    }

    /**
     * Handle command add workflow.
     */
    _handleCommandAddWorkflow(options)
    {
        var workflow = new Workflow({project: options.project.get('url'), name: 'untitled'});
        workflow.save({}, {success: (model) => this._handleCreateSuccess(model, this._collection)});
    }

    /**
     * Handle save workflow.
     */
    _handleRequestSaveWorkflow(options)
    {
        options.workflow.save(options.fields, {patch: true, success: (model) => this.rodanChannel.trigger(Events.EVENT__WORKFLOW_SAVED, {workflow: options.workflow})});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - REST handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle create success.
     */
    _handleCreateSuccess(model, collection)
    {
        collection.add(model);
        this.rodanChannel.trigger(Events.EVENT__WORKFLOW_CREATED, {workflow: model})
    }

    /**
     * Handle delete success.
     */
    _handleDeleteSuccess(model, collection)
    {
        collection.remove(model);
        this.rodanChannel.trigger(Events.EVENT__WORKFLOW_DELETED, {workflow: model})
    }
}

export default ControllerWorkflow;
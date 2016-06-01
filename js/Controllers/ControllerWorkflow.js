import BaseController from './BaseController';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import LayoutViewModel from 'js/Views/Master/Main/LayoutViewModel';
import Radio from 'backbone.radio';
import ViewWorkflow from 'js/Views/Master/Main/Workflow/Individual/ViewWorkflow';
import ViewWorkflowCollection from 'js/Views/Master/Main/Workflow/Collection/ViewWorkflowCollection';
import Workflow from 'js/Models/Workflow';
import WorkflowCollection from 'js/Collections/WorkflowCollection';

/**
 * Controller for Workflows.
 */
export default class ControllerWorkflow extends BaseController
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
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__WORKFLOW_SELECTED_COLLECTION, options => this._handleEventListSelected(options));
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__WORKFLOW_SELECTED, options => this._handleEventItemSelected(options));

        // Requests.
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__WORKFLOW_SAVE, options => this._handleRequestSaveWorkflow(options), this);
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__WORKFLOW_DELETE, options => this._handleCommandDeleteWorkflow(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__WORKFLOW_CREATE, options => this._handleCommandAddWorkflow(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle list selection.
     */
    _handleEventListSelected(options)
    {
        this._collection = new WorkflowCollection();
        this._collection.fetch({data: {project: options.project.id}});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__UPDATER_SET_COLLECTIONS, {collections: [this._collection]});
        this._layoutView = new LayoutViewModel();
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MAINREGION_SHOW_VIEW, {view: this._layoutView});
        this._viewList = new ViewWorkflowCollection({collection: this._collection});
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
        options.workflow.save(options.fields, {patch: true, success: (model) => Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__WORKFLOW_SAVED, {workflow: model})});
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
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__WORKFLOW_CREATED, {workflow: model});
    }

    /**
     * Handle delete success.
     */
    _handleDeleteSuccess(model, collection)
    {
        collection.remove(model);
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__WORKFLOW_DELETED, {workflow: model});
    }
}
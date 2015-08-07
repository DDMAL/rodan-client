import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewWorkflowRunListItem from './ViewWorkflowRunListItem';

/**
 * This class represents the view for a single Workflow summary.
 */
class ViewWorkflow extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize()
    {
        this.modelEvents = {
            'all': 'render'
        };
        this.ui = {
            workflowDuplicate: '#workflow-duplicate',
            workflowEdit: '#workflow-edit',
            workflowDelete: '#workflow-delete'
        };
        this.events = {
            'click @ui.workflowDuplicate': '_handleButtonWorkflowDuplicate',
            'click @ui.workflowEdit': '_handleButtonWorkflowEdit',
            'click @ui.workflowDelete': '_handleButtonWorkflowDelete'
        };
        this._initializeRadio();
        this.template = '#template-main_workflow_individual';
        this.childView = ViewWorkflowRunListItem;
        this.childViewContainer = 'tbody';
    }

    /**
     * Returns the associated WorkflowRun collection to the template.
     */
    templateHelpers() 
    {
        return { items: this.collection.toJSON() };
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.on(Events.EVENT__WORKFLOW_SELECTED, aReturn => this._handleEventItemSelected(aReturn));
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aReturn)
    {
        this.model = aReturn.workflow;
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_WORKFLOWRUN);
        this.rodanChannel.command(Events.COMMAND__LOAD_WORKFLOWRUNS, {query: {workflow: this.model.id}});
    }

    /**
     * Handle button workflow duplicate.
     */
    _handleButtonWorkflowDuplicate()
    {
        alert('not implemented');
    }

    /**
     * Handle button workflow edit.
     */
    _handleButtonWorkflowEdit()
    {
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_SELECTED, {workflow: this.model});
    }

    /**
     * Handle button workflow delete.
     */
    _handleButtonWorkflowDelete()
    {
        var confirmation = confirm('Are you sure you want to delete workflow "' + this.model.attributes.name + '"?');
        if (confirmation)
        {
            this.rodanChannel.trigger(Events.COMMAND__WORKFLOW_DELETE, {workflow: this.model});
        }
    }
}

export default ViewWorkflow;
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewWorkflowRunListItem from './ViewWorkflowRunListItem';

/**
 * This class represents the view for a single Workflow summary.
 */
class ViewWorkflow extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize
     */
    initialize()
    {
        this._initializeRadio();
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

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflow.prototype.modelEvents = {
            'all': 'render'
        };
ViewWorkflow.prototype.ui = {
            workflowDuplicate: '#workflow-duplicate',
            workflowEdit: '#workflow-edit',
            workflowDelete: '#workflow-delete'
        };
ViewWorkflow.prototype.events = {
            'click @ui.workflowDuplicate': '_handleButtonWorkflowDuplicate',
            'click @ui.workflowEdit': '_handleButtonWorkflowEdit',
            'click @ui.workflowDelete': '_handleButtonWorkflowDelete'
        };
ViewWorkflow.prototype.template = '#template-main_workflow_individual';

export default ViewWorkflow;
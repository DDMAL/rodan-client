import Marionette from 'backbone.marionette';
import Events from '../../../../../Shared/Events';
import Radio from 'backbone.radio';

/**
 * Workflow view.
 */
export default class ViewWorkflow extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle button run workflow.
     */
    _handleButtonRunWorkflow()
    {
        if (!this.model.get('valid'))
        {
            alert('The workflow must be valid prior to run.');
        }
        else
        {
            Radio.channel('rodan').trigger(Events.EVENT__WORKFLOWBUILDER_CREATE_WORKFLOWRUN, {workflow: this.model});
        }
    }

    /**
     * Handle button delete workflow.
     */
    _handleButtonDeleteWorkflow()
    {
        Radio.channel('rodan').request(Events.REQUEST__WORKFLOW_DELETE, {workflow: this.model});
    }

    /**
     * Handle button edit workflow.
     */
    _handleButtonEditWorkflow()
    {
        Radio.channel('rodan').trigger(Events.EVENT__WORKFLOWBUILDER_SELECTED, {workflow: this.model});
    }

    /**
     * Handle button copy workflow.
     */
    _handleButtonCopyWorkflow()
    {
        alert('not yet implemented');
    }

    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        Radio.channel('rodan').request(Events.REQUEST__MODAL_HIDE);
        Radio.channel('rodan').request(Events.REQUEST__WORKFLOW_SAVE, {workflow: this.model, fields: {name: this.ui.textName.val(), description: this.ui.textDescription.val()}});
    }
}
ViewWorkflow.prototype.modelEvents = {
            'all': 'render'
        };
ViewWorkflow.prototype.ui = {
    runWorkflowButton: '#button-run_workflow',
    deleteWorkflowButton: '#button-delete_workflow',
    copyWorkflowButton: '#button-copy_workflow',
    editWorkflowButton: '#button-edit_workflow',
    buttonSaveData: '#button-save_workflow_data',
    buttonSave: '#button-save_workflow',
    textName: '#text-workflow_name',
    textDescription: '#text-workflow_description'
        };
ViewWorkflow.prototype.events = {
    'click @ui.runWorkflowButton': '_handleButtonRunWorkflow',
    'click @ui.deleteWorkflowButton': '_handleButtonDeleteWorkflow',
    'click @ui.editWorkflowButton': '_handleButtonEditWorkflow',
    'click @ui.copyWorkflowButton': '_handleButtonCopyWorkflow',
    'click @ui.buttonSaveData': '_handleButtonSave',
    'click @ui.buttonSave': '_handleButtonSave'
        };
ViewWorkflow.prototype.template = '#template-main_workflow_individual';
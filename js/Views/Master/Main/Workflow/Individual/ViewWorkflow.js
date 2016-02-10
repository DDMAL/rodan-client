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
        this._rodanChannel = Radio.channel('rodan');
    }

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
            this._rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_CREATE_WORKFLOWRUN, {workflow: this.model});
        }
    }

    /**
     * Handle button delete workflow.
     */
    _handleButtonDeleteWorkflow()
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOW_DELETE, {workflow: this.model});
    }

    /**
     * Handle button edit workflow.
     */
    _handleButtonEditWorkflow()
    {
        this._rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_SELECTED, {workflow: this.model});
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
        this.model.set({name: this.ui.textName.val(), description: this.ui.textDescription.val()});
        this._rodanChannel.request(Events.REQUEST__WORKFLOW_SAVE, {workflow: this.model});
    }

    /**
     * Handle run button.
     */
    _handleButtonRun()
    {
        if (!this.model.get('valid'))
        {
            alert('The workflow must be valid prior to run.');
        }
        else
        {
            this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_CREATE_WORKFLOWRUN, {model: this.model});
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
    runWorkflowButton: '#button-run_workflow',
    deleteWorkflowButton: '#button-delete_workflow',
    copyWorkflowButton: '#button-copy_workflow',
    editWorkflowButton: '#button-edit_workflow',
    buttonSaveData: '#button-save_workflow_data',
    buttonSave: '#button-save_workflow',
    buttonRun: '#button-run_workflow',
    textName: '#text-workflow_name',
    textDescription: '#text-workflow_description'
        };
ViewWorkflow.prototype.events = {
    'click @ui.runWorkflowButton': '_handleButtonRunWorkflow',
    'click @ui.deleteWorkflowButton': '_handleButtonDeleteWorkflow',
    'click @ui.editWorkflowButton': '_handleButtonEditWorkflow',
    'click @ui.copyWorkflowButton': '_handleButtonCopyWorkflow',
    'click @ui.buttonSaveData': '_handleButtonSave',
    'click @ui.buttonSave': '_handleButtonSave',
    'click @ui.buttonRun': '_handleButtonRun'
        };
ViewWorkflow.prototype.template = '#template-main_workflow_individual';

export default ViewWorkflow;
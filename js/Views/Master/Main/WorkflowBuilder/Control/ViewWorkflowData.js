import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * This class represents the basic data for a Workflow.
 */
class ViewWorkflowData extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this._initializeRadio();
        this.model = aParameters.workflow;
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
    }

    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        this.rodanChannel.request(Events.COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOW, {name: this.ui.textName.val(), description: this.ui.textDescription.val()});
    }

    /**
     * Handle validate button.
     */
    _handleButtonValidate()
    {
        this.rodanChannel.request(Events.COMMAND__WORKFLOWBUILDER_VALIDATE_WORKFLOW);
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
            this.rodanChannel.trigger(Events.EVENT__WORKFLOWRUNCREATOR_SELECTED, {workflow: this.model});
        }
    }

    /**
     * Handle group button.
     */
    _handleButtonGroup()
    {
        this.rodanChannel.request(Events.COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_WORKFLOWJOBGROUPS);
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflowData.prototype.modelEvents = {
    'all': 'render'
};
ViewWorkflowData.prototype.template = '#template-main_workflowbuilder_control_workflow_data';
ViewWorkflowData.prototype.ui = {
    buttonSave: '#button-save_workflow_data',
    buttonValidate: '#button-validate_workflow',
    buttonRun: '#button-run_workflow',
    buttonGroup: '#button-groups',
    textName: '#text-workflow_name',
    textDescription: '#text-workflow_description'
};
ViewWorkflowData.prototype.events = {
    'click @ui.buttonSave': '_handleButtonSave',
    'click @ui.buttonValidate': '_handleButtonValidate',
    'click @ui.buttonRun': '_handleButtonRun',
    'click @ui.buttonGroup': '_handleButtonGroup'
};

export default ViewWorkflowData;
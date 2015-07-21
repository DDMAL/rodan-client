import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../Shared/Events';

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
        this.modelEvents = {
            "all": "render"
        };
        this._initializeRadio();
        this.model = aParameters.workflow;
        this._initializeRadio();
        this.template = "#template-main_workflowbuilder_control_workflow_data";
        this.ui = {
            buttonSave: '#button-save_workflow_data',
            buttonValidate: '#button-validate_workflow',
            buttonRun: '#button-run_workflow',
            textName: '#text-workflow_name',
            textDescription: '#text-workflow_description'
        }
        this.events = {
            'click @ui.buttonSave': '_handleButtonSave',
            'click @ui.buttonValidate': '_handleButtonValidate',
            'click @ui.buttonRun': '_handleButtonRun'
        };
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
    }

    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOW, {name: this.ui.textName.val(), description: this.ui.textDescription.val()});
    }

    /**
     * Handle validate button.
     */
    _handleButtonValidate()
    {
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_VALIDATE_WORKFLOW);
    }

    /**
     * Handle run button.
     */
    _handleButtonRun()
    {
        if (!this.model.get("valid"))
        {
            alert("The workflow must be valid prior to run.");
        }
        else
        {
            this.rodanChannel.trigger(Events.EVENT__WORKFLOWRUNCREATOR_SELECTED, {workflow: this.model});
        }
    }
}

export default ViewWorkflowData;
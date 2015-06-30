import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../Shared/VISRC_Events';

/**
 * This class represents the basic data for a Workflow.
 */
class VISRC_ViewWorkflowData extends Marionette.ItemView
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
            textName: '#text-workflow_name',
            textDescription: '#text-workflow_description'
        }
        this.events = {
            'click @ui.buttonSave': '_handleButtonSave',
            'click @ui.buttonValidate': '_handleButtonValidate'
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
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOW, {name: this.ui.textName.val(), description: this.ui.textDescription.val()});
    }

    /**
     * Handle validate button.
     */
    _handleButtonValidate()
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_VALIDATE_WORKFLOW);
    }
}

export default VISRC_ViewWorkflowData;
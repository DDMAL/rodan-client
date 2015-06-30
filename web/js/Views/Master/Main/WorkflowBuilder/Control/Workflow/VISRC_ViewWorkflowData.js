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
            textName: '#text-workflow_name',
            textDescription: '#text-workflow_description'
        }
        this.events = {
            'click @ui.buttonSave': '_handleButtonSave'
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
    {debugger;
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOW, {name: this.ui.textName.val(), description: this.ui.textDescription.val()});
    }
}

export default VISRC_ViewWorkflowData;
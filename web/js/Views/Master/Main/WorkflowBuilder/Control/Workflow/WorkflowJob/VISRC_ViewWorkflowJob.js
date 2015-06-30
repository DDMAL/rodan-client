import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../../Shared/VISRC_Events';

/**
 * This class represents the view for editing a workflow job.
 */
class VISRC_ViewWorkflowJob extends Marionette.ItemView
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
        this.ui = {
            buttonShowWorkflow: '#button-show_workflow'
        }
        this.events = {
            'click @ui.buttonShowWorkflow': '_handleButtonShowWorkflow'
        };
        this.model = aParameters.workflowjob;
        this._initializeRadio();
        this.template = "#template-main_workflowbuilder_control_workflowjob_individual";
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
     * Handle button show workflow.
     */
    _handleButtonShowWorkflow()
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, {});
    }
}

export default VISRC_ViewWorkflowJob;
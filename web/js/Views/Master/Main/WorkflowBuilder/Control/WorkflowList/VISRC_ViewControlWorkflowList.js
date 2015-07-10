import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../Shared/VISRC_Events';

/**
 * This class represents the view for a list of workflows.
 */
class VISRC_ViewControlWorkflowList extends Marionette.ItemView
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
            newWorkflowButton: '#button-new_workflow'
        }
        this.events = {
            'click @ui.newWorkflowButton': '_handleButtonNewWorkflow'
        };
        this._initializeRadio();
        this.template = "#template-main_workflowbuilder_control_workflow_list";
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
     * Handle button new workflow.
     */
    _handleButtonNewWorkflow()
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_WORKFLOW);
    }
}

export default VISRC_ViewControlWorkflowList;
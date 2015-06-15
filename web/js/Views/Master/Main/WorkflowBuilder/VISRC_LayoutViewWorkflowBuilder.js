import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';

/**
 * This is a layout to help render the workflow builder.
 */
class VISRC_LayoutViewWorkflowBuilder extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize(aOptions)
    {
        this.addRegions({
            regionControlEditWorkflow: "#region-main_workflowbuilder_control_editworkflow",
            regionControlJobList: "#region-main_workflowbuilder_control_job_list",
            regionControlJob: "#region-main_workflowbuilder_control_job"
        });
        this.template = "#template-main_workflowbuilder";
        this.ui = {
            newWorkflowButton: '#button-new_workflow'
        }
        this.events = {
            'click @ui.newWorkflowButton': '_handleButtonNewWorkflow'
        };
        this._initializeRadio();
    }

    /**
     * Show the edit workflow control view.
     */
    showControlEditWorkflow(aView)
    {
        this.regionControlEditWorkflow.show(aView, {preventDestroy: true});
    }

    /**
     * TODO docs
     */
    showControlJobList(aView)
    {
        this.regionControlJobList.show(aView, {preventDestroy: true});
    }

    /**
     * TODO docs
     */
    showControlJob(aView)
    {
        this.regionControlJob.show(aView, {preventDestroy: true});
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

export default VISRC_LayoutViewWorkflowBuilder;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../Shared/VISRC_Events';
import VISRC_ViewWorkflowData from './VISRC_ViewWorkflowData';
import VISRC_LayoutViewControlJob from './Job/VISRC_LayoutViewControlJob';
import VISRC_WorkflowJob from '../../../../../../Models/VISRC_WorkflowJob';

/**
 * This class represents the view for editing a Workflow.
 */
class VISRC_LayoutViewControlWorkflow extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.addRegions({
            regionControlWorkflowData: "#region-main_workflowbuilder_control_workflow_data",
            regionControlWorkflowParts: "#region-main_workflowbuilder_control_workflow_parts"
        });
        this._initializeRadio();
        this._initializeViews(aParameters);
        this._workflow = aParameters.workflow;
        this.template = "#template-main_workflowbuilder_control_workflow";
    }

    /**
     * Initially show the list.
     */
    onShow()
    {
        // TODO - don't want to do this, but for some reason my views get destroyed when
        // the containing region is destroyed!
        this.viewWorkflowData.isDestroyed = false;
        this.regionControlWorkflowData.show(this.viewWorkflowData, {preventDestroy: true});

        // Initially show the job list.
        this.viewControlJob.isDestroyed = false;
        this.regionControlWorkflowParts.show(this.viewControlJob, {preventDestroy: true});
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
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_WORKFLOWJOB, aReturn => this._handleCommandAddWorkflowJob(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_CONNECTION, aPass => this._handleCommandAddConnection(aPass));
    }

    /**
     * Initialize views.
     */
    _initializeViews(aParameters)
    {
        this.viewWorkflowData = new VISRC_ViewWorkflowData(aParameters);
        this.viewControlJob = new VISRC_LayoutViewControlJob();
    }

    /**
     * Handle command add workflow job.
     */
    _handleCommandAddWorkflowJob(aReturn)
    {
        var workflowJob = this._createWorkflowJob(aReturn.job, this._workflow);
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKSPACE_ADD_ITEM_WORKFLOWJOB, {workflowjob: workflowJob});
    }

    /**
     * Handle add connection.
     */
    _handleCommandAddConnection(aPass)
    {
        this._createConnection(aPass.outputport, aPass.inputport);
    }

    /**
     * Create workflow job.
     */
    _createWorkflowJob(aJob, aWorkflow)
    {debugger;
        var workflowJob = new VISRC_WorkflowJob({job: aJob.get("url"), workflow: this._workflow.get("url")});
        workflowJob.save();
        return workflowJob;
    }

    /**
     * Create connection.
     */
    _createConnection(aOutputPort, aInputPort)
    {
        var connection = new VISRC_Connection({input_port: aInputPort.get("url"), output_port: aOutputPort.get("url")});
        connection.save();
        this._workflow.get("connections").add(connection);
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKSPACE_ADD_ITEM_CONNECTION, {connection: connection, inputport: aInputPort, outputport: aOutputPort});
    }
}

export default VISRC_LayoutViewControlWorkflow;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Connection from '../../../../../../Models/VISRC_Connection';
import VISRC_Events from '../../../../../../Shared/VISRC_Events';
import VISRC_ViewWorkflowData from './VISRC_ViewWorkflowData';
import VISRC_LayoutViewWorkflowEditor from './VISRC_ViewWorkflowData';
import VISRC_LayoutViewControlJob from './Job/VISRC_LayoutViewControlJob';
import VISRC_LayoutViewControlResourceAssignment from './ResourceAssignment/VISRC_LayoutViewControlResourceAssignment';
import VISRC_LayoutViewControlWorkflowJob from './WorkflowJob/VISRC_LayoutViewControlWorkflowJob';
import VISRC_WorkflowJob from '../../../../../../Models/VISRC_WorkflowJob';
import VISRC_InputPort from '../../../../../../Models/VISRC_InputPort';
import VISRC_OutputPort from '../../../../../../Models/VISRC_OutputPort';
import VISRC_ResourceAssignment from '../../../../../../Models/VISRC_ResourceAssignment';

/**
 * This class represents the controller for editing a Workflow.
 */
class VISRC_WorkflowEditorController extends Marionette.LayoutView
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
        this._workflow = aParameters.workflow;
        this._workflowJob = null;
        this._initializeRadio();
        this.template = "#template-main_workflowbuilder_control_workflow";
        this._initializeViews(aParameters);
    }

    onBeforeShow(aParameters)
    {
        this.regionControlWorkflowData.show(this.viewWorkflowData);
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
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_INPUTPORT, aPass => this._handleCommandAddInputPort(aPass));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_OUTPUTPORT, aPass => this._handleCommandAddOutputPort(aPass));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_DELETE_INPUTPORT, aPass => this._handleCommandDeleteInputPort(aPass));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_DELETE_OUTPUTPORT, aPass => this._handleCommandDeleteOutputPort(aPass));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOW, aPass => this._handleCommandSaveWorkflow(aPass));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_VALIDATE_WORKFLOW, () => this._handleCommandValidateWorkflow());
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_RUN_WORKFLOW, () => this._handleCommandRunWorkflow());
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_RESOURCEASSIGNMENT, aPass => this._handleCommandAddResourceAssignment(aPass));

        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, () => this._handleCommandShowControlJobView());
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_RESOURCEASSIGNMENT, () => this._handleCommandShowControlResourceAssignmentView());

        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED, aReturn => this._handleEventEditWorkflowJob(aReturn));
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
        this.rodanChannel.command(VISRC_Events.COMMAND__WorkflowBuilder_ADD_ITEM_WORKFLOWJOB, {workflowjob: workflowJob});
    }

    /**
     * Handle add connection.
     */
    _handleCommandAddConnection(aPass)
    {
        this._createConnection(aPass.outputport, aPass.inputport);
    }

    /**
     * Handle event edit workflow job.
     */
    _handleEventEditWorkflowJob(aReturn)
    {
        this._workflowJob = aReturn.workflowjob;

        // TODO - not reusing this view...should find more efficient way
        this.controlWorkflowJobView = new VISRC_LayoutViewControlWorkflowJob(aReturn);
        try
        {
            this.regionControlWorkflowParts.show(this.controlWorkflowJobView);
        }
        catch (exception)
        {
            console.log("TODO - not sure why error is being thrown: https://github.com/ELVIS-Project/vis-client/issues/6");
        }
    }
    
    /**
     * Handle command show job control view.
     */
    _handleCommandShowControlJobView()
    {
        // TODO - not reusing this view...should find more efficient way
        this.viewControlJob = new VISRC_LayoutViewControlJob();
        this.regionControlWorkflowParts.show(this.viewControlJob);
    }

    /**
     * Handle command show resource assignment control view.
     */
    _handleCommandShowControlResourceAssignmentView()
    {
        // TODO - not reusing this view...should find more efficient way
        this.viewControlResourceAssignment = new VISRC_LayoutViewControlResourceAssignment();
        this.regionControlWorkflowParts.show(this.viewControlResourceAssignment);
    }

    /**
     * Create input port
     */
    _handleCommandAddInputPort(aPass)
    {
        var port = this._createInputPort(aPass.inputporttype, this._workflowJob);
    }

    /**
     * Create output port
     */
    _handleCommandAddOutputPort(aPass)
    {
        var port = this._createOutputPort(aPass.outputporttype, this._workflowJob);
    }

    /**
     * Delete input port
     */
    _handleCommandDeleteInputPort(aPass)
    {
        this._deleteInputPort(aPass.inputport, this._workflowJob);
    }

    /**
     * Delete output port
     */
    _handleCommandDeleteOutputPort(aPass)
    {
        this._deleteOutputPort(aPass.outputport, this._workflowJob);
    }

    /**
     * Handle save workflow.
     */
    _handleCommandSaveWorkflow(aPass)
    {
        this._workflow.save(aPass, {patch: true});
    }

    /**
     * Handle validate workflow.
     */
    _handleCommandValidateWorkflow()
    {
        this._workflow.save({valid: true}, {patch: true, error: this._handleResponseValidateError, success: this._handleResponseValidateSuccess});
    }

    /**
     * Handle add resource assignment.
     */
    _handleCommandAddResourceAssignment(aPass)
    {
        this._createResourceAssignment(aPass.resource, aPass.inputport);
    }

    /**
     * Handle run workflow.
     */
    _handleCommandRunWorkflow()
    {
        console.log("run");
    }

    /**
     * Handle validate error response.
     */
    _handleResponseValidateError(aModel, aResponse, aOptions)
    {
        // TODO - put this in some kind of handler outside of this class
        alert(aResponse.responseJSON.detail);
    }

    /**
     * Handle validate response.
     */
    _handleResponseValidateSuccess(aModel, aResponse, aOptions)
    {
        // TODO - put this in some kind of handler outside of this class
        alert("The workflow is valid.");
    }

    /**
     * Create input port.
     */
    _createInputPort(aInputPortType, aWorkflowJob)
    {
        var port = new VISRC_InputPort({input_port_type: aInputPortType.get("url"), workflow_job: aWorkflowJob.get("url")});
        port.save();
        aWorkflowJob.get("input_ports").add(port);
        this.rodanChannel.command(VISRC_Events.COMMAND__WorkflowBuilder_ADD_ITEM_INPUTPORT, {workflowjob: aWorkflowJob, inputport: port});
    }

    /**
     * Create input port.
     */
    _createOutputPort(aOutputPortType, aWorkflowJob)
    {
        var port = new VISRC_OutputPort({output_port_type: aOutputPortType.get("url"), workflow_job: aWorkflowJob.get("url")});
        port.save();
        aWorkflowJob.get("output_ports").add(port);
        this.rodanChannel.command(VISRC_Events.COMMAND__WorkflowBuilder_ADD_ITEM_OUTPUTPORT, {workflowjob: aWorkflowJob, outputport: port});
    }

    /**
     * Delete input port.
     */
    _deleteInputPort(aPort, aWorkflowJob)
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__WorkflowBuilder_DELETE_ITEM_INPUTPORT, {workflowjob: aWorkflowJob, inputport: aPort});
        try
        {
            aPort.destroy();
        }
        catch (aError)
        {
            console.log("TODO - not sure why this error is happening; see https://github.com/ELVIS-Project/vis-client/issues/5");
        }
    }

    /**
     * Delete output port.
     */
    _deleteOutputPort(aPort, aWorkflowJob)
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__WorkflowBuilder_DELETE_ITEM_OUTPUTPORT, {workflowjob: aWorkflowJob, outputport: aPort});
        try
        {
            aPort.destroy();
        }
        catch (aError)
        {
            console.log("TODO - not sure why this error is happening; see https://github.com/ELVIS-Project/vis-client/issues/5");
        }
    }

    /**
     * Create workflow job.
     */
    _createWorkflowJob(aJob, aWorkflow)
    {
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
        this.rodanChannel.command(VISRC_Events.COMMAND__WorkflowBuilder_ADD_ITEM_CONNECTION, {connection: connection, inputport: aInputPort, outputport: aOutputPort});
    }

    /**
     * Create resource assignment.
     */
    _createResourceAssignment(aResource, aInputPort)
    {
        var resourceAssignment = new VISRC_ResourceAssignment();
        // todo
        this.rodanChannel.command(VISRC_Events.COMMAND__WorkflowBuilder_ADD_ITEM_RESOURCEASSIGNMENT, {resourceassignment: resourceAssignment, resource: aResource, inputport: aInputPort});
    }
}

export default VISRC_WorkflowEditorController;
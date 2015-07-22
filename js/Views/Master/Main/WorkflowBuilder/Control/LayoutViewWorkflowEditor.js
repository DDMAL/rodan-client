import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Connection from '../../../../../Models/Connection';
import Events from '../../../../../Shared/Events';
import ViewWorkflowData from './ViewWorkflowData';
import LayoutViewControlJob from './Job/LayoutViewControlJob';
import LayoutViewControlWorkflowJob from './WorkflowJob/LayoutViewControlWorkflowJob';
import WorkflowJob from '../../../../../Models/WorkflowJob';
import InputPort from '../../../../../Models/InputPort';
import OutputPort from '../../../../../Models/OutputPort';

/**
 * This class represents the controller for editing a Workflow.
 */
class WorkflowEditorController extends Marionette.LayoutView
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
            regionControlWorkflowData: '#region-main_workflowbuilder_control_workflow_data',
            regionControlWorkflowParts: '#region-main_workflowbuilder_control_workflow_parts'
        });
        this._workflow = aParameters.workflow;
        this._workflowJob = null;
        this._initializeRadio();
        this.template = '#template-main_workflowbuilder_control_workflow';
        this._initializeViews(aParameters);

        // Load the full workflow.
        var options = {'success': () => this._handleWorkflowLoadSuccess()};
        this._workflow.fetch(options);
    }

    /**
     * Unbind from events.
     */
    onDestroy()
    {
        this.rodanChannel.off(null, null, this);
        this.rodanChannel.stopComplying(null, null, this);
        this.rodanChannel.stopReplying(null, null, this);
    }

    onBeforeShow()
    {
        this.regionControlWorkflowData.show(this.viewWorkflowData);
        this.regionControlWorkflowParts.show(this.viewControlJob);
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
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_ADD_WORKFLOWJOB, aReturn => this._handleCommandAddWorkflowJob(aReturn), this);
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_ADD_CONNECTION, aPass => this._handleCommandAddConnection(aPass), this);
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_ADD_INPUTPORT, aPass => this._handleCommandAddInputPort(aPass), this);
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_ADD_OUTPUTPORT, aPass => this._handleCommandAddOutputPort(aPass), this);
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_DELETE_INPUTPORT, aPass => this._handleCommandDeleteInputPort(aPass), this);
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_DELETE_OUTPUTPORT, aPass => this._handleCommandDeleteOutputPort(aPass), this);
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOW, aPass => this._handleCommandSaveWorkflow(aPass), this);
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOWJOB, aPass => this._handleCommandSaveWorkflowJob(aPass), this);
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_VALIDATE_WORKFLOW, () => this._handleCommandValidateWorkflow(), this);

        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, () => this._handleCommandShowControlJobView(), this);

        this.rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED, aReturn => this._handleEventEditWorkflowJob(aReturn), this);
    }

    /**
     * Initialize views.
     */
    _initializeViews(aParameters)
    {
        this.viewWorkflowData = new ViewWorkflowData(aParameters);
        this.viewControlJob = new LayoutViewControlJob();
    }

    /**
     * Handles success of workflow fetch.
     */
    _handleWorkflowLoadSuccess()
    {
        this._buildWorkflowInGui(this._workflow);
    }

    /**
     * Handle command add workflow job.
     */
    _handleCommandAddWorkflowJob(aReturn)
    {
        var workflowJob = this._createWorkflowJob(aReturn.job, this._workflow);
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB, {workflowjob: workflowJob});
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
        this.controlWorkflowJobView = new LayoutViewControlWorkflowJob(aReturn);
        this.regionControlWorkflowParts.show(this.controlWorkflowJobView);
    }
    
    /**
     * Handle command show job control view.
     */
    _handleCommandShowControlJobView()
    {
        // TODO - not reusing this view...should find more efficient way
        this.viewControlJob = new LayoutViewControlJob();
        this.regionControlWorkflowParts.show(this.viewControlJob);
    }

    /**
     * Create input port
     */
    _handleCommandAddInputPort(aPass)
    {
        var port = this._createInputPort(aPass.inputporttype, this._workflowJob);
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT, {workflowjob: this._workflowJob, inputport: port});
    }

    /**
     * Create output port
     */
    _handleCommandAddOutputPort(aPass)
    {
        var port = this._createOutputPort(aPass.outputporttype, this._workflowJob);
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT, {workflowjob: this._workflowJob, outputport: port});
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
     * Handle save workflowjob.
     */
    _handleCommandSaveWorkflowJob(aPass)
    {
        this._workflowJob.save(aPass, {patch: true});
    }

    /**
     * Handle validate workflow.
     */
    _handleCommandValidateWorkflow()
    {
        this._workflow.save({valid: true}, {patch: true, error: this._handleResponseValidateError, success: this._handleResponseValidateSuccess});
    }

    /**
     * Handle validate error response.
     */
    _handleResponseValidateError(aModel, aResponse, aOptions)
    {
        // TODO - put this in some kind of handler outside of this class
        alert(aResponse.responseJSON.detail);
        console.log(aModel);
        console.log(aResponse);
        console.log(aOptions);
    }

    /**
     * Handle validate response.
     */
    _handleResponseValidateSuccess(aModel, aResponse, aOptions)
    {
        // TODO - put this in some kind of handler outside of this class
        alert('The workflow is valid.');
        console.log(aModel);
        console.log(aResponse);
        console.log(aOptions);
    }

    /**
     * Builds the Workflow in GUI.
     */
    _buildWorkflowInGui(aModel)
    {
        var workflowJobs = aModel.get('workflow_jobs');
        if (workflowJobs !== undefined)
        {
            for (var i = 0; i < workflowJobs.length; i++)
            {
                var workflowJob = workflowJobs.at(i);
                this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB, {workflowjob: workflowJob});
            }
        }

//        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT, {workflowjob: this._workflowJob, inputport: aPass.inputporttype});
 //       this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT, {workflowjob: aWorkflowJob, outputport: port});

    }

    /**
     * Create input port.
     */
    _createInputPort(aInputPortType, aWorkflowJob)
    {
        var port = new InputPort({input_port_type: aInputPortType.get('url'), workflow_job: aWorkflowJob.get('url')});
        port.save();
        aWorkflowJob.get('input_ports').add(port);
    }

    /**
     * Create input port.
     */
    _createOutputPort(aOutputPortType, aWorkflowJob)
    {
        var port = new OutputPort({output_port_type: aOutputPortType.get('url'), workflow_job: aWorkflowJob.get('url')});
        port.save();
        aWorkflowJob.get('output_ports').add(port);
    }

    /**
     * Delete input port.
     */
    _deleteInputPort(aPort, aWorkflowJob)
    {
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_DELETE_ITEM_INPUTPORT, {workflowjob: aWorkflowJob, inputport: aPort});
        try
        {
            aPort.destroy();
        }
        catch (aError)
        {
            console.log('TODO - not sure why this error is happening; see https://github.com/ELVIS-Project/vis-client/issues/5');
        }
    }

    /**
     * Delete output port.
     */
    _deleteOutputPort(aPort, aWorkflowJob)
    {
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_DELETE_ITEM_OUTPUTPORT, {workflowjob: aWorkflowJob, outputport: aPort});
        try
        {
            aPort.destroy();
        }
        catch (aError)
        {
            console.log('TODO - not sure why this error is happening; see https://github.com/ELVIS-Project/vis-client/issues/5');
        }
    }

    /**
     * Create workflow job.
     */
    _createWorkflowJob(aJob, aWorkflow)
    {
        var workflowJob = new WorkflowJob({job: aJob.get('url'), workflow: aWorkflow.get('url')});
        workflowJob.save();
        return workflowJob;
    }

    /**
     * Create connection.
     */
    _createConnection(aOutputPort, aInputPort)
    {
        var connection = new Connection({input_port: aInputPort.get('url'), output_port: aOutputPort.get('url')});
        connection.save();
        this._workflow.get('connections').add(connection);
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION, {connection: connection, inputport: aInputPort, outputport: aOutputPort});
    }
}

export default WorkflowEditorController;
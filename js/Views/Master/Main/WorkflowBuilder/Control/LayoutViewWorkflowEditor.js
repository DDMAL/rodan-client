import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Configuration from '../../../../../Configuration';
import Connection from '../../../../../Models/Connection';
import Events from '../../../../../Shared/Events';
import ViewWorkflowData from './ViewWorkflowData';
import LayoutViewControlJob from './Job/LayoutViewControlJob';
import LayoutViewControlWorkflowJob from './WorkflowJob/LayoutViewControlWorkflowJob';
import WorkflowJob from '../../../../../Models/WorkflowJob';
import WorkflowJobCoordinateSet from '../../../../../Models/WorkflowJobCoordinateSet';
import InputPort from '../../../../../Models/InputPort';
import OutputPort from '../../../../../Models/OutputPort';

/**
 * This class represents the controller for editing a Workflow.
 */
class LayoutViewWorkflowEditor extends Marionette.LayoutView
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
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_ADD_WORKFLOWJOB, aReturn => this._handleCommandAddWorkflowJob(aReturn));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_ADD_CONNECTION, aPass => this._handleCommandAddConnection(aPass));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_ADD_INPUTPORT, aPass => this._handleCommandAddInputPort(aPass));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_ADD_OUTPUTPORT, aPass => this._handleCommandAddOutputPort(aPass));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_DELETE_INPUTPORT, aPass => this._handleCommandDeleteInputPort(aPass));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_DELETE_OUTPUTPORT, aPass => this._handleCommandDeleteOutputPort(aPass));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOW, aPass => this._handleCommandSaveWorkflow(aPass));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOWJOB, aPass => this._handleCommandSaveWorkflowJob(aPass));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOWJOB_COORDINATES, options => this._handleCommandSaveWorkflowJobCoordinates(options));
        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_VALIDATE_WORKFLOW, () => this._handleCommandValidateWorkflow());

        this.rodanChannel.comply(Events.COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, () => this._handleCommandShowControlJobView());

        this.rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED, aReturn => this._handleEventEditWorkflowJob(aReturn));
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
        // Attempt to get coordinate sets to pass. Regardless of success or not, we process the workflow.
        var query = {workflow: this._workflow.id, user_agent: Configuration.USER_AGENT};
        var callback = () => this._processWorkflow();
        this.rodanChannel.command(Events.COMMAND__WORKFLOWJOBCOORDINATESETS_LOAD, {query: query, success: callback, error: callback});
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
        //why are dead layout view still capturing this!!!
        this._workflowJob = aReturn.workflowjob;
        this.controlWorkflowJobView = new LayoutViewControlWorkflowJob(aReturn);
        this.regionControlWorkflowParts.show(this.controlWorkflowJobView);
    }
    
    /**
     * Handle command show job control view.
     */
    _handleCommandShowControlJobView()
    {
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
        this._workflow.save({valid: true}, {patch: true});
    }

    /**
     * Handle WorkflowJob coordinate save.
     */
    _handleCommandSaveWorkflowJobCoordinates(options)
    {
        // Check if a coordinate set is attached. If not, we have to create a new set.
        var workflowJob = options.workflowjob;
        if (workflowJob.hasOwnProperty('coordinates'))
        {
            workflowJob.coordinates.get('data').x = options.x;
            workflowJob.coordinates.get('data').y = options.y;
            workflowJob.coordinates.save({data: {x: options.x, y: options.y}}, {patch: true});
        }
        else
        {
            workflowJob.coordinates = new WorkflowJobCoordinateSet({workflow_job: workflowJob.get('url'),
                                                                    data: {x: options.x, y: options.y},
                                                                    user_agent: Configuration.USER_AGENT});
            workflowJob.coordinates.save();
        }
    }

    /**
     * Create input port.
     */
    _createInputPort(aInputPortType, aWorkflowJob)
    {
        var port = new InputPort({input_port_type: aInputPortType.get('url'), workflow_job: aWorkflowJob.get('url')});
        port.save();
        aWorkflowJob.get('input_ports').add(port);
        return port;
    }

    /**
     * Create input port.
     */
    _createOutputPort(aOutputPortType, aWorkflowJob)
    {
        var port = new OutputPort({output_port_type: aOutputPortType.get('url'), workflow_job: aWorkflowJob.get('url')});
        port.save();
        aWorkflowJob.get('output_ports').add(port);
        return port;
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

    /**
     * Process workflow for GUI.
     */
    _processWorkflow()
    {
        // Get the coordinates loaded for this workflow.
        var coordinateSetCollection = this.rodanChannel.request(Events.REQUEST__WORKFLOWJOBCOORDINATESET_COLLECTION);

        // Process all WorkflowJobs and their associated ports.
        var connections = {};
        var workflowJobs = this._workflow.get('workflow_jobs');
        if (workflowJobs !== undefined)
        {
            for (var i = 0; i < workflowJobs.length; i++)
            {
                // Create WorkflowJob item then process connections.
                var workflowJob = workflowJobs.at(i);
                var coordinateSets = coordinateSetCollection.where({'workflow_job': workflowJob.get('url')});
                var coordinates = {};
                if (coordinateSets.length > 0)
                {
                    workflowJob.coordinates = coordinateSets[0];
                    this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB,
                                              {workflowjob: workflowJob,
                                               x: workflowJob.coordinates.get('data').x,
                                               y: workflowJob.coordinates.get('data').y});
                }
                else
                {
                    this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB,
                                              {workflowjob: workflowJob});
                }
                var tempConnections = this._processWorkflowJob(workflowJob);

                // For the connections returned, merge them into our master list.
                // TODO - maybe put this in its own method
                for (var connectionUrl in tempConnections)
                {
                    var connection = tempConnections[connectionUrl];
                    if (connections.hasOwnProperty(connectionUrl))
                    {
                        connections[connectionUrl].inputPort = 
                            connections[connectionUrl].inputPort === null ? connection.inputPort : connections[connectionUrl].inputPort;
                        connections[connectionUrl].outputPort = 
                            connections[connectionUrl].outputPort === null ? connection.outputPort : connections[connectionUrl].outputPort;
                    }
                    else
                    {
                        connections[connectionUrl] = connection;
                    }
                }
            }
        }

        // Process connections.
        for (var connectionUrl in connections)
        {
            var connection = connections[connectionUrl];
            var connectionModel = new Connection({input_port: connection.inputPort.get('url'), 
                                                  output_port: connection.outputPort.get('url')});
            this._workflow.get('connections').add(connection);
            this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION, {connection: connectionModel, 
                                                                                                inputport: connection.inputPort,
                                                                                                outputport: connection.outputPort});
        }
    }

    /**
     * Process workflow job for GUI.
     */
    _processWorkflowJob(aModel)
    {
        // We want to keep track of what connections need to be made and return those.
        var connections = {};

        // Process input ports.
        var inputPorts = aModel.get('input_ports');
        if (inputPorts !== undefined)
        {
            for (var i = 0; i < inputPorts.length; i++)
            {
                var inputPort = inputPorts.at(i);
                this._processInputPort(inputPort, aModel);

                // Get connections.
                var inputPortConnections = inputPort.get('connections');
                for (var k = 0; k < inputPortConnections.length; k++)
                {
                    var connection = inputPortConnections[k];
                    connections[connection] = {'inputPort': inputPort, 'outputPort': null};
                }
            }
        }

        // Process output ports.
        var outputPorts = aModel.get('output_ports');
        if (outputPorts !== undefined)
        {
            for (var j = 0; j < outputPorts.length; j++)
            {
                var outputPort = outputPorts.at(j);
                this._processOutputPort(outputPort, aModel);

                // Get connections.
                var outputPortConnections = outputPort.get('connections');
                for (var k = 0; k < outputPortConnections.length; k++)
                {
                    var connection = outputPortConnections[k];
                    connections[connection] = {'inputPort': null, 'outputPort': outputPort};
                }
            }
        }

        return connections;
    }

    /**
     * Process input port for GUI.
     */
    _processInputPort(aModel, aWorkflowJob)
    {
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT, {workflowjob: aWorkflowJob, inputport: aModel});
    }

    /**
     * Process output port for GUI.
     */
    _processOutputPort(aModel, aWorkflowJob)
    {
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT, {workflowjob: aWorkflowJob, outputport: aModel});
    }
}

export default LayoutViewWorkflowEditor;
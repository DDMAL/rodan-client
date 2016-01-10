import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Configuration from '../../../../Configuration';
import Connection from '../../../../Models/Connection';
import Events from '../../../../Shared/Events';
import ViewWorkflow from '../Workflow/Individual/ViewWorkflow';
import LayoutViewJob from '../Job/LayoutViewJob';
import LayoutViewControlWorkflowJob from '../WorkflowJob/LayoutViewControlWorkflowJob';
import WorkflowJob from '../../../../Models/WorkflowJob';
import WorkflowJobCoordinateSet from '../../../../Models/WorkflowJobCoordinateSet';
import InputPort from '../../../../Models/InputPort';
import OutputPort from '../../../../Models/OutputPort';

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
            regionControlWorkflowUpperArea: '#region-main_workflowbuilder_control_workflow_upperarea',
            regionControlWorkflowLowerArea: '#region-main_workflowbuilder_control_workflow_lowerarea'
        });
        this._workflow = aParameters.workflow;
        this._workflowJob = null;
        this._initializeRadio();
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
        this._rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_DESTROY);
        this._rodanChannel.off(null, null, this);
        this._rodanChannel.stopReplying(null, null, this);
    }

    onBeforeShow()
    {
        this.regionControlWorkflowUpperArea.show(this.viewWorkflow);
        this.regionControlWorkflowLowerArea.show(this.viewControlJob);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel('rodan');
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWJOB_ADD, options => this._handleCommandAddWorkflowJob(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWJOB_DELETE, options => this._handleCommandDeleteWorkflowJob(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_CONNECTION, aPass => this._handleCommandAddConnection(aPass), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT, options => this._handleCommandAddInputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT, options => this._handleCommandAddOutputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_INPUTPORT, aPass => this._handleCommandDeleteInputPort(aPass), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_OUTPUTPORT, aPass => this._handleCommandDeleteOutputPort(aPass), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_SAVE_WORKFLOW, aPass => this._handleCommandSaveWorkflow(aPass), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWJOB_SAVE, aPass => this._handleCommandSaveWorkflowJob(aPass), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWJOB_SAVE_COORDINATES, options => this._handleCommandSaveWorkflowJobCoordinates(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW, () => this._handleCommandValidateWorkflow(), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, () => this._handleCommandShowControlJobView(), this);
        this._rodanChannel.on(Events.EVENT__WORKFLOWJOB_SELECTED, aReturn => this._handleEventEditWorkflowJob(aReturn), this);
    }

    /**
     * Initialize views.
     */
    _initializeViews(options)
    {
        this.viewWorkflow = new ViewWorkflow({template: '#template-main_workflow_individual_edit', model: options.workflow});
        this.viewControlJob = new LayoutViewJob();
    }
    
    /**
     * Handle button zoom in.
     */
    _handleButtonZoomIn()
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_IN);
    }
    
    /**
     * Handle button zoom out.
     */
    _handleButtonZoomOut()
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_OUT);
    }
    
    /**
     * Handle button zoom reset.
     */
    _handleButtonZoomReset()
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ZOOM_RESET);
    }

    /**
     * Handles success of workflow fetch.
     */
    _handleWorkflowLoadSuccess()
    {
        // Attempt to get coordinate sets to pass. Regardless of success or not, we process the workflow.
        var query = {workflow: this._workflow.id, user_agent: Configuration.USER_AGENT};
        var callback = () => this._processWorkflow();
        this._rodanChannel.request(Events.REQUEST__WORKFLOWJOBCOORDINATESETS_LOAD, {query: query, success: callback, error: callback});
    }

    /**
     * Handle command add workflow job.
     */
    _handleCommandAddWorkflowJob(options)
    {
        var workflowJob = this._createWorkflowJob(options.job, this._workflow);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB, {workflowjob: workflowJob});
        this._rodanChannel.trigger(Events.EVENT__WORKFLOWJOB_SELECTED, {workflowjob: workflowJob});
    }

    /**
     * Handle command delete workflow job.
     */
    _handleCommandDeleteWorkflowJob(options)
    {
        this._deleteWorkflowJob(options.workflowjob);
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
        this.regionControlWorkflowUpperArea.show(this.controlWorkflowJobView);
        this.regionControlWorkflowLowerArea.$el.hide();
    }
    
    /**
     * Handle command show job control view.
     */
    _handleCommandShowControlJobView()
    {
        this.viewWorkflow = new ViewWorkflow({template: '#template-main_workflow_individual_edit', model: this._workflow});
        this.viewControlJob = new LayoutViewJob();
        this.regionControlWorkflowUpperArea.show(this.viewWorkflow);
        this.regionControlWorkflowLowerArea.show(this.viewControlJob);
        this.regionControlWorkflowLowerArea.$el.show();
    }

    /**
     * Create input port
     */
    _handleCommandAddInputPort(options)
    {
        var workflowJob = options.workflowjob != null ? options.workflowjob : this._workflowJob;
        var port = this._createInputPort(options.inputporttype, workflowJob);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT, {workflowjob: workflowJob, inputport: port});
    }

    /**
     * Create output port
     */
    _handleCommandAddOutputPort(options)
    {
        var workflowJob = options.workflowjob != null ? options.workflowjob : this._workflowJob;
        var port = this._createOutputPort(options.outputporttype, workflowJob);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT, {workflowjob: workflowJob, outputport: port});
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
        this._workflow.save({valid: true}, {patch: true, success: () => this._handleValidationSuccess()});
    }

    /**
     * Handle validation success.
     */
    _handleValidationSuccess()
    {
        alert('The workflow is valid.');
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
     * Given a WorkflowJob, adds ports that must be present.
     * This method assumes that the WorkflowJob has NO ports to begin with.
     */
    _addRequiredPorts(workflowJob)
    {
        var jobCollection = this._rodanChannel.request(Events.REQUEST__COLLECTION_JOB);
        var job = jobCollection.get(workflowJob.getJobUuid());
        var outputPortTypes = job.get('output_port_types');
        var inputPortTypes = job.get('input_port_types');

        // Go through port collections.
        var that = this;
        inputPortTypes.forEach(function(inputPortType) 
        {
            for (var i = 0; i < inputPortType.get('minimum');i ++)
            {
                that._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT, {inputporttype: inputPortType, workflowjob: workflowJob});
            }
        });
        outputPortTypes.forEach(function(outputPortType) 
        {
            for (var i = 0; i < outputPortType.get('minimum'); i++)
            {
                that._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT, {outputporttype: outputPortType, workflowjob: workflowJob});
            }
        });
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
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_INPUTPORT, {workflowjob: aWorkflowJob, inputport: aPort});
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
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_OUTPUTPORT, {workflowjob: aWorkflowJob, outputport: aPort});
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
     * Delete WorkflowJob.
     */
    _deleteWorkflowJob(workflowJob)
    {
        // Delete input ports.
        while (workflowJob.get('input_ports').length > 0)
        {
            var inputPort = workflowJob.get('input_ports').at(0);
            this._deleteInputPort(inputPort, workflowJob)
        }

        // Delete output ports.
        while (workflowJob.get('output_ports').length > 0)
        {
            var outputPort = workflowJob.get('output_ports').at(0);
            this._deleteOutputPort(outputPort, workflowJob)
        }
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOB, {workflowjob: workflowJob});
        workflowJob.destroy();
    }

    /**
     * Create workflow job.
     *
     * If ports are to be automatically generated, we add a success function that adds them.
     */
    _createWorkflowJob(aJob, aWorkflow)
    {
        var workflowJob = new WorkflowJob({job: aJob.get('url'), workflow: aWorkflow.get('url')});
        if (this.ui.checkboxAddPorts.is(':checked'))
        {
            workflowJob.save({}, {success: (model, response, options) => this._addRequiredPorts(model)});
        }
        else
        {
            workflowJob.save();
        }
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
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION, {connection: connection, inputport: aInputPort, outputport: aOutputPort});
    }

    /**
     * Process workflow for GUI.
     */
    _processWorkflow()
    {
        // Get the coordinates loaded for this workflow.
        var coordinateSetCollection = this._rodanChannel.request(Events.REQUEST__WORKFLOWJOBCOORDINATESET_COLLECTION);

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
                    this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB,
                                              {workflowjob: workflowJob,
                                               x: workflowJob.coordinates.get('data').x,
                                               y: workflowJob.coordinates.get('data').y});
                }
                else
                {
                    this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB,
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
            this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION, {connection: connectionModel, 
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
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT, {workflowjob: aWorkflowJob, inputport: aModel});
    }

    /**
     * Process output port for GUI.
     */
    _processOutputPort(aModel, aWorkflowJob)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT, {workflowjob: aWorkflowJob, outputport: aModel});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewWorkflowEditor.prototype.template = '#template-main_workflowbuilder';
LayoutViewWorkflowEditor.prototype.ui = {
    buttonZoomIn: '#button-zoom_in',
    buttonZoomOut: '#button-zoom_out',
    buttonZoomReset: '#button-zoom_reset',
    checkboxAddPorts: '#checkbox-add_ports'
};
LayoutViewWorkflowEditor.prototype.events = {
    'click @ui.buttonZoomIn': '_handleButtonZoomIn',
    'click @ui.buttonZoomOut': '_handleButtonZoomOut',
    'click @ui.buttonZoomReset': '_handleButtonZoomReset'
};

export default LayoutViewWorkflowEditor;
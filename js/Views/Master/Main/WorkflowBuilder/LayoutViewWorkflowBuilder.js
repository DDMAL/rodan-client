import _ from 'underscore';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Configuration from '../../../../Configuration';
import Connection from '../../../../Models/Connection';
import Events from '../../../../Shared/Events';
import ViewWorkflow from '../Workflow/Individual/ViewWorkflow';
import LayoutViewJobSelection from './JobSelection/LayoutViewJobSelection';
import LayoutViewControlWorkflowJob from '../WorkflowJob/LayoutViewControlWorkflowJob';
import LayoutViewControlWorkflowJobGroup from '../WorkflowJobGroup/LayoutViewControlWorkflowJobGroup';
import WorkflowJob from '../../../../Models/WorkflowJob';
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

        // Clear timed events.
        this._rodanChannel.request(Events.REQUEST__CLEAR_TIMED_EVENT);

        // Load the full workflow.
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW, {'workflow': this._workflow});
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
        this.regionControlWorkflowLowerArea.show(this._viewJobSelection);
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

        this._rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED, options => this._handleEventEditWorkflowJob(options), this);
        this._rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOBGROUP_SELECTED, options => this._handleEventWorkflowJobGroupSelected(options), this);

        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_IMPORT_WORKFLOW, options => this._handleRequestImportWorkflow(options), this);

        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOB, options => this._handleRequestAddWorkflowJob(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_REMOVE_WORKFLOWJOB, options => this._handleRequestRemoveWorkflowJob(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_SAVE_WORKFLOWJOB, options => this._handleRequestSaveWorkflowJob(options), this);
        
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_CONNECTION, aPass => this._handleCommandAddConnection(aPass), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT, options => this._handleCommandAddInputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT, options => this._handleCommandAddOutputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_INPUTPORT, aPass => this._handleCommandDeleteInputPort(aPass), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_OUTPUTPORT, aPass => this._handleCommandDeleteOutputPort(aPass), this);

        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW, options => this._handleRequestValidateWorkflow(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW, options => this._handleEventLoadWorkflow(options), this);

        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOBGROUP, options => this._handleRequestGetWorkflowJobGroup(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOB, options => this._handleRequestGetWorkflowJob(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_INPUTPORT, options => this._handleRequestGetInputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_OUTPUTPORT, options => this._handleRequestGetOutputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_CONNECTION, options => this._handleRequestGetConnection(options), this);

        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, () => this._handleCommandShowControlJobView(), this);

        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_CREATEDISTRIBUTOR, options => this._handleRequestCreateDistributor(options), this);        
    }

    /**
     * Initialize views.
     */
    _initializeViews(options)
    {
        this.viewWorkflow = new ViewWorkflow({template: '#template-main_workflow_individual_edit', model: options.workflow});
        this._viewJobSelection = new LayoutViewJobSelection();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    
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
    _handleWorkflowLoadSuccess(workflow)
    {
        this._processWorkflow(workflow);
    }

    /**
     * Handle request add workflow job.
     */
    _handleRequestAddWorkflowJob(options)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWJOB_CREATE, {job: options.job, 
                                                                        workflow: this._workflow, 
                                                                        addports: this.ui.checkboxAddPorts.is(':checked')});
    }

    /**
     * Handle command remove WorkflowJob.
     */
    _handleRequestRemoveWorkflowJob(options)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWJOB_DELETE, {workflowjob: options.workflowjob, workflow: this._workflow});
    }

    /**
     * Handle command save WorkflowJob.
     */
    _handleRequestSaveWorkflowJob(options)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWJOB_SAVE, {workflowjob: options.workflowjob, workflow: this._workflow});
    }

    /**
     * Handle request import Workflow.
     */
    _handleRequestImportWorkflow(options)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOW_IMPORT, {origin: options.workflow, target: this._workflow});
    }

    /**
     * Handle add connection.
     */
    _handleCommandAddConnection(options)
    {
        var inputPort = this._handleRequestGetInputPort({'id': options.inputportid});
        var outputPort = this._handleRequestGetOutputPort({'id': options.outputportid});
        this._createConnection(outputPort, inputPort);
    }

    /**
     * Handle event edit workflow job.
     */
    _handleEventEditWorkflowJob(options)
    {
        this._workflowJob = this._handleRequestGetWorkflowJob(options);
        this.controlWorkflowJobView = new LayoutViewControlWorkflowJob({'workflowjob': this._workflowJob, 'workflow': this._workflow});
        this.regionControlWorkflowUpperArea.show(this.controlWorkflowJobView);
        this.regionControlWorkflowLowerArea.$el.hide();
    }

    /**
     * Handle event WorkflowJobGroup selected.
     */
    _handleEventWorkflowJobGroupSelected(options)
    {
        var workflowJobGroup = this._handleRequestGetWorkflowJobGroup(options);
        this.controlWorkflowJobGroupView = new LayoutViewControlWorkflowJobGroup({workflow: this._workflow, workflowjobgroup: workflowJobGroup});
        this.regionControlWorkflowUpperArea.show(this.controlWorkflowJobGroupView);
        this.regionControlWorkflowLowerArea.$el.hide();
    }
    
    /**
     * Handle command show job control view.
     */
    _handleCommandShowControlJobView()
    {
        this.viewWorkflow = new ViewWorkflow({template: '#template-main_workflow_individual_edit', model: this._workflow});
        this._viewJobSelection = new LayoutViewJobSelection();
        this.regionControlWorkflowUpperArea.show(this.viewWorkflow);
        this.regionControlWorkflowLowerArea.show(this._viewJobSelection);
        this.regionControlWorkflowLowerArea.$el.show();
    }

    /**
     * Create input port
     */
    _handleCommandAddInputPort(options)
    {
        var workflowJob = options.workflowjob != null ? options.workflowjob : this._workflowJob;
        this._createInputPort(options.inputporttype, options.workflowjob);
    }

    /**
     * Create output port
     */
    _handleCommandAddOutputPort(options)
    {
        var workflowJob = options.workflowjob != null ? options.workflowjob : this._workflowJob;
        this._createOutputPort(options.outputporttype, workflowJob, options.targetinputports);
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
        this._workflow.save(aPass, {patch: true, success: () => this._validateWorkflow(this._workflow)});
    }

    /**
     * Handle request load Workflow.
     */
    _handleEventLoadWorkflow(options)
    {
        options.workflow.fetch({'success': (workflow) => this._handleWorkflowLoadSuccess(workflow)});
    }

    /**
     * Handle request get WorkflowJob.
     */
    _handleRequestGetWorkflowJob(options)
    {
        return this._workflow.get('workflow_jobs').get(options.id);
    }

    /**
     * Handle request get WorkflowJobGroup.
     */
    _handleRequestGetWorkflowJobGroup(options)
    {
        return this._rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP, {'id': options.id});
    }

    /**
     * Handle request get InputPort.
     */
    _handleRequestGetInputPort(options)
    {
        var workflowJobs = this._workflow.get('workflow_jobs');
        for (var i = 0; i < workflowJobs.length; i++)
        {
            var workflowJob = workflowJobs.at(i);
            var port = workflowJob.get('input_ports').get(options.id);
            if (port)
            {
                return port;
            }
        }
        return null;
    }

    /**
     * Handle request get OutputPort.
     */
    _handleRequestGetOutputPort(options)
    {
        var workflowJobs = this._workflow.get('workflow_jobs');
        for (var i = 0; i < workflowJobs.length; i++)
        {
            var workflowJob = workflowJobs.at(i);
            var port = workflowJob.get('output_ports').get(options.id);
            if (port)
            {
                return port;
            }
        }
        return null;
    }

    /**
     * Handle request get Connection.
     */
    _handleRequestGetConnection(options)
    {
        return this._workflow.get('connections').get(options.id);
    }

    /**
     * Handle request validate Workflow.
     */
    _handleRequestValidateWorkflow(options)
    {
        this._validateWorkflow(options.workflow);
    }

    /**
     * Handle request create distributor.
     */
    _handleRequestCreateDistributor(options)
    {
        var requiredResourceTypes = this._getCompatibleResourceTypeURLs(options.urls);
        if (requiredResourceTypes.length > 0)
        {
            var jobs = this._getCandidateResourceDistributorJobs(requiredResourceTypes);
            if (jobs.length > 0)
            {
                // TODO - offer list
                var targetInputPorts = [];
                for (var i = 0; i < options.urls.length; i++)
                {
                    targetInputPorts.push(this._workflow.get('workflow_input_ports').findWhere(options.urls[i]));
                }
                this._createConnectedWorkflowJob(jobs[0], targetInputPorts);
            }
        }
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - response handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle InputPort creation success.
     */
    _handleInputPortCreationSuccess(model, workflow, workflowJob)
    {
        workflow.get('workflow_input_ports').add(model);
        workflowJob.get('output_ports').add(model);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_INPUTPORT, {workflowjob: workflowJob, inputport: model});
        this._validateWorkflow(workflow);
    }

    /**
     * Handle OutputPort creation success.
     */
    _handleOutputPortCreationSuccess(model, workflow, workflowJob, targetInputPorts)
    {
        workflow.get('workflow_output_ports').add(model);
        workflowJob.get('output_ports').add(model);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_OUTPUTPORT, {workflowjob: workflowJob, outputport: model});
        this._validateWorkflow(workflow);

        // Create Connections (if any).
        for (var index in targetInputPorts)
        {
            this._createConnection(model, targetInputPorts[index]);
        }
    }

    /**
     * Handles success of Connection creation.
     */
    _handleConnectionCreationSuccess(model, workflow, inputPort, outputPort)
    {
        workflow.get('connections').add(model);
        inputPort.fetch(); // to get populated Connection array
        outputPort.fetch(); // to get populated Connection array
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION, {connection: model, inputport: inputPort, outputport: outputPort});
        this._validateWorkflow(workflow);
    }

    /**
     * Handle InputPort deletion success.
     */
    _handleInputPortDeletionSuccess(model, workflow, workflowJob)
    {
        workflowJob.get('input_ports').remove(model);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_INPUTPORT, {workflowjob: workflowJob, inputport: model});
        this._validateWorkflow(workflow);
    }

    /**
     * Handle OutputPort deletion success.
     */
    _handleOutputPortDeletionSuccess(model, workflow, workflowJob)
    {
        workflowJob.get('output_ports').remove(model);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_OUTPUTPORT, {workflowjob: workflowJob, outputport: model});
        this._validateWorkflow(workflow);
    }

    /**
     * Handle validation failure.
     */
    _handleValidationFailure(model)
    {
        model.set({'valid': false})
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Create input port.
     */
    _createInputPort(inputPortType, workflowJob)
    {
        var port = new InputPort({input_port_type: inputPortType.get('url'), workflow_job: workflowJob.get('url')});
        port.save({}, {success: (model) => this._handleInputPortCreationSuccess(model, this._workflow, workflowJob)});
    }

    /**
     * Create input port.
     */
    _createOutputPort(outputPortType, workflowJob, targetInputPorts)
    {
        var port = new OutputPort({output_port_type: outputPortType.get('url'), workflow_job: workflowJob.get('url')});
        port.save({}, {success: (model) => this._handleOutputPortCreationSuccess(model, this._workflow, workflowJob, targetInputPorts)});
    }

    /**
     * Create connection.
     */
    _createConnection(outputPort, inputPort)
    {
        var connection = new Connection({input_port: inputPort.get('url'), output_port: outputPort.get('url')});
        connection.save({}, {success: (model) => this._handleConnectionCreationSuccess(model, this._workflow, inputPort, outputPort)});
    }

    /**
     * Delete input port.
     */
    _deleteInputPort(port, workflowJob)
    {
        try
        {
            port.destroy({success: (model) => this._handleInputPortDeletionSuccess(model, this._workflow, workflowJob)});
        }
        catch (aError)
        {
            console.log('TODO - not sure why this error is happening; see https://github.com/ELVIS-Project/vis-client/issues/5');
        }
    }

    /**
     * Delete output port.
     */
    _deleteOutputPort(port, workflowJob)
    {
        try
        {
            port.destroy({success: (model) => this._handleOutputPortDeletionSuccess(model, this._workflow, workflowJob)});
        }
        catch (aError)
        {
            console.log('TODO - not sure why this error is happening; see https://github.com/ELVIS-Project/vis-client/issues/5');
        }
    }

    /**
     * Process workflow for GUI.
     */
    _processWorkflow(workflow)
    {
        // Process all WorkflowJobs and their associated ports.
        var connections = {};
        var workflowJobs = workflow.get('workflow_jobs');
        if (workflowJobs !== undefined)
        {
            for (var i = 0; i < workflowJobs.length; i++)
            {
                // Create WorkflowJob item then process connections.
                var workflowJob = workflowJobs.at(i);
                this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB, {workflowjob: workflowJob});
                var tempConnections = this._processWorkflowJob(workflowJob);

                // For the connections returned, merge them into our master list.
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
            workflow.get('connections').add(connection);
            this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_CONNECTION, {connection: connectionModel, 
                                                                                                inputport: connection.inputPort,
                                                                                                outputport: connection.outputPort});
        }

        // Finally inport the WorkflowJobGroups. 
        this._rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_IMPORT, {workflow: this._workflow});
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

    /**
     * Attempts to validate Workflow.
     */
    _validateWorkflow(workflow)
    {
        workflow.save({valid: true}, {patch: true,
                                      error: (model) => this._handleValidationFailure(model),
                                      use_generic: false});
    }

    /**
     * Given an array of InputPort URLs, returns an array of ResourceType URLs that
     * would satisfy the InputPorts.
     */
    _getCompatibleResourceTypeURLs(urls)
    {
        var resourceTypes = [];
        var inputPortTypes = this._rodanChannel.request(Events.REQUEST__GLOBAL_INPUTPORTTYPE_COLLECTION);
        for (var index in urls)
        {
            // Get the available resource types.
            var inputPort = this._workflow.get('workflow_input_ports').findWhere(urls[index]);
            var inputPortTypeURL = inputPort.get('input_port_type');
            var inputPortType = inputPortTypes.findWhere({url: inputPortTypeURL});
            var inputPortResourceTypes = inputPortType.get('resource_types');

            // If this is the first iteration, set the array. Else, do an intersection.
            if (resourceTypes.length === 0)
            {
                resourceTypes = inputPortResourceTypes;
            }
            resourceTypes = _.intersection(resourceTypes, inputPortResourceTypes);
        }
        return resourceTypes;
    }

    /**
     * Given an array of ResourceType URLs, finds jobs that both give at least one and take at least
     * one of the ResourceTypes. The returned array {job: Job, inputporttypes: URL strings, outputporttypes: URL string}.
     * The port types are those ports of the associated Job that will satisfy the resource requirements.
     */
    _getCandidateResourceDistributorJobs(resourceTypes)
    {
        var jobs = this._rodanChannel.request(Events.REQUEST__GLOBAL_JOB_COLLECTION).where({category: Configuration.RESOURCE_DISTRIBUTOR_CATEGORY});
        var satisfiableJobs = [];
        for (var i = 0; i < jobs.length; i++)
        {
            var job = jobs[i];
            var inputPortType = job.get('input_port_types').at(0);
            var outputPortType = job.get('output_port_types').at(0);

            // Intersect against InputPortType ResourceTypes.
            var intersect = _.intersection(resourceTypes, inputPortType.get('resource_types'));
            if (intersect.length === 0)
            {
                continue;
            }

            intersect = _.intersection(resourceTypes, outputPortType.get('resource_types'));
            if (intersect.length === 0)
            {
                continue;
            }
            
            // We want to keep this job.
            satisfiableJobs.push(job);
        }
        return satisfiableJobs;
    }

    /**
     * Given a Job URL with associated port type URLs, creates a WorkflowJob.
     */
    _createConnectedWorkflowJob(job, targetInputPorts)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWJOB_CREATE, {job: job, 
                                                                        workflow: this._workflow, 
                                                                        addports: true,
                                                                        targetinputports: targetInputPorts});
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
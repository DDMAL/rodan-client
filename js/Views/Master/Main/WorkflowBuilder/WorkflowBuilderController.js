import _ from 'underscore';
import BaseCollection from '../../../../Collections/BaseCollection';
import BaseController from '../../../../Controllers/BaseController';
import Configuration from '../../../../Configuration';
import Connection from '../../../../Models/Connection';
import Events from '../../../../Shared/Events';
import InputPort from '../../../../Models/InputPort';
import LayoutViewResourceAssignment from './ResourceAssignment/LayoutViewResourceAssignment';
import LayoutViewWorkflowBuilder from './LayoutViewWorkflowBuilder';
import OutputPort from '../../../../Models/OutputPort';
import Resource from '../../../../Models/Resource';
import ViewResourceList from '../Resource/List/ViewResourceList';
import ViewResourceListItemModal from '../Resource/List/ViewResourceListItemModal';
import Workflow from '../../../../Models/Workflow';
import WorkflowBuilder from '../../../../Plugins/WorkflowBuilder/WorkflowBuilder';
import WorkflowJob from '../../../../Models/WorkflowJob';

/**
 * Controller for the Workflow Builder.
 */
class WorkflowBuilderController extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize()
    {
        this._workspace = new WorkflowBuilder();
        this._resourceAssignments = [];
        this._resourcesAvailable = [];
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_SELECTED, options => this._handleEventBuilderSelected(options), this);

        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_CONNECTION, options => this._handleCommandAddConnection(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT, options => this._handleCommandAddInputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT, options => this._handleCommandAddOutputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOB, options => this._handleRequestAddWorkflowJob(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOBGROUP, options => this._handleRequestAddWorkflowJobGroup(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ASSIGN_RESOURCE, options => this._handleRequestAssignResource(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_CREATE_WORKFLOWRUN, options => this._handleRequestCreateWorkflowRun(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_CREATE_DISTRIBUTOR, options => this._handleRequestCreateDistributor(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_CONNECTION, options => this._handleRequestDeleteConnection(options), this); 
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_INPUTPORT, options => this._handleCommandDeleteInputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_OUTPUTPORT, options => this._handleCommandDeleteOutputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_WORKFLOWJOB, options => this._handleRequestDeleteWorkflowJob(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_WORKFLOWJOBGROUP, options => this._handleRequestWorkflowJobGroupDelete(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_COMPATIBLE_RESOURCETYPES, options => this._handleRequestgetCompatibleResourceTypes(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_CONNECTION, options => this._handleRequestGetConnection(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_INPUTPORT, options => this._handleRequestGetInputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_OUTPUTPORT, options => this._handleRequestGetOutputPort(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOW, () => this._handleRequestGetWorkflow(), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOB, options => this._handleRequestGetWorkflowJob(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOBGROUP, options => this._handleRequestGetWorkflowJobGroup(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_RESOURCEASSIGNMENT_VIEW, options => this._handleRequestGetResourceAssignmentView(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_RESOURCEASSIGNMENTS, options => this._handleRequestGetResourceAssignments(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_IMPORT_WORKFLOW, options => this._handleRequestImportWorkflow(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW, options => this._handleEventLoadWorkflow(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_SAVE_WORKFLOWJOB, options => this._handleRequestSaveWorkflowJob(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_UNASSIGN_RESOURCE, options => this._handleRequestUnassignResource(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW, options => this._handleRequestValidateWorkflow(options), this);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle selection.
     */
    _handleEventBuilderSelected(options)
    {
        this._workflow = options.workflow;
        this._resourceAssignments = [];
        this._resourcesAvailable = [];
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW, {'workflow': options.workflow});
        this._layoutView = new LayoutViewWorkflowBuilder({workflow: options.workflow});
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this._layoutView);
        this._workspace.initialize('canvas-workspace');
    }

    /**
     * Handle request create WorkflowRun.
     */
    _handleRequestCreateWorkflowRun(options)
    {
        var workflow = options.model;

        // Get the known unsatisfied InputPorts for this Workflow.
        var unsatisfiedInputPorts = workflow.get('workflow_input_ports').clone();

        // Go through the assignments, checking against the InputPort collection.
        var assignments = {};
        for (var inputPortURL in this._resourceAssignments)
        {
            // If our assignments for an InputPort are not needed, we just skip it.
            var inputPort = unsatisfiedInputPorts.findWhere({url: inputPortURL});
            if (!inputPort)
            {
                continue;
            }

            // If there is nothing for a given InputPort, error.
            assignments[inputPortURL] = [];
            var collection = this._getResourceAssignments(inputPortURL);
            if (collection.length === 0)
            {
                alert('There are still unsatisfied InputPorts.');
                return;
            }

            // Copy the assignments. 
            for (var i = 0; i < collection.length; i++)
            {
                var resource = collection.at(i);
                assignments[inputPortURL].push(resource.get('url'));
            }

            // Finally, remove the InputPort from the cloned Collection.
            unsatisfiedInputPorts.remove(inputPort);
        }

        // If we have anything left oveer in our cloned Collection, something is wrong.
        if (unsatisfiedInputPorts.length > 0)
        {
            alert('There are still unsatisfied InputPorts.');
        }
        else
        {
            this._rodanChannel.request(Events.REQUEST__WORKFLOWRUN_CREATE, {workflow: options.model, assignments: assignments});
        }
    }

    /**
     * Handle request get Resource assignment view.
     */
    _handleRequestGetResourceAssignmentView(options)
    {
        // Create views.
        var inputPort = this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GET_INPUTPORT, {url: options.url});
        var assignedResources = this._getResourceAssignments(options.url);
        var availableResources = this._getResourcesAvailable(options.url);
        var assignedResourceView = new ViewResourceList({collection: assignedResources,
                                                         template: '#template-modal_resource_list',
                                                         childView: ViewResourceListItemModal,
                                                         childViewOptions: {inputport: inputPort, assigned: true}});
        var resourceListView = new ViewResourceList({collection: availableResources,
                                                     template: '#template-modal_resource_list',
                                                     childView: ViewResourceListItemModal,
                                                     childViewOptions: {inputport: inputPort, assigned: false}});

        // Return the layout view.
        return new LayoutViewResourceAssignment({viewavailableresources: resourceListView, viewassignedresources: assignedResourceView});
    }

    /**
     * Handle request get Workflow.
     */
    _handleRequestGetWorkflow()
    {
        return this._workflow;
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
        var addPorts = this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GET_ADDPORTS);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWJOB_CREATE, {job: options.job, 
                                                                        workflow: this._workflow, 
                                                                        addports: addPorts});
    }

    /**
     * Handle command delete WorkflowJob.
     */
    _handleRequestDeleteWorkflowJob(options)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWJOB_DELETE, {workflowjob: options.model, workflow: this._workflow});
    }

    /**
     * Handle request delete Connection.
     */
    _handleRequestDeleteConnection(options)
    {
        this._deleteConnection(options.model);
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
        var inputPort = this._handleRequestGetInputPort({url: options.inputporturl});
        var outputPort = this._handleRequestGetOutputPort({url: options.outputporturl});
        this._createConnection(outputPort, inputPort);
    }

    /**
     * Create input port
     */
    _handleCommandAddInputPort(options)
    {
        this._createInputPort(options.inputporttype, options.workflowjob);
    }

    /**
     * Create output port
     */
    _handleCommandAddOutputPort(options)
    {
        this._createOutputPort(options.outputporttype, options.workflowjob, options.targetinputports);
    }

    /**
     * Delete input port
     */
    _handleCommandDeleteInputPort(options)
    {
        var workflowJob = this._getWorkflowJobWithInputPort(options.model);
        this._deleteInputPort(options.model, workflowJob);
    }

    /**
     * Delete output port
     */
    _handleCommandDeleteOutputPort(options)
    {
        var workflowJob = this._getWorkflowJobWithOutputPort(options.model);
        this._deleteOutputPort(options.model, workflowJob);
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
        return this._workflow.get('workflow_jobs').findWhere({url: options.url});
    }

    /**
     * Handle request get WorkflowJobGroup.
     */
    _handleRequestGetWorkflowJobGroup(options)
    {
        return this._rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP, {url: options.url});
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
            var port = workflowJob.get('input_ports').findWhere({url: options.url});
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
            var port = workflowJob.get('output_ports').findWhere({url: options.url});
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
        return this._workflow.get('connections').findWhere({url: options.url});
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

    /**
     * Handle request WorkflowJobGroup delete.
     */
    _handleRequestWorkflowJobGroupDelete(options)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_DELETE, {workflowjobgroup: options.model, workflow: this._workflow});
    }

    /**
     * Handle request add WorkflowJobGroup.
     */
    _handleRequestAddWorkflowJobGroup(options)
    {
        var workflowJobIDs = this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_GET_SELECTED_WORKFLOWJOB_IDS);
        var workflowJobs = [];
        for (var i in workflowJobIDs)
        {
            var workflowJobID = workflowJobIDs[i];
            var workflowJob = this._workflow.get('workflow_jobs').get(workflowJobID);
            workflowJobs.push(workflowJob);
        }
        this._rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_CREATE, {workflowjobs: workflowJobs, workflow: this._workflow});
    }

    /**
     * Handle request get compatible ResourceType URL list.
     */
    _handleRequestgetCompatibleResourceTypes(options)
    {
        return this._getCompatibleResourceTypeURLs(options.urls);
    }

    /**
     * Handle request assign Resource to InputPort.
     */
    _handleRequestAssignResource(options)
    {
        var resourcesAssigned = this._getResourceAssignments(options.inputport.get('url'));
        resourcesAssigned.add(options.resource);
    }

    /**
     * Handle request unassigne Resource from InputPort.
     */
    _handleRequestUnassignResource(options)
    {
        var resourcesAssigned = this._getResourceAssignments(options.inputport.get('url'));
        resourcesAssigned.remove(options.resource); // use ID just in case model 'c'ids don't match 
    }

    /**
     * Handle request get Resource assignments.
     */
    _handleRequestGetResourceAssignments(options)
    {
        return this._getResourceAssignments(options.url);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - REST response handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle InputPort creation success.
     */
    _handleInputPortCreationSuccess(model, workflow, workflowJob)
    {
        workflow.get('workflow_input_ports').add(model);
        workflowJob.get('input_ports').add(model);
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
     * Handle Connection deletion success.
     */
    _handleConnectionDeletionSuccess(model, workflow)
    {
        workflow.get('connections').remove(model);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_CONNECTION, {connection: model});
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
     * Returns WorkflowJob associated with InputPort.
     */
    _getWorkflowJobWithInputPort(inputPort)
    {
        var workflowJobs = this._workflow.get('workflow_jobs');
        for (var i = 0; i < workflowJobs.length; i++)
        {
            var workflowJob = workflowJobs.at(i);
            var port = workflowJob.get('input_ports').get(inputPort.id);
            if (port)
            {
                return workflowJob
            }
        }
        return null;
    }

    /**
     * Returns WorkflowJob associated with OutputPort.
     */
    _getWorkflowJobWithOutputPort(outputPort)
    {
        var workflowJobs = this._workflow.get('workflow_jobs');
        for (var i = 0; i < workflowJobs.length; i++)
        {
            var workflowJob = workflowJobs.at(i);
            var port = workflowJob.get('output_ports').get(outputPort.id);
            if (port)
            {
                return workflowJob
            }
        }
        return null;
    }

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
     * Delete connection.
     */
    _deleteConnection(connection)
    {
        connection.destroy({success: (model) => this._handleConnectionDeletionSuccess(model, this._workflow)});
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
                                                  output_port: connection.outputPort.get('url'),
                                                  url: connectionUrl});

            // TODO - better way to get connections?
            var connectionId = connectionModel.parseIdFromUrl(connectionUrl);
            connectionModel.set({uuid: connectionId});
            connectionModel.fetch();
            workflow.get('connections').add(connectionModel);
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

    /**
     * Returns resource assignment for given InputPort url.
     */
    _getResourceAssignments(url)
    {
        if (!this._resourceAssignments[url])
        {
            this._resourceAssignments[url] = new BaseCollection(null, {model: Resource});
        }
        return this._resourceAssignments[url];
    }

    /**
     * Returns resources available for given InputPort url.
     */
    _getResourcesAvailable(url)
    {
        if (!this._resourcesAvailable[url])
        {
            this._resourcesAvailable[url] = this._rodanChannel.request(Events.REQUEST__RESOURCES_GET_LIST_FOR_ASSIGNMENT, {url: url});
        }
        this._resourcesAvailable[url].syncList();
        return this._resourcesAvailable[url];
    }
}

export default WorkflowBuilderController;
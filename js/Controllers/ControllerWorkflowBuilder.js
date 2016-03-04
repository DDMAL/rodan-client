import _ from 'underscore';
import BaseCollection from '../Collections/BaseCollection';
import BaseController from './BaseController';
import Configuration from '../Configuration';
import Connection from '../Models/Connection';
import Events from '../Shared/Events';
import InputPort from '../Models/InputPort';
import ViewControlWorkflowJob from '../Views/Master/Main/WorkflowJob/ViewControlWorkflowJob';
import LayoutViewResourceAssignment from '../Views/Master/Main/WorkflowBuilder/ResourceAssignment/LayoutViewResourceAssignment';
import OutputPort from '../Models/OutputPort';
import Resource from '../Models/Resource';
import ResourceCollection from '../Collections/ResourceCollection';
import ResourceList from '../Models/ResourceList';
import ViewJobList from '../Views/Master/Main/Job/List/ViewJobList';
import ViewResourceList from '../Views/Master/Main/Resource/List/ViewResourceList';
import ViewResourceListItemModal from '../Views/Master/Main/Resource/List/ViewResourceListItemModal';
import ViewWorkflow from '../Views/Master/Main/Workflow/Individual/ViewWorkflow';
import ViewWorkflowList from '../Views/Master/Main/Workflow/List/ViewWorkflowList';
import ViewWorkflowListImportItem from '../Views/Master/Main/Workflow/List/ViewWorkflowListImportItem';
import Workflow from '../Models/Workflow';
import WorkflowBuilder from '../Plugins/WorkflowBuilder/WorkflowBuilder';
import WorkflowCollection from '../Collections/WorkflowCollection';
import WorkflowJob from '../Models/WorkflowJob';
import ViewWorkflowJobGroup from '../Views/Master/Main/WorkflowJobGroup/ViewWorkflowJobGroup';
import ViewSettings from '../Views/Master/Main/WorkflowJob/Settings/ViewSettings';
import LayoutViewControlPorts from '../Views/Master/Main/WorkflowJob/Ports/LayoutViewControlPorts';

/**
 * Controller for the Workflow Builder.
 */
class ControllerWorkflowBuilder extends BaseController
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
        this._resourceAssignments = []; // this helps manage the list of resource assignments while building the resource
        this._resourcesAvailable = []; // this is just a cache for resources that will work with a given input port
        this._workflowRunOptions = {};
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_SELECTED, options => this._handleEventBuilderSelected(options), this);

        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_CONNECTION, options => this._handleCommandAddConnection(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT, options => this._handleCommandAddInputPort(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT, options => this._handleCommandAddOutputPort(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOB, options => this._handleRequestAddWorkflowJob(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOBGROUP, options => this._handleRequestAddWorkflowJobGroup(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_ASSIGN_RESOURCE, options => this._handleRequestAssignResource(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_CREATE_WORKFLOWRUN, options => this._handleRequestCreateWorkflowRun(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_CREATE_DISTRIBUTOR, options => this._handleRequestCreateDistributor(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_CONNECTION, options => this._handleRequestDeleteConnection(options), this); 
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_INPUTPORT, options => this._handleCommandDeleteInputPort(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_OUTPUTPORT, options => this._handleCommandDeleteOutputPort(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_WORKFLOWJOB, options => this._handleRequestDeleteWorkflowJob(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_DELETE_WORKFLOWJOBGROUP, options => this._handleRequestDeleteWorkflowJobGroup(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_CONNECTION, options => this._handleRequestGetConnection(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_INPUTPORT, options => this._handleRequestGetInputPort(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_OUTPUTPORT, options => this._handleRequestGetOutputPort(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOW, () => this._handleRequestGetWorkflow(), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOB, options => this._handleRequestGetWorkflowJob(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOBGROUP, options => this._handleRequestGetWorkflowJobGroup(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_RESOURCEASSIGNMENTS, options => this._handleRequestGetResourceAssignments(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_IMPORT_WORKFLOW, options => this._handleRequestImportWorkflow(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW, options => this._handleEventLoadWorkflow(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_SAVE_WORKFLOWJOB, options => this._handleRequestSaveWorkflowJob(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_JOB_LIST_VIEW, options => this._handleRequestShowJobListView(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_RESOURCEASSIGNMENT_VIEW, options => this._handleRequestShowResourceAssignmentView(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOW_LIST_VIEW, options => this._handleRequestShowWorkflowListView(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOW_VIEW, options => this._handleRequestShowWorkflowView(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_VIEW, options => this._handleRequestShowWorkflowJobView(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_PORTS_VIEW, options => this._handleRequestShowWorkflowJobPortsView(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_SETTINGS_VIEW, options => this._handleRequestShowWorkflowJobSettingsView(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOBGROUP_VIEW, options => this._handleRequestShowWorkflowJobGroupView(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_UNASSIGN_RESOURCE, options => this._handleRequestUnassignResource(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_UNGROUP_WORKFLOWJOBGROUP, options => this._handleRequestWorkflowJobGroupUngroup(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW, options => this._handleRequestValidateWorkflow(options), this);
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
        this._workspace.initialize(this._workflow);
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW, {'workflow': options.workflow});
    }

    /**
     * Handle request create WorkflowRun.
     */
    _handleRequestCreateWorkflowRun(options)
    {
        this._workflowRunOptions = {workflow: options.model, assignments: {}};
        var inputPortTypes = this.rodanChannel.request(Events.REQUEST__GLOBAL_INPUTPORTTYPE_COLLECTION);
        var knownInputPorts = this._workflowRunOptions.workflow.get('workflow_input_ports').clone();
        for (var inputPortUrl in this._resourceAssignments)
        {
            // If our assignments for an InputPort are not needed, we just skip it.
            var inputPort = knownInputPorts.findWhere({url: inputPortUrl});
            if (!inputPort)
            {
                continue;
            }

            // If there is nothing for a given InputPort, error.
            this._workflowRunOptions.assignments[inputPortUrl] = [];
            var collection = this._getResourceAssignments(inputPortUrl);
            if (collection.length === 0)
            {
                alert('There are still unsatisfied Input Ports.');
                return;
            }

            // Get URLs.
            var resourceUrls = [];
            for (var i = 0; i < collection.length; i++)
            {
                var resource = collection.at(i);
                resourceUrls.push(resource.get('url'));
            } 

            // If the InputPort requires a ResourceList, we'll have to create one.
            // Else, just get the Resource URLs.
            var inputPortType = inputPortTypes.findWhere({url: inputPort.get('input_port_type')});
            if (inputPortType.get('is_list'))
            {
                var resource = collection.at(0);
                var resourceType = resource.get('resource_type');
                var resourceList = new ResourceList();
                resourceList.set({resources: resourceUrls, resource_type: resourceType});
                this._workflowRunOptions.assignments[inputPortUrl] = resourceList;
            }
            else
            {
                this._workflowRunOptions.assignments[inputPortUrl] = resourceUrls;
            }

            // Finally, remove the InputPort from the cloned Collection.
            knownInputPorts.remove(inputPort);
        }

        // If we have anything left oveer in our cloned Collection, something is wrong.
        if (knownInputPorts.length > 0)
        {
            alert('There are still unsatisfied Input Ports.');
        }
        else
        {
            this._attemptWorkflowRunCreation();
        }
    }

    /**
     * Handle request show Resource assignment view.
     */
    _handleRequestShowResourceAssignmentView(options)
    {
        // Create views.
        var inputPort = this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GET_INPUTPORT, {url: options.url});
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

        // Show the layout view.
        var view = new LayoutViewResourceAssignment({viewavailableresources: resourceListView, viewassignedresources: assignedResourceView});
        this.rodanChannel.request(Events.REQUEST__MODAL_SHOW, {view: view, title: 'InputPort'});
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
        this._processWorkflow(workflow);debugger;
        this._validateWorkflow(this._workflow);
    }

    /**
     * Handle request add workflow job.
     */
    _handleRequestAddWorkflowJob(options)
    {
        var addPorts = this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GET_ADDPORTS);
        this.rodanChannel.request(Events.REQUEST__WORKFLOWJOB_CREATE, {job: options.job, 
                                                                        workflow: this._workflow, 
                                                                        addports: addPorts});
    }

    /**
     * Handle command delete WorkflowJob.
     */
    _handleRequestDeleteWorkflowJob(options)
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWJOB_DELETE, {workflowjob: options.model});
    }

    /**
     * Handle command delete WorkflowJobGroup.
     */
    _handleRequestDeleteWorkflowJobGroup(options)
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_DELETE, {workflowjobgroup: options.model, workflow: this._workflow});
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
        this.rodanChannel.request(Events.REQUEST__WORKFLOWJOB_SAVE, {workflowjob: options.workflowjob});
    }

    /**
     * Handle request import Workflow.
     */
    _handleRequestImportWorkflow(options)
    {
        this.rodanChannel.request(Events.REQUEST__MODAL_HIDE);
        this.rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_IMPORT, {origin: options.workflow, target: this._workflow});
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
    _handleCommandSaveWorkflow(options)
    {
        this._workflow.save(options, {patch: true, success: () => this._validateWorkflow(this._workflow)});
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
        return this.rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP, {url: options.url});
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
        if (options && options.workflow)
        {
            this._validateWorkflow(options.workflow);  
        }
        else
        {
            this._validateWorkflow(this._workflow); 
        }
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
     * Handle request WorkflowJobGroup ungroup.
     */
    _handleRequestWorkflowJobGroupUngroup(options)
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_UNGROUP, {workflowjobgroup: options.model, workflow: this._workflow});
    }

    /**
     * Handle request add WorkflowJobGroup.
     */
    _handleRequestAddWorkflowJobGroup(options)
    {
        var workflowJobs = [];
        var workflowJobIDs = options.workflowjobids;
        for (var i in workflowJobIDs)
        {
            var workflowJobID = workflowJobIDs[i];
            var workflowJob = this._workflow.get('workflow_jobs').get(workflowJobID);
            workflowJobs.push(workflowJob);
        }
        this.rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_CREATE, {workflowjobs: workflowJobs, workflow: this._workflow});
    }

    /**
     * Handle request assign Resource to InputPort.
     */
    _handleRequestAssignResource(options)
    {
        var url = options.inputport.get('url');
        var resourcesAssigned = this._getResourceAssignments(url);
        var multipleUrl = this._getInputPortURLWithMultipleAssignments();
        if (multipleUrl && resourcesAssigned.length > 0 && multipleUrl !== url)
        {
            alert('Only one InputPort may have multiple Resources assigned to it.');
            return;
        }
        resourcesAssigned.add(options.resource);
    }

    /**
     * Handle request unassigne Resource from InputPort.
     */
    _handleRequestUnassignResource(options)
    {
        var resourcesAssigned = this._getResourceAssignments(options.inputport.get('url'));
        resourcesAssigned.remove(options.resource);
    }

    /**
     * Handle request get Resource assignments.
     */
    _handleRequestGetResourceAssignments(options)
    {
        return this._getResourceAssignments(options.url);
    }

    /**
     * Handle request get Workflow view.
     */
    _handleRequestShowWorkflowView(options)
    {
        var view = new ViewWorkflow({template: '#template-main_workflow_individual_edit', model: options.model});
        this.rodanChannel.request(Events.REQUEST__MODAL_SHOW, {view: view, title: 'Workflow: ' + options.model.getDescription()});
    }

    /**
     * Handle request get WorkflowJob view.
     */
    _handleRequestShowWorkflowJobView(options)
    {
        var workflowJob = this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOB, {url: options.url});
        var view = new ViewControlWorkflowJob({workflowjob: workflowJob});
        this.rodanChannel.request(Events.REQUEST__MODAL_SHOW, {view: view, title: 'WorkflowJob: ' + workflowJob.getDescription()});
    }

    /**
     * Handle request show Job list view.
     */
    _handleRequestShowJobListView(options)
    {
        var collection = this.rodanChannel.request(Events.REQUEST__GLOBAL_JOB_COLLECTION);
        var view = new ViewJobList({collection: collection});
        this.rodanChannel.request(Events.REQUEST__MODAL_SHOW, {view: view, title: 'Jobs'});
    }

    /**
     * Handle request show Workflow list view.
     */
    _handleRequestShowWorkflowListView(options)
    {
        var collection = new WorkflowCollection();
        collection.fetch({data: {/*project: project.id, */valid: 'True'}});
        var project = this.rodanChannel.request(Events.REQUEST__PROJECT_GET_ACTIVE);
        var view = new ViewWorkflowList({collection: collection,
                                                       childView: ViewWorkflowListImportItem,
                                                       template: '#template-main_workflow_list_import'});
        this.rodanChannel.request(Events.REQUEST__MODAL_SHOW, {view: view, title: 'Workflows'});
    }

    /**
     * Handle request show WorkflowJobGroup view.
     */
    _handleRequestShowWorkflowJobGroupView(options)
    {
        var workflowJobGroup = this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOBGROUP, {url: options.url});
        var view = new ViewWorkflowJobGroup({workflow: this._workflow, workflowjobgroup: workflowJobGroup});
        this.rodanChannel.request(Events.REQUEST__MODAL_SHOW, {view: view, title: 'WorkflowJobGroup'});
    }

    /**
     * Handle request show WorkflowJob ports view.
     */
    _handleRequestShowWorkflowJobPortsView(options)
    {
        var workflowJob = this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOB, {url: options.url});
        var view = new LayoutViewControlPorts({workflowjob: workflowJob});
        this.rodanChannel.request(Events.REQUEST__MODAL_SHOW, {view: view, title: 'WorkflowJob Ports'});
    }

    /**
     * Handle request show WorkflowJob settings view.
     */
    _handleRequestShowWorkflowJobSettingsView(options)
    {
        var workflowJob = this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOB, {url: options.url});
        var view = new ViewSettings({workflowjob: workflowJob});
        this.rodanChannel.request(Events.REQUEST__MODAL_SHOW, {view: view, title: 'WorkflowJob Settings'});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - REST response handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle ResourceList creation success.
     */
    _handleResourceListCreationSuccess(model, inputPortUrl)
    {
        this._workflowRunOptions.assignments[inputPortUrl] = [model.get('url')];
        this._attemptWorkflowRunCreation();
    }

    /**
     * Handle ResourceList creation error.
     */
    _handleResourceListCreationError()
    {
        // todo - need something here
    }

    /**
     * Handle InputPort creation success.
     */
    _handleInputPortCreationSuccess(model, workflow, workflowJob)
    {
        workflow.get('workflow_input_ports').add(model);
        workflowJob.get('input_ports').add(model);
        this._validateWorkflow(workflow);
    }

    /**
     * Handle OutputPort creation success.
     */
    _handleOutputPortCreationSuccess(model, workflow, workflowJob, targetInputPorts)
    {
        workflow.get('workflow_output_ports').add(model);
        workflowJob.get('output_ports').add(model);
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
        this._validateWorkflow(workflow);
    }

    /**
     * Handle InputPort deletion success.
     */
    _handleInputPortDeletionSuccess(model, workflow, workflowJob)
    {
        workflowJob.get('input_ports').remove(model);
        this._validateWorkflow(workflow);
    }

    /**
     * Handle OutputPort deletion success.
     */
    _handleOutputPortDeletionSuccess(model, workflow, workflowJob)
    {
        workflowJob.get('output_ports').remove(model);
        this._validateWorkflow(workflow);
    }

    /**
     * Handle Connection deletion success.
     */
    _handleConnectionDeletionSuccess(model, workflow)
    {
        workflow.get('connections').remove(model);
        this._validateWorkflow(workflow);
    }

    /**
     * Handle validation failure.
     */
    _handleValidationFailure(model, response, options)
    {
        model.set({'valid': false});
    }

    /**
     * Handle validation success.
     */
    _handleValidationSuccess(model, response, options)
    {
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_WORKFLOW_VALIDATED);
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
        port.destroy({success: (model) => this._handleInputPortDeletionSuccess(model, this._workflow, workflowJob)});
    }

    /**
     * Delete output port.
     */
    _deleteOutputPort(port, workflowJob)
    {
        port.destroy({success: (model) => this._handleOutputPortDeletionSuccess(model, this._workflow, workflowJob)});
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
        }

        // Finally inport the WorkflowJobGroups. 
        this.rodanChannel.request(Events.REQUEST__WORKFLOWJOBGROUP_LOAD_COLLECTION, {workflow: this._workflow});
    }

    /**
     * Process workflow job for GUI.
     */
    _processWorkflowJob(model)
    {
        // We want to keep track of what connections need to be made and return those.
        var connections = {};

        // Process input ports.
        var inputPorts = model.get('input_ports');
        if (inputPorts !== undefined)
        {
            for (var i = 0; i < inputPorts.length; i++)
            {
                var inputPort = inputPorts.at(i);

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
        var outputPorts = model.get('output_ports');
        if (outputPorts !== undefined)
        {
            for (var j = 0; j < outputPorts.length; j++)
            {
                var outputPort = outputPorts.at(j);

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
     * Attempts to validate Workflow.
     */
    _validateWorkflow(workflow)
    {
        workflow.save({valid: true}, {patch: true,
                                      success: (model, response, options) => this._handleValidationSuccess(model, response, options),
                                      error: (model, response, options) => this._handleValidationFailure(model, response, options)/*,
                                      use_generic: false*/});
    }

    /**
     * Given an array of InputPort URLs, returns an array of ResourceType URLs that
     * would satisfy the InputPorts.
     */
    _getCompatibleResourceTypeURLs(urls)
    {
        var resourceTypes = [];
        var inputPortTypes = this.rodanChannel.request(Events.REQUEST__GLOBAL_INPUTPORTTYPE_COLLECTION);
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
        var jobs = this.rodanChannel.request(Events.REQUEST__GLOBAL_JOB_COLLECTION).where({category: Configuration.RESOURCE_DISTRIBUTOR_CATEGORY});
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
        this.rodanChannel.request(Events.REQUEST__WORKFLOWJOB_CREATE, {job: job, 
                                                                        workflow: this._workflow, 
                                                                        addports: true,
                                                                        targetinputports: targetInputPorts});
    }

    /**
     * Return InputPort URL that has multiple assignments.
     * Returns null if DNE.
     */
    _getInputPortURLWithMultipleAssignments()
    {
        for (var inputPortUrl in this._resourceAssignments)
        {
            var resourceAssignments = this._getResourceAssignments(inputPortUrl);
            if (resourceAssignments.length > 1)
            {
                return inputPortUrl;
            }
        }
        return null;
    }

    /**
     * Returns resource assignment for given InputPort url.
     */
    _getResourceAssignments(inputPortUrl)
    {
        if (!this._resourceAssignments[inputPortUrl])
        {
            this._resourceAssignments[inputPortUrl] = new BaseCollection(null, {model: Resource});
        }
        return this._resourceAssignments[inputPortUrl];
    }

    /**
     * Returns resources available for given InputPort url.
     */
    _getResourcesAvailable(inputPortUrl)
    {
        if (!this._resourcesAvailable[inputPortUrl])
        {
            var project = this.rodanChannel.request(Events.REQUEST__PROJECT_GET_ACTIVE);
            var inputPort = this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GET_INPUTPORT, {url: inputPortUrl});
            var resourceTypeURLs = this._getCompatibleResourceTypeURLs(inputPortUrl);
            var data = {project: project.id, resource_type__in: ''};
            var globalResourceTypes = this.rodanChannel.request(Events.REQUEST__GLOBAL_RESOURCETYPE_COLLECTION);
            var first = true;
            for (var index in resourceTypeURLs)
            {
                var idString = null;
                if (first)
                {
                    first = false;
                    idString = globalResourceTypes.findWhere({url: resourceTypeURLs[index]}).id;
                }
                else
                {
                    idString = ',' + globalResourceTypes.findWhere({url: resourceTypeURLs[index]}).id;
                }
                data.resource_type__in = data.resource_type__in + idString;
            }
            this._resourcesAvailable[inputPortUrl] = new ResourceCollection();
            this._resourcesAvailable[inputPortUrl].fetch({data: data});
        }
        this._resourcesAvailable[inputPortUrl].syncList();
        return this._resourcesAvailable[inputPortUrl];
    }

    /**
     * Check WorkflowRun Resource assignments.
     *
     * This method checks if any Resource assignments are ResourceLists.
     * If there are and the ResourceList has no ID, it saves the list and waits for a response.
     * If it has an ID, it replaces the object with the URL for that ResourceList.
     * If a reference is just to an array of REsource refs, it is ignored.
     *
     * If everything checks out create the WorkflowRun and return true. Else return false.
     */
    _attemptWorkflowRunCreation()
    {
        for (var inputPortUrl in this._workflowRunOptions.assignments)
        {
            var assignments = this._workflowRunOptions.assignments[inputPortUrl];
            if (assignments instanceof ResourceList && !assignments.id)
            {
                // TODO - shitty way to do this; once I do a "save", I don't do another; this ensures that 'inputPortUrl'
                // doesn't get set to the last one in the loop
                assignments.save({}, {success: (model) => this._handleResourceListCreationSuccess(model, inputPortUrl),
                                       error: () => this._handleResourceListCreationError()});
                return false;
            }
        }
        this.rodanChannel.request(Events.REQUEST__WORKFLOWRUN_CREATE, this._workflowRunOptions);
        return true;
    }
}

export default ControllerWorkflowBuilder;
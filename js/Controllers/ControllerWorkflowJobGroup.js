import Configuration from '../Configuration';
import Events from '../Shared/Events';
import BaseController from './BaseController';
import WorkflowJobGroup from '../Models/WorkflowJobGroup';
import WorkflowJobGroupCollection from '../Collections/WorkflowJobGroupCollection';

/**
 * Controller for WorkflowJobGroup.
 */
class ControllerWorkflowJobGroup extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this._collection = new WorkflowJobGroupCollection();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_CREATE, (options) => this._handleRequestCreateWorkflowJobGroup(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_UNGROUP, (options) => this._handleRequestUngroupWorkflowJobGroup(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_SAVE, (options) => this._handleRequestSaveWorkflowJobGroup(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_IMPORT, (options) => this._handleRequestImportWorkflowJobGroup(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP, (options) => this._handleRequestWorkflowJobGroup(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_DELETE, (options) => this._handleRequestDeleteWorkflowJobGroup(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle WorkflowJobGroup creation.
     */
    _handleRequestCreateWorkflowJobGroup(options)
    {
        this._createWorkflowJobGroup(options.workflowjobs, options.workflow);
    }

    /**
     * Handle WorkflowJobGroup ungroup.
     */
    _handleRequestUngroupWorkflowJobGroup(options)
    {
        this._ungroupWorkflowJobGroup(options.workflowjobgroup, options.workflow, false);
    }

    /**
     * Handle WorkflowJobGroup save.
     */
    _handleRequestSaveWorkflowJobGroup(options)
    {
        options.workflowjobgroup.save(options.workflowjobgroup.changed, {patch: true});
    }

    /**
     * Handle WorkflowJobGroup import.
     */
    _handleRequestImportWorkflowJobGroup(options)
    {
        this._collection.fetch({data: {'workflow': options.workflow.get('uuid')}, success: () => this._handleWorkflowJobGroupImportSuccess(options.workflow)});
    }

    /**
     * Handle WorkflowJobGroup request.
     */
    _handleRequestWorkflowJobGroup(options)
    {
        return this._collection.findWhere({url: options.url});
    }

    /**
     * Handle WorkflowJobGroup delete.
     */
    _handleRequestDeleteWorkflowJobGroup(options)
    {
        this._ungroupWorkflowJobGroup(options.workflowjobgroup, options.workflow, true);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - REST handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle WorkflowJobGroup creation success.
     */
    _handleWorkflowJobGroupCreationSuccess(model, workflowJobs)
    {
        this._processWorkflowJobGroup(model, workflowJobs);
    }

    /**
     * Handle import success.
     */
    _handleWorkflowJobGroupImportSuccess(workflow)
    {
        for (var i = 0; i < this._collection.length; i++)
        {
            var workflowJobGroup = this._collection.at(i);
            var workflowJobs = [];
            for (var j = 0; j < workflowJobGroup.get('workflow_jobs').length; j++)
            {
                var workflowJobUrl = workflowJobGroup.get('workflow_jobs')[j];
                var workflowJob = workflow.get('workflow_jobs').findWhere({'url': workflowJobUrl});
                workflowJobs.push(workflowJob)
            }
            this._processWorkflowJobGroup(workflowJobGroup, workflowJobs);
        }
    }

    /**
     * Handle ungroup success.
     */
    _handleWorkflowJobGroupUngroupSuccess(workflowJobGroup)
    {
        var workflowJobs = workflowJobGroup.get('workflow_jobs');
        for (var index in workflowJobs)
        {
            var workflowJob = this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GET_WORKFLOWJOB, {url: workflowJobs[index]});
            this.rodanChannel.request(Events.REQUEST__WORKFLOWJOB_DELETE, {workflowjob: workflowJob});
        }
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Creates and returns a WorkflowJobGroup.
     */
    _createWorkflowJobGroup(workflowJobs, workflow)
    {
        var urls = [];
        for (var index in workflowJobs)
        {
            urls.push(workflowJobs[index].get('url'));
        }
        var workflowJobGroup = new WorkflowJobGroup({workflow_jobs: urls, workflow: workflow});
        workflowJobGroup.save({}, {success: (model) => this._handleWorkflowJobGroupCreationSuccess(model, workflowJobs)});
    }

    /**
     * Ungroups a WorkflowJobGroup
     */
    _ungroupWorkflowJobGroup(workflowJobGroup, workflow, deleteWorkflowJobs)
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOBGROUP, {workflowjobgroup: workflowJobGroup});
        var workflowJobURLs = workflowJobGroup.get('workflow_jobs');
        for (var index in workflowJobURLs)
        {
            var workflowJobCollection = workflow.get('workflow_jobs');
            var workflowJobURL = workflowJobURLs[index];
            var workflowJob = workflowJobCollection.findWhere({'url': workflowJobURLs[index]});
            this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_SHOW_WORKFLOWJOB, {workflowjob: workflowJob});
        }
        this._collection.remove(workflowJobGroup);

        if (deleteWorkflowJobs)
        {
            workflowJobGroup.destroy({success: (model) => this._handleWorkflowJobGroupUngroupSuccess(model)});
        }
        else
        {
            workflowJobGroup.destroy();
        }
    }

    /**
     * Processes the WorkflowJobGroup.
     */
    _processWorkflowJobGroup(workflowJobGroup, workflowJobs)
    {
        this._collection.set(workflowJobGroup, {remove: false});

        // Hide WorkflowJobs.
        for (var index in workflowJobs)
        {
            this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_HIDE_WORKFLOWJOB, {workflowjob: workflowJobs[index]});
        }

        // Create new stuff.
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOBGROUP, {workflowjobgroup: workflowJobGroup});
        var exposedPorts = this._getExposedPorts(workflowJobs);
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_PORT_ITEMS_WITH_WORKFLOWJOBGROUP, {workflowjobgroup: workflowJobGroup,
                                                                                                          inputports: exposedPorts.inputPorts,
                                                                                                          outputports: exposedPorts.outputPorts});
    }

    /**
     * Save WorkflowJobGroup.
     */
    _saveWorkflowJobGroup(workflowJobGroup)
    {
        workflowJobGroup.save({name: workflowJobGroup.get('name')}, {patch: true});
    }

    /**
     * Determine which ports should be kept exposed for the provided WorkflowJobs.
     *
     * It should be exposed if:
     * - it does not have an associated Connection
     * - it is connected to a port outside of the WorkflowJobs
     */
    _getExposedPorts(workflowJobs)
    {
        var object = {inputPorts: {}, outputPorts: {}};
        var connections = {};

        // Go through the WorkflowJobs. For each InputPort:
        // - add it to the return list
        // - if it has Connections, add that Connection and the associated InputPort to the Connections list
        for (var workflowJobIndex in workflowJobs)
        {
            var inputPorts = workflowJobs[workflowJobIndex].get('input_ports');
            for (var i = 0; i < inputPorts.length; i++)
            {
                var inputPort = inputPorts.at(i);
                object.inputPorts[inputPort.get('url')] = inputPort;
                if (inputPort.get('connections').length !== 0)
                {
                    var connection = inputPort.get('connections')[0];
                    connections[connection] = {inputPort: inputPort};
                }
            }
        }

        // Go through the WorkflowJobs. For each OutputPort:
        // - if it doesn't have Connections, add it to the return list
        // - if it has Connections:
        // -- if the Connection exists in the Connection list, remove the InputPort from reeturn list and 
        //    remove the Connection from the Connection list
        // -- else, the OutputPort is added to the return list
        for (var workflowJobIndex in workflowJobs)
        {
            // Get unsatisfied OutputPorts and also collect OutputPorts with Connections.
            var outputPorts = workflowJobs[workflowJobIndex].get('output_ports');
            for (var i = 0; i < outputPorts.length; i++)
            {
                var outputPort = outputPorts.at(i);
                if (outputPort.get('connections').length === 0)
                {
                    object.outputPorts[outputPort.get('url')] = outputPort;
                    continue;
                }
                else
                {
                    for (var j = 0; j < outputPort.get('connections').length; j++)
                    {
                        var connection = outputPort.get('connections')[j];
                        if (connection in connections)
                        {
                            delete object.inputPorts[connections[connection].inputPort.get('url')];
                            delete connections[connection];
                        }
                        else
                        {
                            object.outputPorts[outputPort.get('url')] = outputPort;
                        }
                    }
                }
            }
        }
        return object;
    }
}

export default ControllerWorkflowJobGroup;
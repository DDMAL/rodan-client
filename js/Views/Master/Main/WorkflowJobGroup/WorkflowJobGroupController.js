import Events from '../../../../Shared/Events';
import BaseController from '../../../../Controllers/BaseController';
import WorkflowJobGroup from '../../../../Models/WorkflowJobGroup';
import WorkflowJobGroupCollection from '../../../../Collections/WorkflowJobGroupCollection';

/**
 * Controller for WorkflowJobGroup.
 */
class WorkflowJobGroupController extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_CREATE, (options) => this._handleRequestCreateWorkflowJobGroup(options));
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_DELETE, (options) => this._handleRequestDeleteWorkflowJobGroup(options));
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_SAVE, (options) => this._handleRequestSaveWorkflowJobGroup(options));
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_IMPORT, (options) => this._handleRequestImportWorkflowJobGroup(options));
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
     * Handle WorkflowJobGroup deletion.
     */
    _handleRequestDeleteWorkflowJobGroup(options)
    {
        this._deleteWorkflowJobGroup(options.workflowjobgroup, options.workflow);
    }

    /**
     * Handle WorkflowJobGroup save.
     */
    _handleRequestSaveWorkflowJobGroup(options)
    {
        this._saveWorkflowJobGroup(options.workflowjobgroup);
    }

    /**
     * Handle WorkflowJobGroup import.
     */
    _handleRequestImportWorkflowJobGroup(options)
    {
        var collection = new WorkflowJobGroupCollection();
        collection.fetch({data: {'workflow': options.workflow.get('uuid')}, success: (model) => this._handleWorkflowJobGroupImportSuccess(model, options.workflow)});
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
    _handleWorkflowJobGroupImportSuccess(workflowJobGroups, workflow)
    {
        for (var i = 0; i < workflowJobGroups.length; i++)
        {
            var workflowJobGroup = workflowJobGroups.at(i);
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

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Creates and returns a WorkflowJobGroup.
     */
    _createWorkflowJobGroup(workflowJobs, workflow)
    {
       /* TODO
        - delete connection (general)
        - importing groups
        - importing workflows
        - saving group coordinates
        - setting initial position of group
        - make sure connections are rendered behind everything else?*/

        var urls = [];
        for (var index in workflowJobs)
        {
            urls.push(workflowJobs[index].get('url'));
        }
        var workflowJobGroup = new WorkflowJobGroup({workflow_jobs: urls, workflow: workflow});
        workflowJobGroup.save({}, {success: (model) => this._handleWorkflowJobGroupCreationSuccess(model, workflowJobs)});
        return workflowJobGroup; 
    }

    /**
     * Deletes a WorkflowJobGroup
     */
    _deleteWorkflowJobGroup(workflowJobGroup, workflow)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOBGROUP, {workflowjobgroup: workflowJobGroup});
        var workflowJobURLs = workflowJobGroup.get('workflow_jobs');
        for (var index in workflowJobURLs)
        {
            var workflowJobCollection = workflow.get('workflow_jobs');
            var workflowJobURL = workflowJobURLs[index];
            var workflowJob = workflowJobCollection.findWhere({'url': workflowJobURLs[index]});
            this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_SHOW_WORKFLOWJOB, {workflowjob: workflowJob});
        }
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_CONTROL_SHOW_JOBS, {}); 
        workflowJobGroup.destroy();
    }

    /**
     * Processes the WorkflowJobGroup.
     */
    _processWorkflowJobGroup(workflowJobGroup, workflowJobs)
    {
        for (var index in workflowJobs)
        {
            this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_HIDE_WORKFLOWJOB, {workflowjob: workflowJobs[index]});
        }
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOBGROUP, {workflowjobgroup: workflowJobGroup});
        var exposedPorts = this._getExposedPorts(workflowJobs);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_PORT_ITEMS_WITH_WORKFLOWJOBGROUP, {workflowjobgroup: workflowJobGroup,
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

export default WorkflowJobGroupController;
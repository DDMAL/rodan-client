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
        // Requests.
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_CREATE, (options) => this._handleRequestCreateWorkflowJobGroup(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_DELETE, (options) => this._handleRequestDeleteWorkflowJobGroup(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_GET_PORTS, (options) => this._handleRequestGetPorts(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_IMPORT, (options) => this._handleRequestImportWorkflowJobGroup(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_LOAD_COLLECTION, (options) => this._handleRequestWorkflowJobGroupLoadCollection(options));
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWJOBGROUP_SAVE, (options) => this._handleRequestSaveWorkflowJobGroup(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle WorkflowJobGroup creation.
     */
    _handleRequestCreateWorkflowJobGroup(options)
    {
        var urls = [];
        var workflowJobs = options.workflowjobs;
        var workflow = options.workflow;
        for (var index in workflowJobs)
        {
            urls.push(workflowJobs[index].get('url'));
        }
        var workflowJobGroup = new WorkflowJobGroup({workflow_jobs: urls, workflow: workflow});
        workflowJobGroup.save({}, {success: (model) => this._handleWorkflowJobGroupCreationSuccess(model)});
    }

    /**
     * Handle WorkflowJobGroup save.
     */
    _handleRequestSaveWorkflowJobGroup(options)
    {
        options.workflowjobgroup.save(options.workflowjobgroup.changed, {patch: true, success: (model) => this.rodanChannel.trigger(Events.EVENT__WORKFLOWJOBGROUP_SAVED, {workflowjobgroup: model})});
    }

    /**
     * Handle WorkflowJobGroup load.
     */
    _handleRequestWorkflowJobGroupLoadCollection(options)
    {
        this._collection.fetch({data: {'workflow': options.workflow.get('uuid')}});
    }

    /**
     * Handle WorkflowJobGroup delete.
     */
    _handleRequestDeleteWorkflowJobGroup(options)
    {
        options.workflowjobgroup.destroy({success: (model) => this._handleWorkflowJobGroupDeleteSuccess(options.workflowjobgroup)});
    }

    /**
     * Handle request import Workflow.
     */
    _handleRequestImportWorkflowJobGroup(options)
    {
        var workflow = options.target;
        var originWorkflow = options.origin;
        var newGroup = new WorkflowJobGroup({'workflow': workflow.get('url'), 'origin': originWorkflow.get('url')});
        newGroup.save({}, {success: (model) => this._handleWorkflowJobGroupCreationSuccess(model)});
    }

    /**
     * Handle request get ports.
     */
    _handleRequestGetPorts(options)
    {
        var workflowJobGroup = this._collection.findWhere({url: options.url});
        return this._getExposedPorts(workflowJobGroup, options.workflow);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - REST handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle import success.
     */
    _handleWorkflowJobGroupCreationSuccess(model)
    {
        this._collection.set(model, {remove: false});
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWJOBGROUP_IMPORTED, {workflowjobgroup: model});
    }

    /**
     * Handle ungroup success.
     */
    _handleWorkflowJobGroupDeleteSuccess(workflowJobGroup)
    {
        this._collection.remove(workflowJobGroup);
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWJOBGROUP_DELETED, {workflowjobgroup: workflowJobGroup});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Determine which ports should be kept exposed for the provided WorkflowJobs.
     *
     * It should be exposed if:
     * - it does not have an associated Connection
     * - it is connected to a port outside of the WorkflowJobs
     */
    _getExposedPorts(workflowJobGroup, workflow)
    {
        var object = {inputports: {}, outputports: {}};
        var connections = {};
        var workflowJobUrls = workflowJobGroup.get('workflow_jobs');

        // Go through the WorkflowJobs. For each InputPort:
        // - add it to the return list
        // - if it has Connections, add that Connection and the associated InputPort to the Connections list
        for (var index in workflowJobUrls)
        {
            var workflowJobUrl = workflowJobUrls[index];
            var workflowJob = workflow.get('workflow_jobs').findWhere({url: workflowJobUrl});
            if (!workflowJob)
            {
                return null;
            }

            var inputPorts = workflowJob.get('input_ports');
            for (var i = 0; i < inputPorts.length; i++)
            {
                var inputPort = inputPorts.at(i);
                object.inputports[inputPort.get('url')] = inputPort;
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
        for (var index in workflowJobUrls)
        {
            var workflowJobUrl = workflowJobUrls[index];
            var workflowJob = workflow.get('workflow_jobs').findWhere({url: workflowJobUrl});

            // Get unsatisfied OutputPorts and also collect OutputPorts with Connections.
            var outputPorts = workflowJob.get('output_ports');
            for (var i = 0; i < outputPorts.length; i++)
            {
                var outputPort = outputPorts.at(i);
                if (outputPort.get('connections').length === 0)
                {
                    object.outputports[outputPort.get('url')] = outputPort;
                    continue;
                }
                else
                {
                    for (var j = 0; j < outputPort.get('connections').length; j++)
                    {
                        var connection = outputPort.get('connections')[j];
                        if (connection in connections)
                        {
                            delete object.inputports[connections[connection].inputPort.get('url')];
                            delete connections[connection];
                        }
                        else
                        {
                            object.outputports[outputPort.get('url')] = outputPort;
                        }
                    }
                }
            }
        }
        return object;
    }
}

export default ControllerWorkflowJobGroup;
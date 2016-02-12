import Events from '../Shared/Events';
import BaseController from '../Controllers/BaseController';
import WorkflowJob from '../Models/WorkflowJob';

/**
 * Controller for WorkflowJobs.
 */
class WorkflowJobController extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Initialization
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWJOB_CREATE, options => this._handleRequestCreateWorkflowJob(options));
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWJOB_DELETE, options => this._handleRequestDeleteWorkflowJob(options));
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWJOB_SAVE, options => this._handleRequestSaveWorkflowJob(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Create WorkflowJob.
     *
     * If ports are to be automatically generated, we add a success function that adds them.
     */
    _handleRequestCreateWorkflowJob(options)
    {
        var workflowJob = new WorkflowJob({job: options.job.get('url'), workflow: options.workflow.get('url')});
        var addPorts = options.addports ? options.addports : false;
        var targetInputPorts = options.targetinputports ? options.targetinputports : [];
        workflowJob.save({}, {success: (model) => this._handleWorkflowJobCreationSuccess(model, 
                                                                                         options.workflow, 
                                                                                         addPorts,
                                                                                         targetInputPorts)});
    }

    /**
     * Delete WorkflowJob
     */
    _handleRequestDeleteWorkflowJob(options)
    {
        options.workflowjob.destroy({success: (model) => this._handleWorkflowJobDeletionSuccess(model, options.workflow)});
    }

    /**
     * Handle save WorkflowJob.
     */
    _handleRequestSaveWorkflowJob(options)
    {
        options.workflowjob.save(options.workflowjob.changed, {patch: true, success: (model) => this._handleWorkflowJobSaveSuccess(model, options.workflow)});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - REST handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle WorkflowJob creation success.
     */
    _handleWorkflowJobCreationSuccess(model, workflow, addPorts, targetInputPorts)
    {
        workflow.get('workflow_jobs').add(model);
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_ITEM_WORKFLOWJOB, {workflowjob: model});
        if (addPorts)
        {
            this._addRequiredPorts(model, targetInputPorts);
        }
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW, {workflow: workflow});
    }

    /**
     * Handle WorkflowJob deletion success.
     */
    _handleWorkflowJobDeletionSuccess(model, workflow)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GUI_DELETE_ITEM_WORKFLOWJOB, {workflowjob: model});
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW, {workflow: workflow});
    }

    /**
     * Handle WorkflowJob save success.
     */
    _handleWorkflowJobSaveSuccess(model, workflow)
    {
        this._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_VALIDATE_WORKFLOW, {workflow: workflow});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Given a WorkflowJob, adds ports that must be present.
     * This method assumes that the WorkflowJob has NO ports to begin with.
     * The InputPorts in targetInputPorts will be automatically connected to IFF the resulting
     * WorkflowJob has one OutputPort.
     */
    _addRequiredPorts(workflowJob, targetInputPorts)
    {
        var jobCollection = this._rodanChannel.request(Events.REQUEST__GLOBAL_JOB_COLLECTION);
        var job = jobCollection.get(workflowJob.getJobUuid());
        var outputPortTypes = job.get('output_port_types');
        var inputPortTypes = job.get('input_port_types');

        this._addInputPorts(workflowJob, inputPortTypes);
        this._addOutputPorts(workflowJob, outputPortTypes, targetInputPorts);
    }

    /**
     * Adds InputPorts.
     */
    _addInputPorts(workflowJob, inputPortTypes)
    {
        var that = this;
        inputPortTypes.forEach(function(inputPortType) 
        {
            for (var i = 0; i < inputPortType.get('minimum');i ++)
            {
                that._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT, {inputporttype: inputPortType, workflowjob: workflowJob});
            }
        });
    }

    /**
     * Adds OutputPorts.
     */
    _addOutputPorts(workflowJob, outputPortTypes, targetInputPorts)
    {
        var that = this;
        var sendTargetInputPorts = outputPortTypes.length === 1 && outputPortTypes.at(0).get('minimum') === 1 ? targetInputPorts : [];
        outputPortTypes.forEach(function(outputPortType) 
        {
            for (var i = 0; i < outputPortType.get('minimum'); i++)
            {
                that._rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT, 
                                           {outputporttype: outputPortType, workflowjob: workflowJob, targetinputports: targetInputPorts});
            }
        });
    }
}

export default WorkflowJobController;
import BaseController from './BaseController';
import Events from '../Shared/Events';
import LayoutViewIndividualWorkflowRun from '../Views/Master/Main/WorkflowRun/Individual/LayoutViewIndividualWorkflowRun';
import ViewWorkflowRunList from '../Views/Master/Main/WorkflowRun/List/ViewWorkflowRunList';
import RunJobCollection from '../Collections/RunJobCollection';
import WorkflowRun from '../Models/WorkflowRun';
import WorkflowRunCollection from '../Collections/WorkflowRunCollection';

/**
 * Controller for WorkflowRun.
 */
class ControllerWorkflowRun extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Initialize
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        // Events.
        this.rodanChannel.on(Events.EVENT__WORKFLOWRUN_CREATE_RESPONSE, options => this._handleEventWorkflowRunCreationResponse(options));
        this.rodanChannel.on(Events.EVENT__WORKFLOWRUN_SAVE_RESPONSE, options => this._handleEventWorkflowRunSaveResponse(options));

        // Requests.
        this.rodanChannel.on(Events.EVENT__WORKFLOWRUN_SELECTED_COLLECTION, options => this._handleEventListSelected(options), this);
        this.rodanChannel.on(Events.EVENT__WORKFLOWRUN_SELECTED, options => this._handleEventItemSelected(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWRUN_CREATE, options => this._handleRequestWorkflowRunCreate(options), this);
        this.rodanChannel.reply(Events.REQUEST__WORKFLOWRUN_SAVE, options => this._handleRequestWorkflowRunSave(options), this);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle event Project generic response.
     */
    _handleEventWorkflowRunCreationResponse(options)
    {
        if (options.status === 'success')
        {
            this.rodanChannel.request(Events.REQUEST__MODAL_HIDE);
            var project = this.rodanChannel.request(Events.REQUEST__PROJECT_GET_ACTIVE);
            this.rodanChannel.trigger(Events.EVENT__WORKFLOWRUN_SELECTED_COLLECTION, {project: project});
        }
        else
        {
            this.rodanChannel.request(Events.REQUEST__MODAL_HIDE);
            this.rodanChannel.request(Events.REQUEST__MODAL_SHOW_SIMPLE, {title: 'Error :(', text: options.response.responseText});
        }
    }

    /**
     * Handle event Project save response.
     */
    _handleEventWorkflowRunSaveResponse(options)
    {
        if (options.status === 'success')
        {
            this.rodanChannel.request(Events.REQUEST__MODAL_HIDE);
            var project = this.rodanChannel.request(Events.REQUEST__PROJECT_GET_ACTIVE);
        }
        else
        {
            this.rodanChannel.request(Events.REQUEST__MODAL_HIDE);
            this.rodanChannel.request(Events.REQUEST__MODAL_SHOW_SIMPLE, {title: 'Error :(', text: options.response.responseText});
        }
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        var runJobs = new RunJobCollection();
        runJobs.fetch({data: {workflow_run: options.workflowrun.id}});
        this._viewItem = new LayoutViewIndividualWorkflowRun({collection: runJobs, model: options.workflowrun});
        this.rodanChannel.request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: this._viewItem});
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected(options)
    {
        var workflowRunCollection = new WorkflowRunCollection();
        workflowRunCollection.fetchSort(false, 'created', {data: {project: options.project.id}});
        this.rodanChannel.request(Events.REQUEST__TIMER_SET_FUNCTION, {function: () => workflowRunCollection.syncList()});
        var view = new ViewWorkflowRunList({collection: workflowRunCollection});
        this.rodanChannel.request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: view});
    }

    /**
     * Handle request create WorkflowRun.
     */
    _handleRequestWorkflowRunCreate(options)
    {
        var name = options.workflow.get('name');
        var description = 'Run of Workflow "' + name + '"\n\n' + this._getResourceAssignmentDescription(options.assignments);
        var workflowRun = new WorkflowRun({workflow: options.workflow.get('url'), 
                                           resource_assignments: options.assignments,
                                           name: name,
                                           description: description});
        workflowRun.save({}, {success: (model, response, options) => this._handleWorkflowRunCreateComplete(model, response, options),
                              error: (model, response, options) => this._handleWorkflowRunCreateComplete(model, response, options)});
        this.rodanChannel.request(Events.REQUEST__MODAL_SHOW_SIMPLE, {title: 'Creating Workflow Run', text: 'Please wait...'});
    }

    /**
     * Handle request save WorkflowRun.
     */
    _handleRequestWorkflowRunSave(options)
    {
        options.workflowrun.save(options.workflowrun.changed, {patch: true,
                                                               success: (model, response, options) => this._handleWorkflowRunSaveComplete(model, response, options),
                                                               error: (model, response, options) => this._handleWorkflowRunSaveComplete(model, response, options)});
        this.rodanChannel.request(Events.REQUEST__MODAL_SHOW_SIMPLE, {title: 'Saving Workflow Run', text: 'Please wait...'});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Callback handlres
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle WorkflowRun creation callback.
     */
    _handleWorkflowRunCreateComplete(model, response, options)
    {
        var returnObject = {status: 'success', response: model};
        if (options.xhr.statusText !== 'CREATED')
        {
            returnObject = {status: 'failed', response: response};
        }
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWRUN_CREATE_RESPONSE, returnObject);
    }

    /**
     * Handle WorkflowRun save callback.
     */
    _handleWorkflowRunSaveComplete(model, response, options)
    {
        var returnObject = {status: 'success', response: model};
        if (options.xhr.statusText !== 'OK')
        {
            returnObject = {status: 'failed', response: response};
        }
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWRUN_SAVE_RESPONSE, returnObject);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Given resource assignments, provides descriptive info.
     */
    _getResourceAssignmentDescription(assignments)
    {
        var text = '';
        for (var inputPortUrl in assignments)
        {
            var resourceUrls = assignments[inputPortUrl];
            for (var index in resourceUrls)
            {
                text += '- ' + resourceUrls[index] + '\n';
            }
            text += '\n';
        }
        return text;
    }
}

export default ControllerWorkflowRun;
import BaseController from './BaseController';
import RODAN_EVENTS from '../Shared/RODAN_EVENTS';
import LayoutViewIndividualWorkflowRun from '../Views/Master/Main/WorkflowRun/Individual/LayoutViewIndividualWorkflowRun';
import Radio from 'backbone.radio';
import RunJobCollection from '../Collections/RunJobCollection';
import ViewWorkflowRunList from '../Views/Master/Main/WorkflowRun/List/ViewWorkflowRunList';
import WorkflowRun from '../Models/WorkflowRun';
import WorkflowRunCollection from '../Collections/WorkflowRunCollection';

/**
 * Controller for WorkflowRun.
 */
export default class ControllerWorkflowRun extends BaseController
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
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__WORKFLOWRUN_CREATED, options => this._handleEventWorkflowRunCreationResponse(options));
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__WORKFLOWRUN_SAVED, options => this._handleEventWorkflowRunSaveResponse(options));

        // Requests.
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__WORKFLOWRUN_SELECTED_COLLECTION, options => this._handleEventListSelected(options), this);
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__WORKFLOWRUN_SELECTED, options => this._handleEventItemSelected(options), this);
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__WORKFLOWRUN_CREATE, options => this._handleRequestWorkflowRunCreate(options), this);
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__WORKFLOWRUN_SAVE, options => this._handleRequestWorkflowRunSave(options), this);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle event Project generic response.
     */
    _handleEventWorkflowRunCreationResponse(options)
    {
        var project = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__PROJECT_GET_ACTIVE);
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__WORKFLOWRUN_SELECTED_COLLECTION, {project: project});
    }

    /**
     * Handle event Project save response.
     */
    _handleEventWorkflowRunSaveResponse(options)
    {
        var project = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__PROJECT_GET_ACTIVE);
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        var runJobs = new RunJobCollection();
        runJobs.fetch({data: {workflow_run: options.workflowrun.id}});
        this._viewItem = new LayoutViewIndividualWorkflowRun({collection: runJobs, model: options.workflowrun});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MAINREGION_SHOW_VIEW, {view: this._viewItem});
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected(options)
    {
        var workflowRunCollection = new WorkflowRunCollection();
        workflowRunCollection.fetchSort(false, 'created', {data: {project: options.project.id}});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__TIMER_SET_FUNCTION, {function: () => workflowRunCollection.syncList()});
        var view = new ViewWorkflowRunList({collection: workflowRunCollection});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MAINREGION_SHOW_VIEW, {view: view});
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
        workflowRun.save({}, {success: (model) => Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__WORKFLOWRUN_CREATED, {workflowrun: model})});
    }

    /**
     * Handle request save WorkflowRun.
     */
    _handleRequestWorkflowRunSave(options)
    {
        options.workflowrun.save(options.workflowrun.changed,
                                 {patch: true, success: (model) => Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__WORKFLOWRUN_SAVED, {workflowrun: model})});
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
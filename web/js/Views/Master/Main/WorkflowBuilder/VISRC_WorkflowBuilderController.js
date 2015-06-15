import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';
import VISRC_LayoutViewWorkflowBuilder from './VISRC_LayoutViewWorkflowBuilder';
import VISRC_ViewEditWorkflow from './Control/VISRC_ViewEditWorkflow';
import VISRC_ViewJob from './Control/Individual/VISRC_ViewJob';
import VISRC_ViewJobList from './Control/List/VISRC_ViewJobList';
import VISRC_Workflow from '../../../../Models/VISRC_Workflow';
import VISRC_WorkflowJob from '../../../../Models/VISRC_WorkflowJob';

import VISRC_Workspace from '../../../../Plugins/Workspace/VISRC_Workspace';

/**
 * Controller for the Workflow Builder.
 *
 * Aside from controlling the views, it also caches all requests meant for the server.
 * When the user requests a save, this class flushes the requests to the server.
 */
class VISRC_WorkflowBuilderController extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize(aOptions)
    {
        this._initializeViews();
        this._initializeRadio();
        this._workflow = null;
        this._workspace = new VISRC_Workspace();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.on(VISRC_Events.EVENT__JOB_SELECTED, aReturn => this._handleEventJobSelected(aReturn));

        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWBUILDER_SELECTED, aReturn => this._handleEventBuilderSelected(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_WORKFLOW, () => this._handleCommandAddWorkflow());
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_WORKFLOWJOB, aReturn => this._handleCommandAddWorkflowJob(aReturn));
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.layoutView = new VISRC_LayoutViewWorkflowBuilder();
        this.jobListView = new VISRC_ViewJobList();
        this.editWorkflowView = new VISRC_ViewEditWorkflow();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - view controls
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle selection.
     */
    _handleEventBuilderSelected(aReturn)
    {
        // Inform that we need jobs loaded.
        this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_JOBS, {});

        // Send the layout view to the main region.
        this.rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this.layoutView);

        // Get the workflow. If not null, we can show the job views.
        this._workflow = aReturn.workflow;
        if (this._workflow != null)
        {
            this._loadWorkflow(this._workflow);
        }

        // Initialize the workspace.
        this._workspace.initialize("canvas-workspace");
        this._workspace.activate();
    }

    /**
     * Handle selection.
     */
    _handleEventJobSelected(aReturn)
    {
        // TODO - I don't want to instantiate a view every time, but Marionette doesn't rerender a view if the ENTIRE model
        // is replaced. I should find a better way to do this so I can reuse the same ItemView again and again.
        this.jobView = new VISRC_ViewJob(aReturn);
        this.layoutView.showControlJob(this.jobView);
    }

    /**
     * Handle command add workflow.
     */
    _handleCommandAddWorkflow()
    {
        var project = this.rodanChannel.request(VISRC_Events.REQUEST__PROJECT_ACTIVE);
        this._workflow = this._createWorkflow(project);
        this._loadWorkflow(this._workflow);
    }

    /**
     * Handle command add workflow job.
     */
    _handleCommandAddWorkflowJob(aReturn)
    {
        var workflowJob = this._createWorkflowJob(aReturn.job, this._workflow);
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKSPACE_ADD_ITEM_WORKFLOWJOB, {model: workflowJob});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - workflow object controls
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Loads workflow to builder.
     */
    _loadWorkflow(aWorkflow)
    {
        this.editWorkflowView.model = aWorkflow;
        this._showJobListView();
        this._showEditWorkflowView();
    }

    /**
     * Shows the job list view.
     */
    _showJobListView()
    {
        // TODO - don't want to do this, but for some reason my views get destroyed when
        // the containing region is destroyed!
        this.jobListView.isDestroyed = false;
        this.layoutView.showControlJobList(this.jobListView);
    }

    /**
     * Shows edit workflow view.
     */
    _showEditWorkflowView()
    {
        this.editWorkflowView.isDestroyed = false;
        this.layoutView.showControlEditWorkflow(this.editWorkflowView);
    }

    /**
     * Create workflow.
     */
    _createWorkflow(aProject)
    {
        var workflow =  new VISRC_Workflow({project: aProject.attributes.url, name: "untitled"});
        workflow.save();
        return workflow;
    }

    /**
     * Create workflow job.
     */
    _createWorkflowJob(aJob, aWorkflow)
    {
        var workflowJob = new VISRC_WorkflowJob({job: aJob.attributes.url, workflow: this._workflow.attributes.url});
        workflowJob.save();
        return workflowJob;
    }
}

export default VISRC_WorkflowBuilderController;
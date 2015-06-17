import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';
import VISRC_LayoutViewWorkflowBuilder from './VISRC_LayoutViewWorkflowBuilder';
import VISRC_ViewControlWorkflow from './Control/VISRC_ViewControlWorkflow';
import VISRC_LayoutViewControlJob from './Control/VISRC_LayoutViewControlJob';
import VISRC_LayoutViewControlWorkflowJob from './Control/VISRC_LayoutViewControlWorkflowJob';
import VISRC_Workflow from '../../../../Models/VISRC_Workflow';
import VISRC_WorkflowJob from '../../../../Models/VISRC_WorkflowJob';

import VISRC_Workspace from '../../../../Plugins/Workspace/VISRC_Workspace';

/**
 * Controller for the Workflow Builder.
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

        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWBUILDER_SELECTED, aReturn => this._handleEventBuilderSelected(aReturn));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_WORKFLOW, () => this._handleCommandAddWorkflow());
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_WORKFLOWJOB, aReturn => this._handleCommandAddWorkflowJob(aReturn));
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED, aReturn => this._handleEventEditWorkflowJob(aReturn));
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.layoutView = new VISRC_LayoutViewWorkflowBuilder();
        this.controlWorkflowView = new VISRC_ViewControlWorkflow();
        this.controlJobView = new VISRC_LayoutViewControlJob();
        this.controlWorkflowJobView = new VISRC_LayoutViewControlWorkflowJob();
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

        // Get the workflow.
        this._workflow = aReturn.workflow;
        if (this._workflow != null)
        {
            this._showJobControlView();
        }
        else
        {
            this._showWorkflowControlView();
        }

        // Initialize the workspace.
        this._workspace.initialize("canvas-workspace");
    }
    
    /**
     * Handle command add workflow.
     */
    _handleCommandAddWorkflow()
    {
        var project = this.rodanChannel.request(VISRC_Events.REQUEST__PROJECT_ACTIVE);
        this._workflow = this._createWorkflow(project);

        this._showJobControlView();
    }

    /**
     * Handle command add workflow job.
     */
    _handleCommandAddWorkflowJob(aReturn)
    {
        var workflowJob = this._createWorkflowJob(aReturn.job, this._workflow);
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKSPACE_ADD_ITEM_WORKFLOWJOB, {model: workflowJob});
    }

    /**
     * Handle event edit workflow job.
     */
    _handleEventEditWorkflowJob(aReturn)
    {
        this._showWorkflowJobControlView();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - workflow object controls
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Show workflow control view.
     */
    _showWorkflowControlView()
    {
        // Tell the layout view what to render.
        // TODO - don't want to do this, but for some reason my views get destroyed when
        // the containing region is destroyed!
        this.controlWorkflowView.isDestroyed = false;
        this.layoutView.showView(this.controlWorkflowView);
    }

    /**
     * Show job control view.
     */
    _showJobControlView()
    {
        // Tell the layout view what to render.
        // TODO - don't want to do this, but for some reason my views get destroyed when
        // the containing region is destroyed!
        this.controlJobView.isDestroyed = false;
        this.layoutView.showView(this.controlJobView);
    }

    /**
     * Show workflow job control view.
     */
    _showWorkflowJobControlView()
    {
        // Tell the layout view what to render.
        // TODO - don't want to do this, but for some reason my views get destroyed when
        // the containing region is destroyed!
        this.controlWorkflowJobView.isDestroyed = false;
        this.layoutView.showView(this.controlWorkflowJobView);
    }

    /**
     * Create workflow.
     */
    _createWorkflow(aProject)
    {
        var workflow =  new VISRC_Workflow({project: aProject.get("url"), name: "untitled"});
        workflow.save();
        return workflow;
    }

    /**
     * Create workflow job.
     */
    _createWorkflowJob(aJob, aWorkflow)
    {
        var workflowJob = new VISRC_WorkflowJob({job: aJob.get("url"), workflow: this._workflow.get("url")});
        workflowJob.save();
        return workflowJob;
    }
}

export default VISRC_WorkflowBuilderController;
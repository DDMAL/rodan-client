import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';
import VISRC_Connection from '../../../../Models/VISRC_Connection';
import VISRC_ViewControlWorkflowList from './Control/WorkflowList/VISRC_ViewControlWorkflowList';
import VISRC_LayoutViewControlWorkflow from './Control/Workflow/VISRC_LayoutViewControlWorkflow';
//import VISRC_LayoutViewControlWorkflowJob from './Control/Workflow/VISRC_LayoutViewControlWorkflowJob';
import VISRC_Workflow from '../../../../Models/VISRC_Workflow';

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
        this.addRegions({
            regionControl: "#region-main_workflowbuilder_control"
        });
        this.template = "#template-main_workflowbuilder";

        this._initializeViews();
        this._initializeRadio();
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
       // this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_SHOW_JOBCONTROLVIEW, () => this._handleCommandShowControlJobView());
      //  this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED, aReturn => this._handleEventEditWorkflowJob(aReturn));
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.controlWorkflowListView = new VISRC_ViewControlWorkflowList();
        this.controlWorkflowView = new VISRC_LayoutViewControlWorkflow();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - view controls
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO
     */
    _showView(aView)
    {
        // Tell the layout view what to render.
        // TODO - don't want to do this, but for some reason my views get destroyed when
        // the containing region is destroyed!
        aView.isDestroyed = false;
        this.regionControl.show(aView, {preventDestroy: true});
    }

    /**
     * Handle selection.
     */
    _handleEventBuilderSelected(aReturn)
    {
        // Inform that we need jobs loaded.
        this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_JOBS, {});

        // Send the layout view to the main region.
        this.rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this);

        // Get the workflow.
        if (aReturn.workflow != null)
        {
            this.controlWorkflowView = new VISRC_LayoutViewControlWorkflow({workflow: aReturn.workflow});
            this._showView(this.controlWorkflowView);
        }
        else
        {
            this._showView(this.controlWorkflowListView);
        }

        // Initialize the workspace.
        this._workspace.initialize("canvas-workspace");
    }
    
    /**
     * Handle command show workflow.
     */
    _handleCommandAddWorkflow()
    {
        var project = this.rodanChannel.request(VISRC_Events.REQUEST__PROJECT_ACTIVE);
        var workflow = this._createWorkflow(project);
        this.controlWorkflowView = new VISRC_LayoutViewControlWorkflow({workflow: workflow});
        this._showView(this.controlWorkflowView);
    }
    
    /**
     * Handle command show job control view.
     */
  /*  _handleCommandShowControlJobView()
    {
        this._showView(this.controlWorkflowView);
    }*/

    /**
     * Handle event edit workflow job.
     */
 /*   _handleEventEditWorkflowJob(aReturn)
    {
        // TODO - not reusing this view...should find more efficient way
        this.controlWorkflowJobView = new VISRC_LayoutViewControlWorkflowJob(aReturn);
        this._showView(this.controlWorkflowJobView);
    }*/

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - workflow object controls
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Create workflow.
     */
    _createWorkflow(aProject)
    {
        var workflow =  new VISRC_Workflow({project: aProject.get("url"), name: "untitled"});
        workflow.save();
        return workflow;
    }
}

export default VISRC_WorkflowBuilderController;
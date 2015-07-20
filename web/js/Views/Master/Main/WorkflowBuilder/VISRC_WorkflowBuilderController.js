import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';
import VISRC_LayoutViewWorkflowBuilder from './VISRC_LayoutViewWorkflowBuilder';
import VISRC_LayoutViewWorkflowEditor from './Control/Workflow/VISRC_LayoutViewWorkflowEditor';
import VISRC_Workflow from '../../../../Models/VISRC_Workflow';
import VISRC_WorkflowBuilder from '../../../../Plugins/WorkflowBuilder/VISRC_WorkflowBuilder';
import VISRC_BaseController from '../../../../Controllers/VISRC_BaseController';

/**
 * Controller for the Workflow Builder.
 */
class VISRC_WorkflowBuilderController extends VISRC_BaseController
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
        this._workspace = new VISRC_WorkflowBuilder();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.on(VISRC_Events.EVENT__WORKFLOWBUILDER_SELECTED, aReturn => this._handleEventBuilderSelected(aReturn));
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.controlWorkflowView = new VISRC_LayoutViewWorkflowEditor();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - view controls
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle selection.
     */
    _handleEventBuilderSelected(aReturn)
    {
        this._layoutView = new VISRC_LayoutViewWorkflowBuilder();
        this._rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this._layoutView );

        // Get the workflow.
        if (aReturn.workflow != null)
        {
            this.controlWorkflowView = new VISRC_LayoutViewWorkflowEditor({workflow: aReturn.workflow});
        }
        else
        {
            var project = this._rodanChannel.request(VISRC_Events.REQUEST__PROJECT_ACTIVE);
            var workflow = this._createWorkflow(project);
            this.controlWorkflowView = new VISRC_LayoutViewWorkflowEditor({workflow: workflow});
        }
        this._layoutView.showView(this.controlWorkflowView);

        // Initialize the workspace.
        this._workspace.initialize("canvas-workspace");
    }
    
    /**
     * Handle button zoom in.
     */
    _handleButtonZoomIn()
    {
        this._rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_GUI_ZOOM_IN);
    }
    
    /**
     * Handle button zoom out.
     */
    _handleButtonZoomOut()
    {
        this._rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_GUI_ZOOM_OUT);
    }
    
    /**
     * Handle button zoom reset.
     */
    _handleButtonZoomReset()
    {
        this._rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_GUI_ZOOM_RESET);
    }

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
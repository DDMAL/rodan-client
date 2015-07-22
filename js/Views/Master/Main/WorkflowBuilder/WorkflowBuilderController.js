import Events from '../../../../Shared/Events';
import LayoutViewWorkflowBuilder from './LayoutViewWorkflowBuilder';
import LayoutViewWorkflowEditor from './Control/LayoutViewWorkflowEditor';
import Workflow from '../../../../Models/Workflow';
import WorkflowBuilder from '../../../../Plugins/WorkflowBuilder/WorkflowBuilder';
import BaseController from '../../../../Controllers/BaseController';

/**
 * Controller for the Workflow Builder.
 */
class WorkflowBuilderController extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize()
    {
        this._initializeViews();
        this._workspace = new WorkflowBuilder();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_SELECTED, aReturn => this._handleEventBuilderSelected(aReturn));
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.controlWorkflowView = new LayoutViewWorkflowEditor();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - view controls
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle selection.
     */
    _handleEventBuilderSelected(aReturn)
    {
        this._layoutView = new LayoutViewWorkflowBuilder();
        this._rodanChannel.command(Events.COMMAND__LAYOUTVIEW_SHOW, this._layoutView );

        // Get the workflow.
        if (aReturn.workflow !== null)
        {
            this.controlWorkflowView = new LayoutViewWorkflowEditor({workflow: aReturn.workflow});
        }
        else
        {
            var project = this._rodanChannel.request(Events.REQUEST__PROJECT_ACTIVE);
            var workflow = this._createWorkflow(project);
            this.controlWorkflowView = new LayoutViewWorkflowEditor({workflow: workflow});
        }

        // Create any required GUI objects.
        this._layoutView.showView(this.controlWorkflowView);

        // Initialize the workspace.
        this._workspace.initialize('canvas-workspace');
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - workflow object controls
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Create workflow.
     */
    _createWorkflow(aProject)
    {
        var workflow =  new Workflow({project: aProject.get('url'), name: 'untitled'});
        workflow.save();
        return workflow;
    }
}

export default WorkflowBuilderController;
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

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - view controls
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle selection.
     */
    _handleEventBuilderSelected(aReturn)
    {
        this._layoutView = new LayoutViewWorkflowBuilder();
        this._rodanChannel.request(Events.COMMAND__LAYOUTVIEW_SHOW, this._layoutView );

        // Initialize the workspace and build the workflow.
        this._workspace.initialize('canvas-workspace');

        // Clear existing view.
        if (this.hasOwnProperty('controlWorkflowView'))
        {
            this.controlWorkflowView.destroy();
        }
        
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
        this._layoutView.showView(this.controlWorkflowView);
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
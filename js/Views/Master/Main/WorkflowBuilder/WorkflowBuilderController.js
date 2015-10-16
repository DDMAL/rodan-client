import Events from '../../../../Shared/Events';
import LayoutViewWorkflowBuilder from './LayoutViewWorkflowBuilder';
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
        this._rodanChannel.reply(Events.COMMAND__WORKFLOW_SAVE, options => this._handleCommandSaveWorkflow(options), this);
        this._rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_SELECTED, options => this._handleEventBuilderSelected(options), this);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - view controls
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle selection.
     */
    _handleEventBuilderSelected(options)
    {
        this._layoutView = new LayoutViewWorkflowBuilder({workflow: options.workflow});
        this._rodanChannel.request(Events.COMMAND__LAYOUTVIEW_SHOW, this._layoutView);
        this._workspace.initialize('canvas-workspace');
    }

    /**
     * Handle save workflow.
     */
    _handleCommandSaveWorkflow(options)
    {
        options.workflow.save({name: options.workflow.get('name'), description: options.workflow.get('description')}, {patch: true});
    }
}

export default WorkflowBuilderController;
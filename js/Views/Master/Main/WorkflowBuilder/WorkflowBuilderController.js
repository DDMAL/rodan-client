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
        this._rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_SELECTED, options => this._handleEventBuilderSelected(options));
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
}

export default WorkflowBuilderController;
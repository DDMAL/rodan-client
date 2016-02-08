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
        this._rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_SELECTED, options => this._handleEventBuilderSelected(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOW_SAVE, options => this._handleRequestSaveWorkflow(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_CREATE_WORKFLOWRUN, options => this._handleRequestCreateWorkflowRun(options), this);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle selection.
     */
    _handleEventBuilderSelected(options)
    {
        this._layoutView = new LayoutViewWorkflowBuilder({workflow: options.workflow});
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this._layoutView);
        this._workspace.initialize('canvas-workspace');
    }

    /**
     * Handle save workflow.
     */
    _handleRequestSaveWorkflow(options)
    {
        options.workflow.save({name: options.workflow.get('name'), description: options.workflow.get('description')}, {patch: true});
    }

    /**
     * Handle request create WorkflowRun.
     */
    _handleRequestCreateWorkflowRun(options)
    {
        var workflow = options.model;
        workflow.fetch({'success': (workflow) => this._handleWorkflowLoadSuccess(workflow)});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - REST response handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle workflow load success.
     */
    _handleWorkflowLoadSuccess(workflow)
    {
        if (workflow.get('workflow_input_ports').length > 0)
        {
            console.log('tell user they need to satisfy the ports!')
        }
        else
        {
            console.log('run workflow!!!!');
        }
    }
}

export default WorkflowBuilderController;
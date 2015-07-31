import Events from '../../../Shared/Events';
import ViewNavigationNode from './ViewNavigationNode';

/**
 * This class represents a navigation menu node for a WorkflowRun list.
 */
class ViewNavigationNodeWorkflowRuns extends ViewNavigationNode
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize()
    {
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.on(Events.EVENT__WORKFLOWRUNS_SELECTED, aEvent => this._handleEventWorkflowRunsSelected(aEvent));
    }

    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        this._rodanChannel.command(Events.COMMAND__PROJECT_SET_ACTIVE, {project: this.model.get('project')});
        this._rodanChannel.trigger(Events.EVENT__WORKFLOWRUNS_SELECTED, {project: this.model.get('project')});
    }

    /**
     * Handle highlighting.
     */
    _handleEventWorkflowRunsSelected(aEvent)
    {
        if (aEvent.project === this.model.get('project'))
        {
            this._rodanChannel.trigger(Events.EVENT_NAVIGATION_NODE_SELECTED, {node: this});
        }
    }
}

export default ViewNavigationNodeWorkflowRuns;
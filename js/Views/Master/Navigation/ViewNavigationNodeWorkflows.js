import Events from '../../../Shared/Events';
import ViewNavigationNode from './ViewNavigationNode';

/**
 * This class represents a navigation menu node for a Workflow list.
 */
class ViewNavigationNodeWorkflows extends ViewNavigationNode
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.on(Events.EVENT__WORKFLOWS_SELECTED, aEvent => this._handleEventWorkflowsSelected(aEvent));
    }

    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        this._rodanChannel.request(Events.COMMAND__PROJECT_SET_ACTIVE, {project: this.model.get('project')});
        this._rodanChannel.trigger(Events.EVENT__WORKFLOWS_SELECTED, {project: this.model.get('project')});
    }

    /**
     * Handle highlighting.
     */
    _handleEventWorkflowsSelected(aEvent)
    {
        if (aEvent.project === this.model.get('project'))
        {
            this._rodanChannel.trigger(Events.EVENT_NAVIGATION_NODE_SELECTED, {node: this});
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewNavigationNodeWorkflows.prototype.template = '#template-navigation_workflows';

export default ViewNavigationNodeWorkflows;
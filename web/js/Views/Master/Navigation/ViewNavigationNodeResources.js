import Events from '../../../Shared/Events';
import ViewNavigationNode from './ViewNavigationNode';

/**
 * This class represents a navigation menu node for a project.
 */
class ViewNavigationNodeResources extends ViewNavigationNode
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
        this._rodanChannel.on(Events.EVENT__RESOURCES_SELECTED, aEvent => this._handleEventResourcesSelected(aEvent));
    }

    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        this._rodanChannel.command(Events.COMMAND__SET_ACTIVE_PROJECT, {project: this.model.get('project')});
        this._rodanChannel.trigger(Events.EVENT__RESOURCES_SELECTED, {project: this.model.get('project')});
    }

    /**
     * Handle highlighting.
     */
    _handleEventResourcesSelected(aEvent)
    {
        if (aEvent.project === this.model.get('project'))
        {
            this._rodanChannel.trigger(Events.EVENT_NAVIGATION_NODE_SELECTED, {node: this});
        }
    }
}

export default ViewNavigationNodeResources;
import Events from '../../../Shared/Events';
import ViewNavigationNode from './ViewNavigationNode';

/**
 * This class represents a navigation menu node for a project.
 */
class ViewNavigationNodeResources extends ViewNavigationNode
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this.rodanChannel.on(Events.EVENT__RESOURCE_SELECTED_COLLECTION, options => this._handleEventResourcesSelected(options));
    }

    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        this.rodanChannel.request(Events.REQUEST__PROJECT_SET_ACTIVE, {project: this.model.get('project')});
        this.rodanChannel.trigger(Events.EVENT__RESOURCE_SELECTED_COLLECTION, {project: this.model.get('project')});
    }

    /**
     * Handle highlighting.
     */
    _handleEventResourcesSelected(options)
    {
        if (options.project === this.model.get('project'))
        {
            this.rodanChannel.trigger(Events.EVENT__NAVIGATION_SELECTED_NODE, {node: this});
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewNavigationNodeResources.prototype.template = '#template-navigation_resources';

export default ViewNavigationNodeResources;
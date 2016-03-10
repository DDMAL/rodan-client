import Radio from 'backbone.radio';

import Events from '../../../Shared/Events';
import NAV_EVENTS from './Events';
import ViewNavigationNode from './ViewNavigationNode';

/**
 * This class represents a navigation menu node for a Workflow list.
 */
class ViewNavigationNodeWorkflows extends ViewNavigationNode
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
    {
        super.initialize(options);
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.on(Events.EVENT__WORKFLOW_SELECTED_COLLECTION, options => this._handleEventWorkflowsSelected(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        this.rodanChannel.request(Events.REQUEST__PROJECT_SET_ACTIVE, {project: this.model.get('project')});
        this.rodanChannel.trigger(Events.EVENT__WORKFLOW_SELECTED_COLLECTION, {project: this.model.get('project')});
    }

    /**
     * Handle highlighting.
     */
    _handleEventWorkflowsSelected(options)
    {
        if (options.project === this.model.get('project'))
        {
            this.navChannel.trigger(NAV_EVENTS.EVENT__NAVIGATION_SELECTED_NODE, {node: this});
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewNavigationNodeWorkflows.prototype.template = '#template-navigation_workflows';

export default ViewNavigationNodeWorkflows;
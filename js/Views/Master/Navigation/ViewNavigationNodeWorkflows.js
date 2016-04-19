import Events from '../../../Shared/Events';
import NAV_EVENTS from './Events';
import Radio from 'backbone.radio';
import ViewNavigationNode from './ViewNavigationNode';

/**
 * This class represents a navigation menu node for a Workflow list.
 */
export default class ViewNavigationNodeWorkflows extends ViewNavigationNode
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     *
     * @param {object} options Marionette.View options object
     */
    initialize(options)
    {
        super.initialize(options);
        Radio.channel('rodan').on(Events.EVENT__WORKFLOW_SELECTED_COLLECTION, options => this._handleEventWorkflowsSelected(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        Radio.channel('rodan').request(Events.REQUEST__PROJECT_SET_ACTIVE, {project: this.model.get('project')});
        Radio.channel('rodan').trigger(Events.EVENT__WORKFLOW_SELECTED_COLLECTION, {project: this.model.get('project')});
    }

    /**
     * Handle highlighting.
     */
    _handleEventWorkflowsSelected(options)
    {
        if (options.project === this.model.get('project'))
        {
            Radio.channel('rodan-navigation').trigger(NAV_EVENTS.EVENT__NAVIGATION_SELECTED_NODE, {node: this});
        }
    }
}
ViewNavigationNodeWorkflows.prototype.template = '#template-navigation_workflows';
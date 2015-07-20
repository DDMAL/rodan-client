import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';
import VISRC_ViewNavigationNodeResources from './VISRC_ViewNavigationNodeResources';
import VISRC_ViewNavigationNode from './VISRC_ViewNavigationNode';

/**
 * This class represents a navigation menu node for a WorkflowRun list.
 */
class VISRC_ViewNavigationNodeWorkflowRuns extends VISRC_ViewNavigationNode
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
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
        this._rodanChannel.on(VISRC_Events.EVENT__WORKFLOWRUNS_SELECTED, aEvent => this._handleEventWorkflowRunsSelected(aEvent));
    }

    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        this._rodanChannel.command(VISRC_Events.COMMAND__SET_ACTIVE_PROJECT, {project: this.model.get("project")});
        this._rodanChannel.trigger(VISRC_Events.EVENT__WORKFLOWRUNS_SELECTED, {project: this.model.get("project")});
    }

    /**
     * Handle highlighting.
     */
    _handleEventWorkflowRunsSelected(aEvent)
    {
        if (aEvent.project === this.model.get("project"))
        {
            this._rodanChannel.trigger(VISRC_Events.EVENT_NAVIGATION_NODE_SELECTED, {node: this});
        }
    }
}

export default VISRC_ViewNavigationNodeWorkflowRuns;
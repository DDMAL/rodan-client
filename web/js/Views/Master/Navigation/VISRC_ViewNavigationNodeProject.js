import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';
import VISRC_ViewNavigationNodeResources from './VISRC_ViewNavigationNodeResources';
import VISRC_ViewNavigationNodeWorkflowRuns from './VISRC_ViewNavigationNodeWorkflowRuns';
import VISRC_ViewNavigationNodeWorkflows from './VISRC_ViewNavigationNodeWorkflows';
import VISRC_ViewNavigationNode from './VISRC_ViewNavigationNode';

/**
 * This class represents a navigation menu node for a project.
 */
class VISRC_ViewNavigationNodeProject extends VISRC_ViewNavigationNode
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.collection = new Backbone.Collection();
        var resourcesNodeModel = new Backbone.Model({name: "Resources", project: this.model});
        var workflowBuilderNodeModel = new Backbone.Model({name: "Workflows", project: this.model});
        var workflowRunnerNodeModel = new Backbone.Model({name: "Workflow Runs", project: this.model});
        this.collection.add(resourcesNodeModel);
        this.collection.add(workflowBuilderNodeModel);
        this.collection.add(workflowRunnerNodeModel);
    }

    /**
     * Determine child view based on name.
     */
    getChildView(aModel)
    {
        switch (aModel.get("name"))
        {
            case "Resources":
            {
                return VISRC_ViewNavigationNodeResources;
            }

            case "Workflows":
            {
                return VISRC_ViewNavigationNodeWorkflows;
            }

            case "Workflow Runs":
            {
                return VISRC_ViewNavigationNodeWorkflowRuns;
            }

            default:
            {
                return VISRC_ViewNavigationNode;
            }
        }
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.on(VISRC_Events.EVENT__PROJECT_SELECTED, aEvent => this._handleEventProjectSelected(aEvent));
    }

    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        this._rodanChannel.trigger(VISRC_Events.EVENT__PROJECT_SELECTED, {project: this.model});
    }

    /**
     * Handle highlighting.
     */
    _handleEventProjectSelected(aEvent)
    {
        if (aEvent.project === this.model)
        {
            this._rodanChannel.trigger(VISRC_Events.EVENT_NAVIGATION_NODE_SELECTED, {node: this});
        }
    }
}

export default VISRC_ViewNavigationNodeProject;
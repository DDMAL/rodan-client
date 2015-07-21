import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../Shared/Events';
import ViewNavigationNodeResources from './ViewNavigationNodeResources';
import ViewNavigationNodeWorkflowRuns from './ViewNavigationNodeWorkflowRuns';
import ViewNavigationNodeWorkflows from './ViewNavigationNodeWorkflows';
import ViewNavigationNode from './ViewNavigationNode';

/**
 * This class represents a navigation menu node for a project.
 */
class ViewNavigationNodeProject extends ViewNavigationNode
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
                return ViewNavigationNodeResources;
            }

            case "Workflows":
            {
                return ViewNavigationNodeWorkflows;
            }

            case "Workflow Runs":
            {
                return ViewNavigationNodeWorkflowRuns;
            }

            default:
            {
                return ViewNavigationNode;
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
        this._rodanChannel.on(Events.EVENT__PROJECT_SELECTED, aEvent => this._handleEventProjectSelected(aEvent));
    }

    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        this._rodanChannel.trigger(Events.EVENT__PROJECT_SELECTED, {project: this.model});
    }

    /**
     * Handle highlighting.
     */
    _handleEventProjectSelected(aEvent)
    {
        if (aEvent.project === this.model)
        {
            this._rodanChannel.trigger(Events.EVENT_NAVIGATION_NODE_SELECTED, {node: this});
        }
    }
}

export default ViewNavigationNodeProject;
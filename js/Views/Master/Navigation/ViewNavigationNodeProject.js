import Backbone from 'backbone';

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
     * Initialize.
     */
    initialize(options)
    {
        super.initialize(options);
        this.collection = new Backbone.Collection();
        var resourcesNodeModel = new Backbone.Model({name: 'Resources', project: this.model});
        var workflowBuilderNodeModel = new Backbone.Model({name: 'Workflows', project: this.model});
        var workflowRunnerNodeModel = new Backbone.Model({name: 'Workflow Runs', project: this.model});
        this.collection.add(resourcesNodeModel);
        this.collection.add(workflowBuilderNodeModel);
        this.collection.add(workflowRunnerNodeModel);
    }

    /**
     * Determine child view based on name.
     */
    getChildView(model)
    {
        switch (model.get('name'))
        {
            case 'Resources':
            {
                return ViewNavigationNodeResources;
            }

            case 'Workflows':
            {
                return ViewNavigationNodeWorkflows;
            }

            case 'Workflow Runs':
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
        this.rodanChannel.on(Events.EVENT__PROJECT_SELECTED, event => this._handleEventProjectSelected(event));
    }

    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        this.rodanChannel.trigger(Events.EVENT__PROJECT_SELECTED, {project: this.model});
    }

    /**
     * Handle highlighting.
     */
    _handleEventProjectSelected(event)
    {
        if (event.project === this.model)
        {
            this.rodanChannel.trigger(Events.EVENT__NAVIGATION_NODE_SELECTED, {node: this});
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////

export default ViewNavigationNodeProject;
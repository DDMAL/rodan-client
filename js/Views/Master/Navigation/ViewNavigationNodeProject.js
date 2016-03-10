import Backbone from 'backbone';
import Radio from 'backbone.radio';

import Events from '../../../Shared/Events';
import NAV_EVENTS from './Events';
import ViewNavigationNodeRunJobs from './ViewNavigationNodeRunJobs';
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
        var workflowRunsNodeModel = new Backbone.Model({name: 'Workflow Runs', project: this.model});
        var runJobsNodeModel = new Backbone.Model({name: 'Run Jobs', project: this.model});
        this.collection.add(resourcesNodeModel);
        this.collection.add(workflowBuilderNodeModel);
        this.collection.add(workflowRunsNodeModel);
        this.collection.add(runJobsNodeModel);
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.on(Events.EVENT__PROJECT_SELECTED, event => this._handleEventProjectSelected(event));
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

            case 'Run Jobs':
            {
                return ViewNavigationNodeRunJobs;
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
            this.navChannel.trigger(NAV_EVENTS.EVENT__NAVIGATION_SELECTED_NODE, {node: this});
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////

export default ViewNavigationNodeProject;
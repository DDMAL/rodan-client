import BaseCollection from '../../../../Collections/BaseCollection';
import Events from '../../../../Shared/Events';
import LayoutViewWorkflowBuilder from './LayoutViewWorkflowBuilder';
import Workflow from '../../../../Models/Workflow';
import WorkflowBuilder from '../../../../Plugins/WorkflowBuilder/WorkflowBuilder';
import BaseController from '../../../../Controllers/BaseController';
import Resource from '../../../../Models/Resource';
import ViewResourceList from '../Resource/List/ViewResourceList';
import ViewResourceListItemModal from '../Resource/List/ViewResourceListItemModal';
import LayoutViewResourceAssignment from './ResourceAssignment/LayoutViewResourceAssignment';

/**
 * Controller for the Workflow Builder.
 */
class WorkflowBuilderController extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize()
    {
        this._workspace = new WorkflowBuilder();
        this._resourceAssignments = [];
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.on(Events.EVENT__WORKFLOWBUILDER_SELECTED, options => this._handleEventBuilderSelected(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_CREATE_WORKFLOWRUN, options => this._handleRequestCreateWorkflowRun(options), this);
        this._rodanChannel.reply(Events.REQUEST__WORKFLOWBUILDER_GET_RESOURCEASSIGNMENT_VIEW, options => this._handleRequestGetResourceAssignmentView(options), this);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle selection.
     */
    _handleEventBuilderSelected(options)
    {
        this._layoutView = new LayoutViewWorkflowBuilder({workflow: options.workflow});
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this._layoutView);
        this._workspace.initialize('canvas-workspace');
    }

    /**
     * Handle request create WorkflowRun.
     */
    _handleRequestCreateWorkflowRun(options)
    {
        var workflow = options.model;
        workflow.fetch({'success': (workflow) => this._handleWorkflowLoadSuccess(workflow)});
    }

    /**
     * Handle request get Resource assignment view.
     */
    _handleRequestGetResourceAssignmentView(options)
    {
        var assignedResourceCollection = new BaseCollection(this._resourceAssignments, {model: Resource});
        var assignedResourceView = new ViewResourceList({collection: assignedResourceCollection,
                                                         template: '#template-modal_resource_list',
                                                         childView: ViewResourceListItemModal});

        // Get flist of available Resources.
        var resourceListView = this._rodanChannel.request(Events.REQUEST__RESOURCES_GET_LIST_FOR_ASSIGNMENT, {url: options.url});

        // Return the layout view.
        return new LayoutViewResourceAssignment({viewavailableresources: resourceListView, viewassignedresources: assignedResourceView});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - REST response handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle workflow load success.
     */
    _handleWorkflowLoadSuccess(workflow)
    {
        if (workflow.get('workflow_input_ports').length > 0)
        {
            console.log('tell user they need to satisfy the ports!')
        }
        else
        {
            console.log('run workflow!!!!');
        }
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Given an InputPort URL, returns a list of Resources that have been associated with that InputPort.
     */
    _getAssociatedResources(inputPortURL)
    {
        return this._resourceAssignments[inputPotURL];
    }
}

export default WorkflowBuilderController;
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewWorkflowListItem from './ViewWorkflowListItem';

/**
 * This class represents a list view of workflows
 */
class ViewWorkflowList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this._initializeRadio();
        this._project = aParameters.project;
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_WORKFLOW);
        this.rodanChannel.request(Events.COMMAND__LOAD_WORKFLOWS, {query: {project: this._project.id}});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflowList.prototype.modelEvents = {
            'all': 'render'
        };
ViewWorkflowList.prototype.template = '#template-main_workflow_list';
ViewWorkflowList.prototype.childView = ViewWorkflowListItem;
ViewWorkflowList.prototype.childViewContainer = 'tbody';
ViewWorkflowList.prototype.behaviors = {Pagination: {'table': '#table-workflows'}};

export default ViewWorkflowList;
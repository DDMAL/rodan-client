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
        this.collection = this._rodanChannel.request(Events.REQUEST__COLLECTION_WORKFLOW);
        this._rodanChannel.request(Events.REQUEST__LOAD_WORKFLOWS, {query: {project: this._project.id}});
        this._rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__WORKFLOWS_SYNC, 
                                                                      options: {query: {project: this._project.id}}, 
                                                                      callback: null});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel('rodan');
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
ViewWorkflowList.prototype.behaviors = {Table: {'table': '#table-workflows'}};

export default ViewWorkflowList;
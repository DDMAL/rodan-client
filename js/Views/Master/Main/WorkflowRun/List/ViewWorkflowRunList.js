import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewWorkflowRunListItem from './ViewWorkflowRunListItem';

/**
 * View for WorkflowRun list.
 */
class ViewWorkflowRunList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(aOptions)
    {
        this._initializeRadio();
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_WORKFLOWRUN);
        this.rodanChannel.request(Events.REQUEST__LOAD_WORKFLOWRUNS, {query: {project: aOptions.project.id}});
        this.rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__WORKFLOWRUNS_SYNC, 
                                                                      options: {}, 
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
        this.rodanChannel = Radio.channel('rodan');
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflowRunList.prototype.modelEvents = {
    'all': 'render'
};
ViewWorkflowRunList.prototype.childViewContainer = 'tbody';
ViewWorkflowRunList.prototype.template = '#template-main_workflowrun_list';
ViewWorkflowRunList.prototype.childView = ViewWorkflowRunListItem;
ViewWorkflowRunList.prototype.behaviors = {Table: {'table': '#table-workflowruns'}};

export default ViewWorkflowRunList;
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

        this.modelEvents = {
            'all': 'render'
        };
        this.childViewContainer = 'tbody';
        this.template = '#template-main_workflowrun_list';
        this.childView = ViewWorkflowRunListItem;
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_WORKFLOWRUN);
        this.rodanChannel.command(Events.COMMAND__LOAD_WORKFLOWRUNS, {project: aOptions.project.id});
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

export default ViewWorkflowRunList;
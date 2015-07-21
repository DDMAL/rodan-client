import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewWorkflowRunListItem from './ViewWorkflowRunListItem';

/**
 * This class represents the view (and controller) for the workflowrun list.
 */
class ViewWorkflowRunList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize()
    {
        this._initializeRadio();

        this.modelEvents = {
            'all': 'render'
        };
        this.childViewContainer = 'tbody';
        this.template = '#template-main_workflowrun_list';
        this.childView = ViewWorkflowRunListItem;
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_WORKFLOWRUN);
        var project = this.rodanChannel.request(Events.REQUEST__PROJECT_ACTIVE);
        this.collection.reset();
        this.rodanChannel.command(Events.COMMAND__LOAD_WORKFLOWRUNS, {project: project.id});
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
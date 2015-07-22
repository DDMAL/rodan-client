import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewRunJobListItem from './ViewRunJobListItem';

/**
 * This class represents the view for an individual WorkflowRun.
 */
class ViewWorkflowRun extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.modelEvents = {
            'all': 'render'
        };
        this._initializeRadio();
        this.model = aParameters.workflowRun;
        this.childView = ViewRunJobListItem;
        this.childViewContainer = 'tbody';
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_RUNJOB);
        this.collection.reset();
        this.rodanChannel.command(Events.COMMAND__LOAD_RUNJOBS, {workflow_run: this.model.id});
    }

    /**
     * TODO
     */
    getTemplate()
    {
        return '#template-main_workflowrun_individual';
    }

    /**
     * Returns the associated collection item to the template.
     */
    templateHelpers() 
    {
        return { items: this.collection.toJSON() };
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

export default ViewWorkflowRun;
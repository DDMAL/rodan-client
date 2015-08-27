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
     * Initialize.
     */
    initialize(aParameters)
    {
        this._initializeRadio();
        this.model = aParameters.workflowRun;
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_RUNJOB);
        this.rodanChannel.request(Events.COMMAND__LOAD_RUNJOBS, {query: {workflow_run: this.model.id}});
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

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflowRun.prototype.modelEvents = {
    'all': 'render'
};
ViewWorkflowRun.prototype.childView = ViewRunJobListItem;
ViewWorkflowRun.prototype.childViewContainer = 'tbody';
ViewWorkflowRun.prototype.template = '#template-main_workflowrun_individual';

export default ViewWorkflowRun;
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../Shared/Events';

/**
 * This class represents the view for an individual WorkflowRun.
 */
class ViewWorkflowRunData extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
    {
        this._initializeRadio();
        this.model = options.workflowRun;
    //    this.collection = this.rodanChannel.request(Events.REQUEST__RUNJOB_COLLECTION);
      //  this.rodanChannel.request(Events.REQUEST__LOAD_RUNJOBS, {query: {workflow_run: this.model.id}});
    }

    /**
     * Returns the associated collection item to the template.
     */
/*    templateHelpers() 
    {
        return { items: this.collection.toJSON() };
    }*/

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
ViewWorkflowRunData.prototype.modelEvents = {
    'all': 'render'
};
ViewWorkflowRunData.prototype.childView = ViewRunJobListItem;
ViewWorkflowRunData.prototype.childViewContainer = 'tbody';
ViewWorkflowRunData.prototype.template = '#template-main_workflowrun_individual';

export default ViewWorkflowRunData;
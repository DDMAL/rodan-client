import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import WorkflowRun from '../../../../../Models/WorkflowRun';
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
            "all": "render"
        };
        this._initializeRadio();
        this.childView = ViewRunJobListItem;
        this.childViewContainer = 'tbody';
    }

    /**
     * TODO
     */
    getTemplate()
    {
        return "#template-main_workflowrun_individual";
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
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.on(Events.EVENT__WORKFLOWRUN_SELECTED, aReturn => this._handleEventItemSelected(aReturn));
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aReturn)
    {
        this.model = aReturn.workflowRun;
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_RUNJOB);
        this.rodanChannel.command(Events.COMMAND__LOAD_RUNJOBS, {workflow_run: this.model.id});
    }
}

export default ViewWorkflowRun;
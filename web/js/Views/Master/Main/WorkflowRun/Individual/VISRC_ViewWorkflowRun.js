import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_WorkflowRun from '../../../../../Models/VISRC_WorkflowRun';
import VISRC_ViewRunJobListItem from './VISRC_ViewRunJobListItem';

/**
 * This class represents the view for an individual WorkflowRun.
 */
class VISRC_ViewWorkflowRun extends Marionette.CompositeView
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
        this.childView = VISRC_ViewRunJobListItem;
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
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWRUN_SELECTED, aReturn => this._handleEventItemSelected(aReturn));
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aReturn)
    {
        this.model = aReturn.workflowRun;
        this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_RUNJOB);
        this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_RUNJOBS, {workflow_run: this.model.id});
    }
}

export default VISRC_ViewWorkflowRun;
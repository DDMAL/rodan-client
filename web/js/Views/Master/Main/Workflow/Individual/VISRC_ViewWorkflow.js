import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_Workflow from '../../../../../Models/VISRC_Workflow';
import VISRC_ViewWorkflowRunListItem from './VISRC_ViewWorkflowRunListItem';

/**
 * This class represents the view for a single Workflow summary.
 */
class VISRC_ViewWorkflow extends Marionette.CompositeView
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
        this.template = "#template-main_workflow_individual";
        this.childView = VISRC_ViewWorkflowRunListItem;
        this.childViewContainer = 'tbody';
    }

    /**
     * Returns the associated WorkflowRun collection to the template.
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
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOW_SELECTED, aModel => this._handleEventItemSelected(aModel));
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aWorkflow)
    {
        this.model = aWorkflow;
        this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_WORKFLOWRUN);
        this.rodanChannel.command(VISRC_Events.COMMAND__GET_WORKFLOWRUNS, {workflow: this.model.id});
    }
}

export default VISRC_ViewWorkflow;
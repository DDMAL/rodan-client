import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_ViewWorkflowRunListItem from './VISRC_ViewWorkflowRunListItem';

/**
 * This class represents the view for a single Score summary.
 */
class VISRC_ViewScore extends Marionette.CompositeView
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
        this.template = "#template-main_score_individual";
     //   this.childView = VISRC_ViewWorkflowRunListItem;
      //  this.childViewContainer = 'tbody';
    }

    /**
     * Returns the associated WorkflowRun collection to the template.
     */
  /*  templateHelpers() 
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
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.on(VISRC_Events.EVENT__SCORE_SELECTED, aReturn => this._handleEventItemSelected(aReturn));
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aReturn)
    {
        this.model = aReturn.resource;
     //   this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_WORKFLOWRUN);
      //  this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_WORKFLOWRUNS, {resource: this.model.id});
    }
}

export default VISRC_ViewScore;
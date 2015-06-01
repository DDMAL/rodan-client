import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_Project from '../../../../../Models/VISRC_WorkflowRun';

/**
 * This class represents the view for an individual WorkflowRun.
 */
class VISRC_ViewWorkflowRun extends Marionette.ItemView
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
    }

    /**
     * TODO
     */
    getTemplate()
    {
        return "#template-main_workflowrun_individual";
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
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWRUN_SELECTED, aModelInstance => this._handleEventItemSelected(aModelInstance));
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aModelInstance)
    {
        this.model = aModelInstance;
    }
}

export default VISRC_ViewWorkflowRun;
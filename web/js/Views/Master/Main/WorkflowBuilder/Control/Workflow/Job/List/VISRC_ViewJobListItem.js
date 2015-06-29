import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../../../Shared/VISRC_Events'

/**
 * This class represents the view (and controller) for the job item.
 */
class VISRC_ViewJobListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    constructor(aParameters)
    {
        this._initializeRadio();

        this.modelEvents = {
            "all": "render"
        };
        this.template = "#template-main_workflowbuilder_control_job_list_item";
        this.tagName = 'tr';
        this.events = {
            'click': '_handleClick'
        };

        super(aParameters);
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
    }

    /**
     * Handles click.
     */
    _handleClick()
    {
        // TODO - for some reason, the individual job view isn't working, so I'm adding jobs directly from the list
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_WORKFLOWJOB, {job: this.model});
        //this.rodanChannel.trigger(VISRC_Events.EVENT__JOB_SELECTED, {job: this.model});
    }
}

export default VISRC_ViewJobListItem;
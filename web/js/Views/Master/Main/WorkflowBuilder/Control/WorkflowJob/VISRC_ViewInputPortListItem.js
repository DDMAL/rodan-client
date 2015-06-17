import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../Shared/VISRC_Events'

/**
 * This class represents the view of an individual input port list item.
 */
class VISRC_ViewInputPortListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Basic constructor. ("initialize" doesn't seem to work.)
     */
    constructor(aParameters)
    {
        this._initializeRadio();

        this.modelEvents = {
            "all": "render"
        };
        this.template = "#template-main_workflowbuilder_control_inputport_list_item";
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
        console.log("click");
        //this.rodanChannel.trigger(VISRC_Events.EVENT__WORKFLOW_SELECTED, {workflow: this.model});
    }
}

export default VISRC_ViewInputPortListItem;
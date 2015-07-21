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
        this.template = "#template-main_workflowrun_newworkflowrun_inputport_list_item";
        this.tagName = 'tr';
        this.events = {
            'click': '_handleClick'
        };

        super(aParameters);
    }

    /**
     * Unbind from events.
     */
    onDestroy()
    {
        this.rodanChannel.off(null, null, this);
        this.rodanChannel.stopComplying(null, null, this);
        this.rodanChannel.stopReplying(null, null, this);
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
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWRUNCREATOR_INPUTPORT_SELECTED, aPass => this._handleEventInputPortSelected(aPass), this);
    }

    /**
     * Handles click.
     */
    _handleClick()
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__WORKFLOWRUNCREATOR_INPUTPORT_SELECTED, {inputport: this.model});
    }

    /**
     * Handles input port selection.
     * We catch this so we know if OTHER input ports have been highlighted, so we can turn our own highlighting off (or perhaps on).
     */
    _handleEventInputPortSelected(aPass)
    {
        this._setHighlight(aPass.inputport === this.model);
    }

    /**
     * Sets highlighting.
     */
    _setHighlight(aHighlight)
    {
        if (aHighlight)
        {
            // TODO magic number
            this.$el.css('background-color', '#ffff00');
        }
        else
        {
            this.$el.css('background-color', '');
        }
    }
}

export default VISRC_ViewInputPortListItem;
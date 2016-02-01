import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * This class represents the view of an individual input port list item.
 */
class ViewInputPortListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Basic constructor. ('initialize' doesn't seem to work.)
     */
    initialize()
    {
        this._initializeRadio();
    }

    /**
     * Unbind from events.
     */
    onDestroy()
    {
        this.rodanChannel.off(null, null, this);
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
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.on(Events.EVENT__WORKFLOWRUNCREATOR_INPUTPORT_SELECTED, aPass => this._handleEventInputPortSelected(aPass), this);
    }

    /**
     * Handles click.
     */
    _handleClick()
    {
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWRUNCREATOR_INPUTPORT_SELECTED, {inputport: this.model});
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

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewInputPortListItem.prototype.modelEvents = {
    'all': 'render'
};
ViewInputPortListItem.prototype.template = '#template-main_workflowrun_newworkflowrun_inputport_list_item';
ViewInputPortListItem.prototype.tagName = 'tr';
ViewInputPortListItem.prototype.events = {
    'click': '_handleClick'
};

export default ViewInputPortListItem;
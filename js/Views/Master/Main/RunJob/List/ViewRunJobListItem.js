import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * This class represents the view (and controller) for a RunJob item.
 */
class ViewRunJobListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this._initializeRadio();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handles click.
     */
    _handleClick()
    {
        this._rodanChannel.trigger(Events.EVENT__RUNJOB_SELECTED, {runjob: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewRunJobListItem.prototype.modelEvents = {
    'change': 'render'
};
ViewRunJobListItem.prototype.template = '#template-main_runjob_list_item';
ViewRunJobListItem.prototype.tagName = 'tr';
ViewRunJobListItem.prototype.events = {
    'click': '_handleClick'
};

export default ViewRunJobListItem;
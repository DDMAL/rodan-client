import _ from 'underscore';
import Radio from 'backbone.radio';
import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';

/**
 * This class represents the view (and controller) for a RunJob item.
 */
class ViewRunJobListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Set a property before render.
     * TODO - this is a shitty hack to make sure the client shows what runjobs are manual and available
     */
    onBeforeRender()
    {
        this.model.set('available', this.model.available());
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles click.
     */
    _handleClick()
    {
        this.rodanChannel.trigger(Events.EVENT__RUNJOB_SELECTED, {runjob: this.model});
    }
    /**
     * Handle double-click.
     */
    _handleDoubleClick()
    {
        this.rodanChannel.request(Events.REQUEST__RUNJOB_ACQUIRE, {runjob: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewRunJobListItem.prototype.template = '#template-main_runjob_list_item';
ViewRunJobListItem.prototype.tagName = 'tr';
ViewRunJobListItem.prototype.events = {
    'click': '_handleClick',
    'dblclick': '_handleDoubleClick'
};

export default ViewRunJobListItem;
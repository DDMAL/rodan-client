import Radio from 'backbone.radio';
import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';

/**
 * This class represents the view (and controller) for a RunJob item.
 */
class ViewRunJobListItem extends BaseViewListItem
{
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
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewRunJobListItem.prototype.template = '#template-main_runjob_list_item';
ViewRunJobListItem.prototype.tagName = 'tr';
ViewRunJobListItem.prototype.events = {
    'click': '_handleClick'
};

export default ViewRunJobListItem;
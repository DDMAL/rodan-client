import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';

/**
 * This class represents the view (and controller) for a resource item.
 */
class ViewResourceListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles click.
     */
    _handleClick()
    {
        this.rodanChannel.trigger(Events.EVENT__RESOURCE_SELECTED, {resource: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewResourceListItem.prototype.template = '#template-main_resource_list_item';
ViewResourceListItem.prototype.tagName = 'tr';
ViewResourceListItem.prototype.events = {
    'click': '_handleClick'
};

export default ViewResourceListItem;
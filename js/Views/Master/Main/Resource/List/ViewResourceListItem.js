import BaseViewListItem from '../../BaseViewListItem';
import RODAN_EVENTS from '../../../../../Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';

/**
 * Item view for Resource list.
 */
export default class ViewResourceListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles click.
     */
    _handleClick()
    {
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__RESOURCE_SELECTED, {resource: this.model});
    }
}
ViewResourceListItem.prototype.template = '#template-main_resource_list_item';
ViewResourceListItem.prototype.tagName = 'tr';
ViewResourceListItem.prototype.events = {
    'click': '_handleClick'
};
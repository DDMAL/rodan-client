import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';

/**
 * Item view for Resource Collection.
 */
export default class ViewResourceCollectionItem extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles click.
     */
    _handleClick(event)
    {
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__RESOURCE_SELECTED, {resource: this.model, shiftKey: event.shiftKey});
    }

    /**
     * Handles double click.
     */
    _handleDblClick()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__RESOURCE_DOWNLOAD, {resource: this.model});
    }
}
ViewResourceCollectionItem.prototype.template = '#template-main_resource_collection_item';
ViewResourceCollectionItem.prototype.tagName = 'tr';
ViewResourceCollectionItem.prototype.events = {
    'click': '_handleClick',
    'dblclick': '_handleDblClick'
};

import BaseViewListItem from '../../BaseViewListItem';

/**
 * ResourceType view.
 */
export default class ViewResourceTypeListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * After render, set the value of the 'option.value'.
     */
    onRender()
    {
        super.onRender();
        this.$el.attr('value', this.model.get('url'));
        if (this.model.has('selected'))
        {
            this.$el.attr('selected', 'selected');
        }
    }
}
ViewResourceTypeListItem.prototype.template = '#template-main_resource_individual_resourcetype_list_item';
ViewResourceTypeListItem.prototype.tagName = 'option';
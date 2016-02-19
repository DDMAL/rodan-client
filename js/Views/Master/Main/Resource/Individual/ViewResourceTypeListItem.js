import BaseViewListItem from '../../BaseViewListItem';

/**
 * ResourceType view.
 */
class ViewResourceTypeListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Set the value of the 'option.value'.
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

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewResourceTypeListItem.prototype.template = '#template-main_resource_individual_resourcetype_list_item';
ViewResourceTypeListItem.prototype.tagName = 'option';

export default ViewResourceTypeListItem;
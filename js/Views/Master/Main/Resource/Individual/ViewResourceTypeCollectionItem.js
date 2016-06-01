import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';

/**
 * ResourceType view.
 */
export default class ViewResourceTypeCollectionItem extends BaseViewCollectionItem
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
ViewResourceTypeCollectionItem.prototype.template = '#template-main_resource_individual_resourcetype_list_item';
ViewResourceTypeCollectionItem.prototype.tagName = 'option';
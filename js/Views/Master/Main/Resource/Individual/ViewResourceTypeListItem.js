import Marionette from 'backbone.marionette';

/**
 * ResourceType view.
 */
class ViewResourceTypeListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Set the value of the 'option.value'.
     */
    onRender()
    {
        this.$el.attr('value', this.model.get('url'));
        if (this.model.has('selected'))
        {
            this.$el.attr('selected', 'selected');
        }
        var description = this.model.get('description');
        description = description === '' ? 'no description available' : description;
        this.$el.attr('title', description);
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewResourceTypeListItem.prototype.modelEvents = {
    'change': 'render'
};
ViewResourceTypeListItem.prototype.template = '#template-main_resource_individual_resourcetype_list_item';
ViewResourceTypeListItem.prototype.tagName = 'option';

export default ViewResourceTypeListItem;
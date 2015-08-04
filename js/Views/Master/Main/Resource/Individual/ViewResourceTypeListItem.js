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
     * Constructor.
     */
    constructor(aOptions)
    {
        this.modelEvents = {
            'all': 'render'
        };
        this.template = '#template-main_resource_individual_resourcetype_list_item';
        this.tagName = 'option';
        super(aOptions);
    }

    /**
     * Set the value of the 'option.value'.
     */
    onRender()
    {
        this.$el.attr('value', this.model.get('url'));
    }
}

export default ViewResourceTypeListItem;
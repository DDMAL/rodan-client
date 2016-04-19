import Marionette from 'backbone.marionette';

/**
 * Base List Item view.
 */
export default class BaseViewListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Set description after render.
     */
    onRender()
    {
        var description = 'no description available';
        if (this.model.has('description') && this.model.get('description') !== '')
        {
            description = this.model.get('description');
        }
        this.$el.attr('title', description);
    }
}
BaseViewListItem.prototype.modelEvents = {
    'change': 'render'
}
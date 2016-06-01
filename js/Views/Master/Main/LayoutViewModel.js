import Marionette from 'backbone.marionette';

/**
 * This is a layout to help render a Collection and a single item.
 * We're using a LayoutView as opposed to a CompositeView because the single model
 * that would be associated with the CompositveView is not initially known, so it can't
 * rerender.
 */
export default class LayoutViewModel extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     */
    initialize()
    {
        this.addRegions({
            regionCollection: '#region-main_layoutview_model_collection',
            regionItem: '#region-main_layoutview_model_item'
        });
    }

    /**
     * Show a Collection view.
     *
     * @param {Marionette.View} view Collection view to show
     */
    showCollection(view)
    {
        this.regionCollection.show(view);
    }

    /**
     * Show an item view.
     *
     * @param {Marionette.View} view item view to show
     */
    showItem(view)
    {
        this.regionItem.show(view);
    }

    /**
     * Clears item view.
     */
    clearItemView()
    {
        this.regionItem.empty();
    }
}
LayoutViewModel.prototype.template = '#template-main_layoutview_model';
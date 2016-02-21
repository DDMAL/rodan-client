import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * This is a layout to help render a Collection and a single item.
 * We're using a LayoutView as opposed to a CompositeView because the single model
 * that would be associated with the CompositveView is not initially known, so it can't
 * rerender.
 */
class LayoutViewModel extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize()
    {
        this.addRegions({
            regionList: '#region-main_layoutview_model_list',
            regionItem: '#region-main_layoutview_model_item'
        });
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Show a list view.
     */
    showList(view)
    {
        this.regionList.show(view);
    }

    /**
     * Show an item view.
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

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewModel.prototype.template = '#template-main_layoutview_model';

export default LayoutViewModel;
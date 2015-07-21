import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * This is a layout to help render a Collection and a single item.
 * We're using a LayoutView as opposed to a CompositeView because the single model
 * that would be associated with the CompositveView is not initially known, so it can't
 * rerender.
 */
class LayoutViewResource extends Marionette.LayoutView
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
            regionList: '#region-main_resource_list',
            regionItem: '#region-main_resource_item'
        });
        this.template = '#template-main_resource';
        this._initializeRadio();
    }

    /**
     * TODO docs
     */
    showList(aView)
    {
        this.regionList.show(aView);
    }

    /**
     * TODO docs
     */
    showItem(aView)
    {
        this.regionItem.show(aView);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }
}

export default LayoutViewResource;
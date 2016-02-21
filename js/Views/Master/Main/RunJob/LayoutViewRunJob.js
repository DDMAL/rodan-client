import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../Shared/Events';

/**
 * This is a layout to help render a Collection and a single item.
 * We're using a LayoutView as opposed to a CompositeView because the single model
 * that would be associated with the CompositveView is not initially known, so it can't
 * rerend.
 */
class LayoutViewRunJob extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize(options)
    {
        this._initializeRadio();
        this.addRegions({
            regionList: '#region-main_runjob_list',
            regionItem: '#region-main_runjob_item'
        });
    }

    /**
     * Show view in RunJob list region.
     */
    showList(view)
    {
        this.regionList.show(view);
    }

    /**
     * Show view in RunJob item region.
     */
    showItem(view)
    {
        this.regionItem.show(view);
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

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewRunJob.prototype.template = '#template-main_runjob';

export default LayoutViewRunJob;
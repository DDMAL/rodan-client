import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../Shared/Events';

/**
 * This is a layout to help render a Collection and a single item.
 * We're using a LayoutView as opposed to a CompositeView because the single model
 * that would be associated with the CompositveView is not initially known, so it can't
 * rerender.
 */
class LayoutViewWorkflow extends Marionette.LayoutView
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
            regionList: '#region-main_workflow_list',
            regionItem: '#region-main_workflow_item'
        });
        this._initializeRadio();
    }

    /**
     * TODO docs
     */
    showList(view)
    {
        this.regionList.show(view);
    }

    /**
     * TODO docs
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
LayoutViewWorkflow.prototype.template = '#template-main_workflow';

export default LayoutViewWorkflow;
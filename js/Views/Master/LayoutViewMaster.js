import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import LayoutViewMain from './Main/LayoutViewMain';
import LayoutViewNavigation from './Navigation/LayoutViewNavigation';

/**
 * Layout view for master work area.
 */
class LayoutViewMaster extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize
     */
    initialize()
    {
        this.addRegions({
            regionMain: '#region-main',
            regionNavigation: '#region-navigation'
        });
        this._initializeRadio();
        this._initializeViews();

    }

    /**
     * Handle rendering.
     */
    onRender()
    {
        this.regionMain.show(this.layoutViewMain);
        this.regionNavigation.show(this.layoutViewNavigation);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize all the views so they can respond to events.
     */
    _initializeViews()
    {
        this.layoutViewNavigation = new LayoutViewNavigation();
        this.layoutViewMain = new LayoutViewMain();
    }

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
LayoutViewMaster.prototype.template = '#template-master';

export default LayoutViewMaster;
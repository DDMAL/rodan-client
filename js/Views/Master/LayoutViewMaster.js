import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import LayoutViewMain from './Main/LayoutViewMain';
import LayoutViewNavigation from './Navigation/LayoutViewNavigation';
import LayoutViewStatus from './Status/LayoutViewStatus';

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
        //this.el = '#app';
        this.addRegions({
            regionMain: '#region-main',
            regionNavigation: '#region-navigation',
            regionStatus: '#region-status'
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
        this.regionStatus.show(this.layoutViewStatus);
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
        this.layoutViewStatus = new LayoutViewStatus();
    }

    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel('rodan');
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewMaster.prototype.template = '#template-master';

export default LayoutViewMaster;
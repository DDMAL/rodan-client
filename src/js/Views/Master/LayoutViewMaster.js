import LayoutViewMain from './Main/LayoutViewMain';
import LayoutViewNavigation from './Navigation/LayoutViewNavigation';
import LayoutViewStatus from './Status/LayoutViewStatus';
import Marionette from 'backbone.marionette';

/**
 * Layout view for master work area.
 */
export default class LayoutViewMaster extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the view.
     */
    initialize()
    {
        this.addRegions({
            regionMain: '#region-main',
            regionNavigation: '#region-navigation',
            regionStatus: '#region-status'
        });
        this._initializeViews();

    }

    /**
     * Shows the main and navigation views.
     */
    onRender()
    {
        this.regionMain.show(this._layoutViewMain);
        this.regionNavigation.show(this._layoutViewNavigation);
        this.regionStatus.show(this._layoutViewStatus);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize all the views so they can respond to events.
     */
    _initializeViews()
    {
        this._layoutViewNavigation = new LayoutViewNavigation();
        this._layoutViewMain = new LayoutViewMain();
        this._layoutViewStatus = new LayoutViewStatus();
    }
}
LayoutViewMaster.prototype.template = '#template-master';
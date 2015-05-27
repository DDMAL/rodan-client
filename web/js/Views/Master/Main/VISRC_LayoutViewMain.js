import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import VISRC_ViewProjectController from './Project/VISRC_ViewProjectController'

/**
 * Layout view for main work area. This is responsible for loading views within the main region.
 */
class VISRC_LayoutViewMain extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aOptions)
    {
        this.el = "#app";
        this.template = "#template-empty";
        this.addRegions({
            regionMain: "#region-main"
        });
        this._initializeViews();
    }

    onRender()
    {
        this.regionMain.show(this.viewProjectController);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.viewProjectController = new VISRC_ViewProjectController();
    }
}

export default VISRC_LayoutViewMain;
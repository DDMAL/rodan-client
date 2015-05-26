import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import VISRC_ViewProjectList from './Project/VISRC_ViewProjectList'
import VISRC_ViewProjectSummary from './Project/VISRC_ViewProjectSummary'

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

    /**
     * Render the appropriate view.
     */
    onRender()
    {
        // TODO - view logic! which view should be loaded?
        this.regionMain.show(this.viewProjectList);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.viewProjectList = new VISRC_ViewProjectList();
        this.viewProjectSummary = new VISRC_ViewProjectSummary();
    }
}

export default VISRC_LayoutViewMain;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import MainTestView from './MainTestView'

/**
 * Layout view for main work area. This is responsible for loading views within the main region.
 */
class VISRC_LayoutViewMain extends Marionette.LayoutView
{
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
        this.testView = new MainTestView();
    }

    /**
     * TODO docs
     */
    onRender()
    {
        this.regionMain.show(this.testView);
    }
}

export default VISRC_LayoutViewMain;
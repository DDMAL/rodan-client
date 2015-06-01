import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'
import VISRC_ViewProjectList from './List/VISRC_ViewProjectList'
import VISRC_ViewProject from './Individual/VISRC_ViewProject'

/**
 * 'Controller' for all Project views.
 */
class VISRC_ViewProjectController extends Marionette.LayoutView
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
        this.addRegions({
            region: "#region-main"
        });
        this._initializeViews();
        this._initializeRadio();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.on(VISRC_Events.EVENT__PROJECT_SELECTED, () => this._handleEventItemSelected());
        this.rodanChannel.comply(VISRC_Events.COMMAND__SHOW_PROJECTS, () => this._handleEventListSelected());
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.viewList = new VISRC_ViewProjectList();
        this.viewItem = new VISRC_ViewProject();
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected()
    {
        this.region.show(this.viewItem);
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        this.region.show(this.viewList);
    }
}

export default VISRC_ViewProjectController;
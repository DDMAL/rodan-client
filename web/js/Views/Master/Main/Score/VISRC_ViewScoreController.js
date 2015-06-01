import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'
//import VISRC_ViewScore from './VISRC_ViewScore'
import VISRC_ViewScoreList from './List/VISRC_ViewScoreList'

/**
 * Controller for Score views.
 */
class VISRC_ViewScoreController extends Marionette.LayoutView
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
        this.rodanChannel.comply(VISRC_Events.COMMAND__SHOW_SCORES, () => this._handleEventListSelected());
        this.rodanChannel.on(VISRC_Events.EVENT__SCORES_SELECTED, () => this._handleEventListSelected());
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.viewList = new VISRC_ViewScoreList();
       // this.viewItem = new VISRC_ViewScore();
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

export default VISRC_ViewScoreController;
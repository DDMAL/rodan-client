import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events'
import VISRC_ViewProjectController from './Project/VISRC_ViewProjectController'
import VISRC_ViewScoreList from './Score/VISRC_ViewScoreList'

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
        this._initializeRadio();
    }

    /**
     * Show the appropriate view.
     */
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
        this.viewScoreList = new VISRC_ViewScoreList();
    }

    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.on(VISRC_Events.EVENT__SCORES_SELECTED, aProject => this._handleEventScoresSelected(aProject));
    }

    /**
     * Handle scores selection.
     */
    _handleEventScoresSelected(aProject)
    {
        this.regionMain.show(this.viewScoreList);
    }
}

export default VISRC_LayoutViewMain;
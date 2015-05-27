import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'
//import VISRC_ViewAnalysis from './Builder/VISRC_ViewAnalysis'
//import VISRC_ViewAnalysisList from './List/VISRC_ViewAnalysisList'

/**
 * Controller for all Analysis-based views.
 */
class VISRC_ViewAnalysisController extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize(aOptions)
    {
        this.addRegions({
            regionMainAnalysis: "#region-main_analysis"
        });
        this._initializeViews();
        this._initializeRadio();
    }

    /**
     * Return the appropriate template based on state.
     */
    getTemplate()
    {
        return "#template-main_analysis";
    }

    /**
     * Show the appropriate view based on state.
     */
    onDomRefresh()
    {
        this.regionMainAnalysis.show(this.viewAnalysisList);
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
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
       // this.viewAnalysis = new VISRC_ViewAnalysis();
       // this.viewAnalysisList = new VISRC_ViewAnalysisList();
    }

    /**
     * Handle analysis selection.
     */
    _handleEventProjectSelected()
    {
      //  this.regionMainAnalysis.show(this.viewAnalysis);
    }
}

export default VISRC_ViewAnalysisController;
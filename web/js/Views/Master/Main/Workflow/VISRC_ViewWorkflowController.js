import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'
//import VISRC_ViewAnalysis from './Builder/VISRC_ViewAnalysis'
import VISRC_ViewWorkflowList from './List/VISRC_ViewWorkflowList'

/**
 * Controller for all Workflow-based views.
 */
class VISRC_ViewWorkflowController extends Marionette.LayoutView
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
            regionMainWorkflow: "#region-main_workflow"
        });
        this._initializeViews();
        this._initializeRadio();
    }

    /**
     * Return the appropriate template based on state.
     */
    getTemplate()
    {
        return "#template-main_workflow";
    }

    /**
     * Show the appropriate view based on state.
     */
    onDomRefresh()
    {
        this.regionMainWorkflow.show(this.viewWorkflowList);
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
        this.viewWorkflowList = new VISRC_ViewWorkflowList();
    }

    /**
     * Handle analysis selection.
     */
    _handleEventProjectSelected()
    {
      //  this.regionMainAnalysis.show(this.viewAnalysis);
    }
}

export default VISRC_ViewWorkflowController;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'
import VISRC_ViewWorkflowBuilder from './Builder/VISRC_ViewWorkflowBuilder'
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
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOW_SELECTED, () => this._handleEventItemSelected());
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.viewWorkflow = new VISRC_ViewWorkflowBuilder();
        this.viewWorkflowList = new VISRC_ViewWorkflowList();
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected()
    {
        this.regionMainWorkflow.show(this.viewWorkflow);
    }
}

export default VISRC_ViewWorkflowController;
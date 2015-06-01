import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'
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
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOW_SELECTED, () => this._handleEventItemSelected());
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWS_SELECTED, () => this._handleEventListSelected());
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.viewList = new VISRC_ViewWorkflowList();
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

export default VISRC_ViewWorkflowController;
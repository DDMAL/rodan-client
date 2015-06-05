import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'
import VISRC_ViewWorkflowRun from './Individual/VISRC_ViewWorkflowRun'
import VISRC_ViewWorkflowRunList from './List/VISRC_ViewWorkflowRunList'

/**
 * 'Controller' for WorkflowRun views.
 */
class VISRC_ViewWorkflowRunController extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aOptions)
    {
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
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWRUN_SELECTED, () => this._handleEventItemSelected());
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.viewList = new VISRC_ViewWorkflowRunList();
        this.viewItem = new VISRC_ViewWorkflowRun();
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected()
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this.viewItem);
    }
}

export default VISRC_ViewWorkflowRunController;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';
import VISRC_ViewWorkflowRun from './Individual/VISRC_ViewWorkflowRun';
import VISRC_ViewWorkflowRunList from './List/VISRC_ViewWorkflowRunList';
import VISRC_BaseController from '../../../../Controllers/VISRC_BaseController';

/**
 * Controller for WorkflowRun views.
 */
class VISRC_WorkflowRunController extends VISRC_BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Basic constructor.
     */
    constructor(aOptions)
    {
        super(aOptions);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.on(VISRC_Events.EVENT__WORKFLOWRUNS_SELECTED, () => this._handleEventListSelected());
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this._viewList = new VISRC_ViewWorkflowRunList();
        this._viewItem = new VISRC_ViewWorkflowRun();
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected()
    {
        this._rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this._viewItem);
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        this._rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this._viewList);
    }
}

export default VISRC_WorkflowRunController;
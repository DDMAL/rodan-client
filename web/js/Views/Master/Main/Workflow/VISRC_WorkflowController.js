import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';
import VISRC_LayoutViewWorkflow from './VISRC_LayoutViewWorkflow';
import VISRC_ViewWorkflow from './Individual/VISRC_ViewWorkflow';
import VISRC_ViewWorkflowList from './List/VISRC_ViewWorkflowList';
import VISRC_BaseController from '../../../../Controllers/VISRC_BaseController';

/**
 * Controller for all Workflow views.
 */
class VISRC_WorkflowController extends VISRC_BaseController
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
        this._rodanChannel.on(VISRC_Events.EVENT__WORKFLOWS_SELECTED, () => this._handleEventListSelected());
        this._rodanChannel.on(VISRC_Events.EVENT__WORKFLOW_SELECTED, () => this._handleEventItemSelected());
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        this._layoutView = new VISRC_LayoutViewWorkflow();
        this._rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this._layoutView);
        var project = this._rodanChannel.request(VISRC_Events.REQUEST__PROJECT_ACTIVE);
        this._viewList = new VISRC_ViewWorkflowList({project: project});
        this._layoutView.showList(this._viewList);
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected()
    {
        this._viewItem = new VISRC_ViewWorkflow();
        this._layoutView.showItem(this._viewItem);
    }
}

export default VISRC_WorkflowController;
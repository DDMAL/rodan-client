import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';
import VISRC_LayoutViewWorkflow from './VISRC_LayoutViewWorkflow';
import VISRC_ViewWorkflow from './Individual/VISRC_ViewWorkflow';
import VISRC_ViewWorkflowList from './List/VISRC_ViewWorkflowList';

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
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWS_SELECTED, () => this._handleEventListSelected());
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOW_SELECTED, () => this._handleEventItemSelected());
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.layoutView = new VISRC_LayoutViewWorkflow();
        this.viewList = new VISRC_ViewWorkflowList();
        this.viewItem = new VISRC_ViewWorkflow();
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        // Send the layout view to the main region.
        this.rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this.layoutView);

        // Tell the layout view what to render.
        // TODO - don't want to do this, but for some reason my views get destroyed when
        // the containing region is destroyed!
        this.viewList.isDestroyed = false;
        this.layoutView.showList(this.viewList);
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected()
    {
        // Send the layout view to the main region.
        this.rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this.layoutView);

        // Tell the layout view what to render.
        // TODO - don't want to do this, but for some reason my views get destroyed when
        // the containing region is destroyed!
        this.viewItem.isDestroyed = false;
        this.layoutView.showItem(this.viewItem);
    }
}

export default VISRC_ViewWorkflowController;
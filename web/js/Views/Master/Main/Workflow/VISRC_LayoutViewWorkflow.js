import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';
import VISRC_ViewWorkflow from './Individual/VISRC_ViewWorkflow';
import VISRC_ViewWorkflowList from './List/VISRC_ViewWorkflowList';

/**
 * This is a layout to help render a Collection and a single item.
 * We're using a LayoutView as opposed to a CompositeView because the single model
 * that would be associated with the CompositveView is not initially known, so it can't
 * rerender.
 */
class VISRC_LayoutViewWorkflow extends Marionette.LayoutView
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
            regionWorkflowList: "#region-main_workflow_list",
            regionWorkflowItem: "#region-main_workflow_item"
        });
        this.template = "#template-main_workflow";
        this._initializeViews();
        this._initializeRadio();
    }

    /**
     * Show the views when WE are shown. Usually, we'd wait for a message,
     * but we have to explicitly wait for our parent to render us.
     */
    onShow()
    {
        this.regionWorkflowList.show(this.viewList);
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
        this.viewList = new VISRC_ViewWorkflowList();
        this.viewItem = new VISRC_ViewWorkflow();
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected()
    {
        this.regionWorkflowItem.show(this.viewItem);
      //  this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_WORKFLOWRUN, {project: this.model.id});
       // this.rodanChannel.command(VISRC_Events.COMMAND__GET_WORKFLOWRUNS, {project: this.model.id});
    }
}

export default VISRC_LayoutViewWorkflow;
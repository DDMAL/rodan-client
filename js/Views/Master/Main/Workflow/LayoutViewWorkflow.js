import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../Shared/Events';

/**
 * This is a layout to help render a Collection and a single item.
 * We're using a LayoutView as opposed to a CompositeView because the single model
 * that would be associated with the CompositveView is not initially known, so it can't
 * rerender.
 */
class LayoutViewWorkflow extends Marionette.LayoutView
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
            regionList: "#region-main_workflow_list",
            regionItem: "#region-main_workflow_item"
        });
        this.template = "#template-main_workflow";
        this.ui = {
            newWorkflowButton: '#button-new_workflow'
        }
        this.events = {
            'click @ui.newWorkflowButton': '_handleButtonNewWorkflow'
        };
        this._initializeRadio();
    }

    /**
     * TODO docs
     */
    showList(aView)
    {
        this.regionList.show(aView);
    }

    /**
     * TODO docs
     */
    showItem(aView)
    {
        this.regionItem.show(aView);
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
     * Handle button new workflow.
     */
    _handleButtonNewWorkflow()
    {
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_SELECTED, {workflow: null});
    }
}

export default LayoutViewWorkflow;
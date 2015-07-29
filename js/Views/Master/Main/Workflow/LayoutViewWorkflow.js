import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../Shared/Events';

/**
 * LayoutView for Workflow.
 */
class LayoutViewWorkflow extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize()
    {
        this.addRegions({
            regionList: '#region-main_workflow_list',
            regionItem: '#region-main_workflow_item'
        });
        this.template = '#template-main_workflow';
        this.ui = {
            newWorkflowButton: '#button-new_workflow'
        };
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
        this.rodanChannel = Radio.channel('rodan');
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
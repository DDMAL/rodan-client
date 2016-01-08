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
    initialize()
    {
        this.addRegions({
            regionList: '#region-main_workflow_list',
            regionItem: '#region-main_workflow_item'
        });
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
        var project = this.rodanChannel.request(Events.REQUEST__PROJECT_ACTIVE);
        var workflow = this.rodanChannel.request(Events.REQUEST__WORKFLOW_ADD, {project: project});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewWorkflow.prototype.template = '#template-main_workflow';
LayoutViewWorkflow.prototype.ui = {
    newWorkflowButton: '#button-new_workflow'
};
LayoutViewWorkflow.prototype.events = {
    'click @ui.newWorkflowButton': '_handleButtonNewWorkflow'
};

export default LayoutViewWorkflow;
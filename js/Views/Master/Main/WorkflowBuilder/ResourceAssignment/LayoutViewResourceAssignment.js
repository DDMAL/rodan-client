import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * ResourceAssignment view.
 */
export default class LayoutViewResourceAssignment extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object
     */
    initialize(options)
    {
        this.addRegions({
            regionAvailableResources: '#region-main_workflowbuilder_resourceassignment_availableresources',
            regionassignedResources: '#region-main_workflowbuilder_resourceassignment_assignedresources'
        });
        this._viewAvailableResources = options.viewavailableresources;
        this._viewAssignedResources = options.viewassignedresources;
    }

    /**
     * Unbind from events.
     */
    onDestroy()
    {
        Radio.channel('rodan').off(null, null, this);
        Radio.channel('rodan').stopReplying(null, null, this);
    }

    /**
     * Before the view shows we make sure the subviews are shown.
     */
    onBeforeShow()
    {
        this.regionAvailableResources.show(this._viewAvailableResources);
        this.regionassignedResources.show(this._viewAssignedResources);
    }
}
LayoutViewResourceAssignment.prototype.template = '#template-main_workflowbuilder_resourceassignment';
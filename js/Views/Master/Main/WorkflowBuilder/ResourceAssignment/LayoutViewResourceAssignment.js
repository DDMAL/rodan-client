import _ from 'underscore';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * ResourceAssignment view.
 */
class LayoutViewResourceAssignment extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
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
        this._rodanChannel.off(null, null, this);
        this._rodanChannel.stopReplying(null, null, this);
    }

    onBeforeShow()
    {
        this.regionAvailableResources.show(this._viewAvailableResources);
        this.regionassignedResources.show(this._viewAssignedResources);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel('rodan');
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewResourceAssignment.prototype.template = '#template-main_workflowbuilder_resourceassignment';
LayoutViewResourceAssignment.prototype.ui = {
};
LayoutViewResourceAssignment.prototype.events = {
};

export default LayoutViewResourceAssignment;
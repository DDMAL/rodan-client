import $ from 'jquery';
import _ from 'underscore';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * ResourceAssignment view.
 */
export default class LayoutViewResourceAssignment extends Marionette.View
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.viewavailableresources' and 'options.viewassignedresources' must be provided (each being Marionette.Views); also required is 'options.workflow' (Workflow) and 'options.inputport' (InputPort)
     */
    initialize(options)
    {
        this.addRegions({
            regionAvailableResources: '#region-main_resourceassignment_availableresources',
            regionAssignedResources: '#region-main_resourceassignment_assignedresources'
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
    onRender()
    {
        this.showChildView('regionAvailableResources', this._viewAvailableResources);
        this.showChildView('regionAssignedResources', this._viewAssignedResources);
    }

    /**
     * Handle button add all.
     */
    _handleButtonAddAll()
    {
    }

    /**
     * Handle button add selected.
     */
    _handleButtonAddSelected()
    {
        $(this.getRegion('regionAvailableResources').el).find('tr.active').trigger('dblclick');
    }

    /**
     * Handle button remove all.
     */
    _handleButtonRemoveAll()
    {
    }

    /**
     * Handle button remove selected.
     */
    _handleButtonRemoveSelected()
    {
        $(this.getRegion('regionAssignedResources').el).find('tr.active').trigger('dblclick');
    }
}
LayoutViewResourceAssignment.prototype.template = _.template($('#template-main_resourceassignment').text());
LayoutViewResourceAssignment.prototype.ui = {
    buttonAddAll: '#button-add_all',
    buttonAddSelected: '#button-add_selected',
    buttonRemoveAll: '#button-remove_all',
    buttonRemoveSelected: '#button-remove_selected'
};
LayoutViewResourceAssignment.prototype.events = {
    'click @ui.buttonAddAll': '_handleButtonAddAll',
    'click @ui.buttonAddSelected': '_handleButtonAddSelected',
    'click @ui.buttonRemoveAll': '_handleButtonRemoveAll',
    'click @ui.buttonRemoveSelected': '_handleButtonRemoveSelected'
};

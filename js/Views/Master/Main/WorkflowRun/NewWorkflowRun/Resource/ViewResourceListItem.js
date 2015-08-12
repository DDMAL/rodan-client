import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../Shared/Events';

/**
 * This class represents the view (and controller) for a resource item.
 */
class ViewResourceListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize()
    {
        this._initializeRadio();
        this._inputPort = null;
    }

    /**
     * Unbind from events.
     */
    onDestroy()
    {
        this.rodanChannel.off(null, null, this);
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
        this.rodanChannel.on(Events.EVENT__WORKFLOWRUNCREATOR_INPUTPORT_SELECTED, aPass => this._handleEventInputPortSelected(aPass), this);
    }

    /**
     * Handle event input port selected.
     */
    _handleEventInputPortSelected(aPass)
    {
        this._inputPort = aPass.inputport;
        var selected = this.rodanChannel.request(Events.REQUEST__WORKFLOWRUNCREATOR_IS_RESOURCEASSIGNMENT, {inputport: this._inputPort, resource: this.model});
        this._setHighlight(selected);
    }

    /**
     * Handles click.
     */
    _handleClick()
    {
        var selected = this.rodanChannel.request(Events.REQUEST__WORKFLOWRUNCREATOR_IS_RESOURCEASSIGNMENT, {inputport: this._inputPort, resource: this.model});
        if (selected)
        {
            this.rodanChannel.request(Events.COMMAND__WORKFLOWRUNCREATOR_REMOVE_RESOURCEASSIGNMENT, {inputport: this._inputPort, resource: this.model});
        }
        else
        {
            this.rodanChannel.request(Events.COMMAND__WORKFLOWRUNCREATOR_ADD_RESOURCEASSIGNMENT, {inputport: this._inputPort, resource: this.model});
        }
        selected = this.rodanChannel.request(Events.REQUEST__WORKFLOWRUNCREATOR_IS_RESOURCEASSIGNMENT, {inputport: this._inputPort, resource: this.model});
        this._setHighlight(selected);
    }

    /**
     * Sets highlighting.
     */
    _setHighlight(aHighlight)
    {
        if (aHighlight)
        {
            // TODO magic number
            this.$el.css('background-color', '#ffff00');
        }
        else
        {
            this.$el.css('background-color', '');
        }
        this.render();
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewResourceListItem.prototype.modelEvents = {
    'all': 'render'
};
ViewResourceListItem.prototype.template = '#template-main_workflowrun_newworkflowrun_resource_list_item';
ViewResourceListItem.prototype.tagName = 'tr';
ViewResourceListItem.prototype.events = {
    'click': '_handleClick'
};

export default ViewResourceListItem;
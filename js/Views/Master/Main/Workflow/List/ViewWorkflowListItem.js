import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * This class represents the view of an individual workflow list item.
 */
class ViewWorkflowListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
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
        this._rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handles click.
     */
    _handleClick()
    {
        this._rodanChannel.trigger(Events.EVENT__WORKFLOW_SELECTED, {workflow: this.model});
    }

    /**
     * Handle double-click.
     */
    _handleDoubleClick()
    {
        this._rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_SELECTED, {workflow: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflowListItem.prototype.modelEvents = {
    'change': 'render'
};
ViewWorkflowListItem.prototype.template = '#template-main_workflow_list_item';
ViewWorkflowListItem.prototype.tagName = 'tr';
ViewWorkflowListItem.prototype.events = {
    'click': '_handleClick',
    'dblclick': '_handleDoubleClick'
};

export default ViewWorkflowListItem;
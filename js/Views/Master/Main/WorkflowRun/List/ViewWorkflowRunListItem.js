import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * This class represents the view (and controller) for the workflowrun item.
 */
class ViewWorkflowRunListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
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
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handles click.
     */
    _handleClick()
    {
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWRUN_SELECTED, {workflowrun: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflowRunListItem.prototype.modelEvents = {
    'change': 'render'
};
ViewWorkflowRunListItem.prototype.template = '#template-main_workflowrun_list_item';
ViewWorkflowRunListItem.prototype.tagName = 'tr';
ViewWorkflowRunListItem.prototype.events = {
    'click': '_handleClick'
};

export default ViewWorkflowRunListItem;
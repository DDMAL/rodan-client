import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * This class represents the view of a workflow run.
 */
class ViewWorkflowRunListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
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
ViewWorkflowRunListItem.prototype.template = '#template-main_workflow_individual_workflowrun_list_item';
ViewWorkflowRunListItem.prototype.tagName = 'tr';
ViewWorkflowRunListItem.prototype.events = {
    'click': '_handleClick'
};

export default ViewWorkflowRunListItem;
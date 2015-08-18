import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../../Shared/Events';

/**
 * View/controller for WorkflowJobGroup list item.
 */
class ViewWorkflowJobGroupListItem extends Marionette.ItemView
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
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handles click.
     */
    _handleClick()
    {
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWJOBGROUP_SELECTED, {workflowjobgroup: this.model});
    }

    /**
     * Handle add button.
     */
    _handleClickButtonAdd()
    {
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWJOBGROUP_SELECTED, {workflowjobgroup: this.model});
        this.rodanChannel.request(Events.COMMAND__WORKFLOWJOBGROUP_ADD, {workflowjobgroup: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflowJobGroupListItem.prototype.modelEvents = {
    'all': 'render'
};
ViewWorkflowJobGroupListItem.prototype.template = '#template-main_workflowbuilder_control_workflowjobgroup_list_item';
ViewWorkflowJobGroupListItem.prototype.tagName = 'tr';
ViewWorkflowJobGroupListItem.prototype.ui = {
    buttonAdd: '#button-main_workflowbuilder_control_workflowjobgroup_button_add'
};
ViewWorkflowJobGroupListItem.prototype.events = {
    'click @ui.buttonAdd': '_handleClickButtonAdd',
    'click': '_handleClick'
};

export default ViewWorkflowJobGroupListItem;
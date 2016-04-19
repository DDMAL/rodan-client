import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';
import Radio from 'backbone.radio';

/**
 * View for Workflow list.
 */
export default class ViewWorkflowListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles click.
     */
    _handleClick()
    {
        this.rodanChannel.trigger(Events.EVENT__WORKFLOW_SELECTED, {workflow: this.model});
    }

    /**
     * Handle double-click.
     */
    _handleDoubleClick()
    {
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_SELECTED, {workflow: this.model});
    }
}
ViewWorkflowListItem.prototype.template = '#template-main_workflow_list_item';
ViewWorkflowListItem.prototype.tagName = 'tr';
ViewWorkflowListItem.prototype.events = {
    'click': '_handleClick',
    'dblclick': '_handleDoubleClick'
};
import Radio from 'backbone.radio';
import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';

/**
 * This class represents the view of an individual workflow list item.
 */
class ViewWorkflowListItem extends BaseViewListItem
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

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflowListItem.prototype.template = '#template-main_workflow_list_item';
ViewWorkflowListItem.prototype.tagName = 'tr';
ViewWorkflowListItem.prototype.events = {
    'click': '_handleClick',
    'dblclick': '_handleDoubleClick'
};

export default ViewWorkflowListItem;
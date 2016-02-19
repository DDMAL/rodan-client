import Radio from 'backbone.radio';
import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';

/**
 * This class represents the view (and controller) for the workflowrun item.
 */
class ViewWorkflowRunListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
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
ViewWorkflowRunListItem.prototype.template = '#template-main_workflowrun_list_item';
ViewWorkflowRunListItem.prototype.tagName = 'tr';
ViewWorkflowRunListItem.prototype.events = {
    'click': '_handleClick'
};

export default ViewWorkflowRunListItem;
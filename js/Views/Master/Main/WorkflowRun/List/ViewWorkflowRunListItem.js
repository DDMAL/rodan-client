import BaseViewListItem from '../../BaseViewListItem';
import RODAN_EVENTS from '../../../../../Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';

/**
 * WorkflowRun list item view.
 */
export default class ViewWorkflowRunListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles click.
     */
    _handleClick()
    {
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__WORKFLOWRUN_SELECTED, {workflowrun: this.model});
    }
}
ViewWorkflowRunListItem.prototype.template = '#template-main_workflowrun_list_item';
ViewWorkflowRunListItem.prototype.tagName = 'tr';
ViewWorkflowRunListItem.prototype.events = {
    'click': '_handleClick'
};
import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';
import Radio from 'backbone.radio';

/**
 * RunJob list item view.
 */
export default class ViewRunJobListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Set availability  property before render.
     *
     * @todo this is a hack to make sure the client shows what runjobs are manual and available
     */
    onBeforeRender()
    {
        this.model.set('available', this.model.available());
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles click.
     */
    _handleClick()
    {
        Radio.channel('rodan').trigger(Events.EVENT__RUNJOB_SELECTED, {runjob: this.model});
    }
    /**
     * Handle double-click.
     */
    _handleDoubleClick()
    {
        Radio.channel('rodan').request(Events.REQUEST__RUNJOB_ACQUIRE, {runjob: this.model});
    }
}
ViewRunJobListItem.prototype.template = '#template-main_runjob_list_item';
ViewRunJobListItem.prototype.tagName = 'tr';
ViewRunJobListItem.prototype.events = {
    'click': '_handleClick',
    'dblclick': '_handleDoubleClick'
};
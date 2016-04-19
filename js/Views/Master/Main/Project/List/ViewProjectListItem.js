import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';
import Radio from 'backbone.radio';

/**
 * Project list item view.
 */
export default class ViewProjectListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles click.
     */
    _handleClick()
    {
        Radio.channel('rodan').trigger(Events.EVENT__PROJECT_SELECTED, {project: this.model});
    }
}
ViewProjectListItem.prototype.template = '#template-main_project_list_item';
ViewProjectListItem.prototype.tagName = 'tr';
ViewProjectListItem.prototype.events = {
    'click': '_handleClick'
}
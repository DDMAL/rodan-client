import Radio from 'backbone.radio';
import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';

/**
 * View for Project list item.
 */
class ViewProjectListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles click.
     */
    _handleClick()
    {
        this.rodanChannel.trigger(Events.EVENT__PROJECT_SELECTED, {project: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewProjectListItem.prototype.template = '#template-main_project_list_item';
ViewProjectListItem.prototype.tagName = 'tr';
ViewProjectListItem.prototype.events = {
    'click': '_handleClick'
};

export default ViewProjectListItem;
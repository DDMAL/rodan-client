import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';

/**
 * Project Collection item view.
 */
export default class ViewProjectCollectionItem extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles double click.
     */
    _handleDoubleClick()
    {
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__PROJECT_SELECTED, {project: this.model});
    }
}
ViewProjectCollectionItem.prototype.template = '#template-main_project_list_item';
ViewProjectCollectionItem.prototype.tagName = 'tr';
ViewProjectCollectionItem.prototype.events = {
    'dblclick': '_handleDoubleClick'
};
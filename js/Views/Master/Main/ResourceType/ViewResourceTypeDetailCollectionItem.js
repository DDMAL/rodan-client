import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import Utilities from 'js/Shared/Utilities';

/**
 * ResourceType detail view.
 */
export default class ViewResourceTypeDetailCollectionItem extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles button.
     */
    _handleButton()
    {
        target.textContent = this.model.get(this.model.get('url'));
    }
}
ViewResourceTypeDetailCollectionItem.prototype.template = '#template-resourcetype_detail_collection_item';
ViewResourceTypeDetailCollectionItem.prototype.tagName = 'tr';
ViewResourceTypeDetailCollectionItem.prototype.events = {
    'click @ui.button': '_handleButton'
};
ViewResourceTypeDetailCollectionItem.prototype.ui = {
    'button': '#button-copy_url'
};
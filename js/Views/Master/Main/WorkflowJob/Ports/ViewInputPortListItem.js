import Radio from 'backbone.radio';
import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';

/**
 * This class represents the view of an individual input port list item.
 */
class ViewInputPortListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle delete.
     */
    _handleButtonDelete()
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_DELETE_INPUTPORT, {model: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewInputPortListItem.prototype.ui = {
            buttonDelete: '#button-delete'
        };
ViewInputPortListItem.prototype.events = {
            'click @ui.buttonDelete': '_handleButtonDelete'
        };
ViewInputPortListItem.prototype.template = '#template-main_inputport_list_item';
ViewInputPortListItem.prototype.tagName = 'tr';

export default ViewInputPortListItem;
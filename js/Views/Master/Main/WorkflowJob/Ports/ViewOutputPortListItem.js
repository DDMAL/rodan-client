import Radio from 'backbone.radio';
import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';

/**
 * This class represents the view of an individual output port list item.
 */
class ViewOutputPortListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle delete.
     */
    _handleButtonDelete()
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_DELETE_OUTPUTPORT, {model: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewOutputPortListItem.prototype.ui = {
    buttonDelete: '#button-delete'
};
ViewOutputPortListItem.prototype.events = {
    'click @ui.buttonDelete': '_handleButtonDelete'
};
ViewOutputPortListItem.prototype.template = '#template-main_outputport_list_item';
ViewOutputPortListItem.prototype.tagName = 'tr';

export default ViewOutputPortListItem;
import Radio from 'backbone.radio';
import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';

/**
 * This class represents the view (and controller) for the job item.
 */
class ViewJobListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle add button.
     */
    _handleClickButtonAdd()
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOB, {job: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewJobListItem.prototype.template = '#template-main_job_list_item';
ViewJobListItem.prototype.tagName = 'tr';
ViewJobListItem.prototype.ui = {
    buttonAdd: '#button-main_job_button_add'
};
ViewJobListItem.prototype.events = {
    'click @ui.buttonAdd': '_handleClickButtonAdd'
};

export default ViewJobListItem;
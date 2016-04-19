import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';
import Radio from 'backbone.radio';

/**
 * View for Jot item in Job list.
 */
export default class ViewJobListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object
     */
    initialize(options)
    {
        this._workflow = options.workflow;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle add button.
     */
    _handleClickButtonAdd()
    {
        Radio.channel('rodan').request(Events.REQUEST__WORKFLOWBUILDER_ADD_WORKFLOWJOB, {job: this.model, workflow: this._workflow});
    }
}
ViewJobListItem.prototype.template = '#template-main_job_list_item';
ViewJobListItem.prototype.tagName = 'tr';
ViewJobListItem.prototype.ui = {
    buttonAdd: '#button-main_job_button_add'
};
ViewJobListItem.prototype.events = {
    'click @ui.buttonAdd': '_handleClickButtonAdd'
};
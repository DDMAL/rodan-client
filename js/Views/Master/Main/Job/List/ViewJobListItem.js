import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * This class represents the view (and controller) for the job item.
 */
class ViewJobListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this._initializeRadio();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handles click.
     */
    _handleClick()
    {
        this.rodanChannel.trigger(Events.EVENT__JOB_SELECTED, {job: this.model});
    }

    /**
     * Handle add button.
     */
    _handleClickButtonAdd()
    {
        this.rodanChannel.trigger(Events.EVENT__JOB_SELECTED, {job: this.model});
        this.rodanChannel.request(Events.REQUEST__WORKFLOWJOB_ADD, {job: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewJobListItem.prototype.modelEvents = {
    'all': 'render'
};
ViewJobListItem.prototype.template = '#template-main_job_list_item';
ViewJobListItem.prototype.tagName = 'tr';
ViewJobListItem.prototype.ui = {
    buttonAdd: '#button-main_job_button_add'
};
ViewJobListItem.prototype.events = {
    'click @ui.buttonAdd': '_handleClickButtonAdd',
    'click': '_handleClick'
};

export default ViewJobListItem;
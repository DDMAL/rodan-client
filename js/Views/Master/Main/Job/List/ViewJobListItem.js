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
ViewJobListItem.prototype.modelEvents = {
    'change': 'render'
};
ViewJobListItem.prototype.template = '#template-main_job_list_item';
ViewJobListItem.prototype.tagName = 'tr';
ViewJobListItem.prototype.ui = {
    buttonAdd: '#button-main_job_button_add'
};
ViewJobListItem.prototype.events = {
    'click @ui.buttonAdd': '_handleClickButtonAdd'
};

export default ViewJobListItem;
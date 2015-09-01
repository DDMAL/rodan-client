import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * This class represents the view of an individual output port list item.
 */
class ViewOutputPortListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Basic constructor. ('initialize' doesn't seem to work.)
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
     * Handle delete.
     */
    _handleButtonDelete()
    {
        this.rodanChannel.request(Events.COMMAND__WORKFLOWBUILDER_DELETE_OUTPUTPORT, {outputport: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewOutputPortListItem.prototype.modelEvents = {
    'all': 'render'
};
ViewOutputPortListItem.prototype.ui = {
    buttonDelete: '#button-delete'
};
ViewOutputPortListItem.prototype.events = {
    'click @ui.buttonDelete': '_handleButtonDelete'
};
ViewOutputPortListItem.prototype.template = '#template-main_outputport_list_item';
ViewOutputPortListItem.prototype.tagName = 'tr';

export default ViewOutputPortListItem;
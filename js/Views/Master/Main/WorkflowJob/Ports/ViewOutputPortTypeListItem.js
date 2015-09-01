import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * This class represents the view of an individual output port type list item.
 */
class ViewOutputPortTypeListItem extends Marionette.ItemView
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
     * Handles output port add.
     */
    _handleButtonNewOutputPort()
    {
        this.rodanChannel.request(Events.COMMAND__WORKFLOWBUILDER_ADD_OUTPUTPORT, {outputporttype: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewOutputPortTypeListItem.prototype.modelEvents = {
    'all': 'render'
};
ViewOutputPortTypeListItem.prototype.tagName = 'tr';
ViewOutputPortTypeListItem.prototype.template = '#template-main_outputporttype_list_item';
ViewOutputPortTypeListItem.prototype.events = {
    'click @ui.buttonNewOutputPort': '_handleButtonNewOutputPort'
};
ViewOutputPortTypeListItem.prototype.ui = {
    buttonNewOutputPort: '#button-new_outputport'
};

export default ViewOutputPortTypeListItem;
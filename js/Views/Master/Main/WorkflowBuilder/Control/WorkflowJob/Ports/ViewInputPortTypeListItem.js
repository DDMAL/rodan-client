import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../../Shared/Events';

/**
 * This class represents the view of an individual input port type list item.
 */
class ViewInputPortTypeListItem extends Marionette.ItemView
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
     * Handles input port add.
     */
    _handleButtonNewInputPort()
    {
        this.rodanChannel.request(Events.COMMAND__WORKFLOWBUILDER_ADD_INPUTPORT, {inputporttype: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewInputPortTypeListItem.prototype.modelEvents = {
    'all': 'render'
};
ViewInputPortTypeListItem.prototype.tagName = 'tr';
ViewInputPortTypeListItem.prototype.template = '#template-main_workflowbuilder_control_inputporttype_list_item';
ViewInputPortTypeListItem.prototype.events = {
    'click @ui.buttonNewInputPort': '_handleButtonNewInputPort'
};
ViewInputPortTypeListItem.prototype.ui = {
    buttonNewInputPort: '#button-new_inputport'
};

export default ViewInputPortTypeListItem;
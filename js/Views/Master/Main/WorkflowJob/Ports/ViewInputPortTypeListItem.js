import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * This class represents the view of an individual input port type list item.
 */
class ViewInputPortTypeListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
    {
        this._initializeRadio();
        this._workflowJob = options.workflowjob;
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
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT, {inputporttype: this.model, workflowjob: this._workflowJob});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewInputPortTypeListItem.prototype.modelEvents = {
    'all': 'render'
};
ViewInputPortTypeListItem.prototype.tagName = 'tr';
ViewInputPortTypeListItem.prototype.template = '#template-main_inputporttype_list_item';
ViewInputPortTypeListItem.prototype.events = {
    'click @ui.buttonNewInputPort': '_handleButtonNewInputPort'
};
ViewInputPortTypeListItem.prototype.ui = {
    buttonNewInputPort: '#button-new_inputport'
};

export default ViewInputPortTypeListItem;
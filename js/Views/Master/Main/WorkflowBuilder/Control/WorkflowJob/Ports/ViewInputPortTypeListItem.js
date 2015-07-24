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
    constructor(aParameters)
    {
        this._initializeRadio();

        this.modelEvents = {
            'all': 'render'
        };
        this.ui = {
            buttonNewInputPort: '#button-new_inputport'
        };
        this.events = {
            'click @ui.buttonNewInputPort': '_handleButtonNewInputPort'
        };
        this.template = '#template-main_workflowbuilder_control_inputporttype_list_item';
        this.tagName = 'tr';

        super(aParameters);
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
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_ADD_INPUTPORT, {inputporttype: this.model});
    }
}

export default ViewInputPortTypeListItem;
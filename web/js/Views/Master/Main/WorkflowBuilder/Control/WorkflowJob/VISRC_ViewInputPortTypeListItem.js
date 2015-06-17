import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../Shared/VISRC_Events'

/**
 * This class represents the view of an individual input port type list item.
 */
class VISRC_ViewInputPortTypeListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Basic constructor. ("initialize" doesn't seem to work.)
     */
    constructor(aParameters)
    {
        this._initializeRadio();

        this.modelEvents = {
            "all": "render"
        };
        this.ui = {
            buttonNewInputPort: '#button-new_inputport'
        }
        this.events = {
            'click @ui.buttonNewInputPort': '_handleButtonNewInputPort'
        };
        this.template = "#template-main_workflowbuilder_control_inputporttype_list_item";
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
        this.rodanChannel = Radio.channel("rodan");
    }

    /**
     * Handles input port add.
     */
    _handleButtonNewInputPort()
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_INPUTPORT, {inputporttype: this.model});
    }
}

export default VISRC_ViewInputPortTypeListItem;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../Shared/VISRC_Events'

/**
 * This class represents the view of an individual output port type list item.
 */
class VISRC_ViewOutputPortTypeListItem extends Marionette.ItemView
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
            buttonNewOutputPort: '#button-new_outputport'
        }
        this.events = {
            'click @ui.buttonNewOutputPort': '_handleButtonNewOutputPort'
        };
        this.template = "#template-main_workflowbuilder_control_outputporttype_list_item";
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
     * Handles output port add.
     */
    _handleButtonNewOutputPort()
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_OUTPUTPORT, {outputporttype: this.model});
    }
}

export default VISRC_ViewOutputPortTypeListItem;
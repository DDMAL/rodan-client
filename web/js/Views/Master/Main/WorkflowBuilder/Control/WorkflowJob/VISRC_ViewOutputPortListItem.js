import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../Shared/VISRC_Events'

/**
 * This class represents the view of an individual output port list item.
 */
class VISRC_ViewOutputPortListItem extends Marionette.ItemView
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
            buttonDelete: '#button-delete'
        }
        this.events = {
            'click @ui.buttonDelete': '_handleButtonDelete'
        };
        this.template = "#template-main_workflowbuilder_control_outputport_list_item";
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
     * Handle delete.
     */
    _handleButtonDelete()
    {
        
    }
}

export default VISRC_ViewOutputPortListItem;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../../../Shared/VISRC_Events'

/**
 * This class represents the view for a resource assignment
 */
class VISRC_ViewResourceAssignmentListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    constructor(aParameters)
    {
        this._initializeRadio();

        this.modelEvents = {
            "all": "render"
        };
        this.template = "#template-main_workflowbuilder_control_resourceassignment_list_item";
        this.tagName = 'tr';
        this.ui = {
            buttonAddResource: '#button-add_resource'
        }
        this.events = {
            'click': '_handleClick',
            'click @ui.buttonAddResource': '_handleButtonAddResource'
        };

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
     * Handles click.
     */
    _handleClick()
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_CONTROL_SHOW_RESOURCE, {resource: this.model});
    }

    /**
     * Handles add resource button.
     */
    _handleButtonAddResource()
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_GUI_ADD_ITEM_RESOURCE, {resource: this.model});
    }
}

export default VISRC_ViewResourceAssignmentListItem;
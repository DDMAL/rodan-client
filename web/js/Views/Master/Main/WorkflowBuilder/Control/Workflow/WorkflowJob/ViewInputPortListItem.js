import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../../Shared/Events';

/**
 * This class represents the view of an individual input port list item.
 */
class ViewInputPortListItem extends Marionette.ItemView
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
            buttonDelete: '#button-delete'
        };
        this.events = {
            'click @ui.buttonDelete': '_handleButtonDelete'
        };
        this.template = '#template-main_workflowbuilder_control_inputport_list_item';
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
     * Handle delete.
     */
    _handleButtonDelete()
    {
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_DELETE_INPUTPORT, {inputport: this.model});
    }
}

export default ViewInputPortListItem;
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * This class represents the view of an individual input port list item.
 */
class ViewInputPortListItem extends Marionette.ItemView
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
     * Handle delete.
     */
    _handleButtonDelete()
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_DELETE_INPUTPORT, {model: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewInputPortListItem.prototype.modelEvents = {
    'change': 'render'
};
ViewInputPortListItem.prototype.ui = {
            buttonDelete: '#button-delete'
        };
ViewInputPortListItem.prototype.events = {
            'click @ui.buttonDelete': '_handleButtonDelete'
        };
ViewInputPortListItem.prototype.template = '#template-main_inputport_list_item';
ViewInputPortListItem.prototype.tagName = 'tr';

export default ViewInputPortListItem;
import Radio from 'backbone.radio';
import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';

/**
 * This class represents the view of an individual input port type list item.
 */
class ViewInputPortTypeListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
    {
        this._workflowJob = options.workflowjob;
        this._workflow = options.workflow;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles input port add.
     */
    _handleButtonNewInputPort()
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ADD_INPUTPORT, {inputporttype: this.model, workflowjob: this._workflowJob, workflow: this._workflow});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewInputPortTypeListItem.prototype.tagName = 'tr';
ViewInputPortTypeListItem.prototype.template = '#template-main_inputporttype_list_item';
ViewInputPortTypeListItem.prototype.events = {
    'click @ui.buttonNewInputPort': '_handleButtonNewInputPort'
};
ViewInputPortTypeListItem.prototype.ui = {
    buttonNewInputPort: '#button-new_inputport'
};

export default ViewInputPortTypeListItem;
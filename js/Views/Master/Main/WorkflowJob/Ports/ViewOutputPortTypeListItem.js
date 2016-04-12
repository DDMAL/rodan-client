import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';

/**
 * This class represents the view of an individual output port type list item.
 */
class ViewOutputPortTypeListItem extends BaseViewListItem
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
     * Handles output port add.
     */
    _handleButtonNewOutputPort()
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT, {outputporttype: this.model, workflowjob: this._workflowJob, workflow: this._workflow});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewOutputPortTypeListItem.prototype.tagName = 'tr';
ViewOutputPortTypeListItem.prototype.template = '#template-main_outputporttype_list_item';
ViewOutputPortTypeListItem.prototype.events = {
    'click @ui.buttonNewOutputPort': '_handleButtonNewOutputPort'
};
ViewOutputPortTypeListItem.prototype.ui = {
    buttonNewOutputPort: '#button-new_outputport'
};

export default ViewOutputPortTypeListItem;
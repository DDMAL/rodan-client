import BaseViewListItem from '../../BaseViewListItem';
import Events from '../../../../../Shared/Events';
import Radio from 'backbone.radio';

/**
 * OutputPortType list item view.
 */
export default class ViewOutputPortTypeListItem extends BaseViewListItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object
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
        Radio.channel('rodan').request(Events.REQUEST__WORKFLOWBUILDER_ADD_OUTPUTPORT, {outputporttype: this.model, workflowjob: this._workflowJob, workflow: this._workflow});
    }
}
ViewOutputPortTypeListItem.prototype.tagName = 'tr';
ViewOutputPortTypeListItem.prototype.template = '#template-main_outputporttype_list_item';
ViewOutputPortTypeListItem.prototype.events = {
    'click @ui.buttonNewOutputPort': '_handleButtonNewOutputPort'
};
ViewOutputPortTypeListItem.prototype.ui = {
    buttonNewOutputPort: '#button-new_outputport'
};
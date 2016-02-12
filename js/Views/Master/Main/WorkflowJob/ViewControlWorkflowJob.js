import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../Shared/Events';

/**
 * View for editing WorkflowJob.
 */
class ViewControlWorkflowJob extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
    {
        this._initializeRadio();
        this.model = options.workflowjob;
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
     * Handle save button.
     */
    _handleButtonSave()
    {
        this.model.set({'name': this.ui.textName.val()});
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_SAVE_WORKFLOWJOB, {workflowjob: this.model});
    }

    /**
     * Handle delete button.
     */
    _handleButtonDelete()
    {
        this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_DELETE_WORKFLOWJOB, {model: this.model});
        this.rodanChannel.request(Events.REQUEST__MODAL_HIDE);
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewControlWorkflowJob.prototype.template = '#template-main_workflowjob';
ViewControlWorkflowJob.prototype.ui = {
    buttonSave: '#button-save_workflowjob_data',
    buttonDelete: '#button-delete_workflowjob',
    textName: '#text-workflowjob_name'
};
ViewControlWorkflowJob.prototype.events = {
    'click @ui.buttonSave': '_handleButtonSave',
    'click @ui.buttonDelete': '_handleButtonDelete'
};

export default ViewControlWorkflowJob;
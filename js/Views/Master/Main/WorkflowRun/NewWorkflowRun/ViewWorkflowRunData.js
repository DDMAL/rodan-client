import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * This class represents the basic data for a Workflow.
 */
class ViewWorkflowRunData extends Marionette.ItemView
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
        this._workflow = options.workflow;
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
     * Handle run button.
     */
    _handleButtonRun()
    {
        this.rodanChannel.request(Events.COMMAND__WORKFLOWRUNCREATOR_CREATE_WORKFLOWRUN, {name: this.ui.textName.val(), description: this.ui.textDescription.val()});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewWorkflowRunData.prototype.modelEvents = {
    'all': 'render'
};
ViewWorkflowRunData.prototype.template = '#template-main_workflowrun_newworkflowrun_data';
ViewWorkflowRunData.prototype.ui = {
    buttonRun: '#button-workflowrun_run',
    textName: '#text-workflowrun_name',
    textDescription: '#text-workflowrun_description'
};
ViewWorkflowRunData.prototype.events = {
    'click @ui.buttonRun': '_handleButtonRun'
};

export default ViewWorkflowRunData;
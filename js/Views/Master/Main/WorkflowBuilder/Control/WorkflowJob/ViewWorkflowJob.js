import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../Shared/Events';

/**
 * This class represents the view for editing a workflow job.
 */
class ViewWorkflowJob extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.modelEvents = {
            'all': 'render'
        };
        this.model = aParameters.workflowjob;
        this._initializeRadio();
        this.template = '#template-main_workflowbuilder_control_workflowjob_individual';
        this.ui = {
            buttonSave: '#button-save_workflowjob_data',
            textName: '#text-workflowjob_name'
        };
        this.events = {
            'click @ui.buttonSave': '_handleButtonSave'
        };
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
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_SAVE_WORKFLOWJOB, {name: this.ui.textName.val()});
    }
}

export default ViewWorkflowJob;
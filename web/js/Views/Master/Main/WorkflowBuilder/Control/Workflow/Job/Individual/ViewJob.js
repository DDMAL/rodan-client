import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../../../Shared/Events';

/**
 * This class represents the view for a single Job.
 */
class ViewJob extends Marionette.ItemView
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
        this._initializeRadio();
        this.template = '#template-main_workflowbuilder_control_job_individual';
        this.model = aParameters.job;
        this.ui = {
            buttonAdd: '#button-main_workflowbuilder_control_job_individual_button_add'
        };
        this.events = {
            'click @ui.buttonAdd': '_handleClickButtonAdd'
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
     * Handle add button.
     */
    _handleClickButtonAdd()
    {
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_ADD_WORKFLOWJOB, {job: this.model});
    }
}

export default ViewJob;
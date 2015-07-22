import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../../Shared/Events';

/**
 * This class represents the view (and controller) for the job item.
 */
class ViewJobListItem extends Marionette.ItemView
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
            'all': 'render'
        };
        this.template = '#template-main_workflowbuilder_control_job_list_item';
        this.tagName = 'tr';
        this.ui = {
            buttonAdd: '#button-main_workflowbuilder_control_job_button_add'
        };
        this.events = {
            'click @ui.buttonAdd': '_handleClickButtonAdd',
            'click': '_handleClick'
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
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handles click.
     */
    _handleClick()
    {
        this.rodanChannel.trigger(Events.EVENT__JOB_SELECTED, {job: this.model});
    }

    /**
     * Handle add button.
     */
    _handleClickButtonAdd()
    {
        this.rodanChannel.trigger(Events.EVENT__JOB_SELECTED, {job: this.model});
        this.rodanChannel.command(Events.COMMAND__WORKFLOWBUILDER_ADD_WORKFLOWJOB, {job: this.model});
    }
}

export default ViewJobListItem;
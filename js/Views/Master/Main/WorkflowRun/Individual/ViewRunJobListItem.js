import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * This class represents the view of a RunJob.
 */
class ViewRunJobListItem extends Marionette.ItemView
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
        this.template = '#template-main_workflowrun_individual_runjob_list_item';
        this.tagName = 'tr';
        this.events = {
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
       // this.rodanChannel.trigger(Events.EVENT__WORKFLOWRUN_SELECTED, {workflowRun: this.model});
    }
}

export default ViewRunJobListItem;
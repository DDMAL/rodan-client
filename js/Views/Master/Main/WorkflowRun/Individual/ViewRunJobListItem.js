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
     * Handles click.
     */
    _handleClick()
    {
       // this.rodanChannel.trigger(Events.EVENT__WORKFLOWRUN_SELECTED, {workflowRun: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewRunJobListItem.prototype.modelEvents = {
    'all': 'render'
};
ViewRunJobListItem.prototype.template = '#template-main_workflowrun_individual_runjob_list_item';
ViewRunJobListItem.prototype.tagName = 'tr';
ViewRunJobListItem.prototype.events = {
    'click': '_handleClick'
};

export default ViewRunJobListItem;
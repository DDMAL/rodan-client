import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * This class represents the view of an individual workflow list item.
 */
class ViewWorkflowListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Basic constructor. ('initialize' doesn't seem to work.)
     */
    constructor(aParameters)
    {
        this._initializeRadio();

        this.modelEvents = {
            'all': 'render'
        };
        this.template = '#template-main_workflow_list_item';
        this.tagName = 'tr';
        this.events = {
            'click': '_handleClick'
        };
        this.ui = {
            deleteWorkflowButton: '#button-delete_workflow'
        };
        this.events = {
            'click @ui.deleteWorkflowButton': '_handleButtonDeleteWorkflow'
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
        this.rodanChannel.trigger(Events.EVENT__WORKFLOW_SELECTED, {workflow: this.model});
    }

    /**
     * Handle button delete workflow.
     */
    _handleButtonDeleteWorkflow()
    {
        var confirmation = confirm('Are you sure you want to delete workflow "' + this.model.get('name') + '"?');
        if (confirmation)
        {
            this.rodanChannel.trigger(Events.COMMAND__WORKFLOW_DELETE, {workflow: this.model});
        }
    }
}

export default ViewWorkflowListItem;
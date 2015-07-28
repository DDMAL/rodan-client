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
            runWorkflowButton: '#button-run_workflow',
            deleteWorkflowButton: '#button-delete_workflow',
            copyWorkflowButton: '#button-copy_workflow',
            editWorkflowButton: '#button-edit_workflow'
        };
        this.events = {
            'click @ui.runWorkflowButton': '_handleButtonRunWorkflow',
            'click @ui.deleteWorkflowButton': '_handleButtonDeleteWorkflow',
            'click @ui.editWorkflowButton': '_handleButtonEditWorkflow',
            'click @ui.copyWorkflowButton': '_handleButtonCopyWorkflow'
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
        this._rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handles click.
     */
    _handleClick()
    {
        this._rodanChannel.trigger(Events.EVENT__WORKFLOW_SELECTED, {workflow: this.model});
    }

    /**
     * Handle button run workflow.
     */
    _handleButtonRunWorkflow()
    {
        if (!this.model.get('valid'))
        {
            alert('The workflow must be valid prior to run.');
        }
        else
        {
            this._rodanChannel.trigger(Events.EVENT__WORKFLOWRUNCREATOR_SELECTED, {workflow: this.model});
        }
    }

    /**
     * Handle button delete workflow.
     */
    _handleButtonDeleteWorkflow()
    {
        var confirmation = confirm('Are you sure you want to delete workflow "' + this.model.get('name') + '"?');
        if (confirmation)
        {
            this._rodanChannel.trigger(Events.COMMAND__WORKFLOW_DELETE, {workflow: this.model});
        }
    }

    /**
     * Handle button edit workflow.
     */
    _handleButtonEditWorkflow()
    {
        this._rodanChannel.trigger(Events.EVENT__WORKFLOWBUILDER_SELECTED, {workflow: this.model});
    }

    /**
     * Handle button copy workflow.
     */
    _handleButtonCopyWorkflow()
    {
        alert('not yet implemented');
    }
}

export default ViewWorkflowListItem;
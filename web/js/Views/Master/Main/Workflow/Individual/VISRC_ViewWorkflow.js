import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_ViewWorkflowRunListItem from './VISRC_ViewWorkflowRunListItem';

/**
 * This class represents the view for a single Workflow summary.
 */
class VISRC_ViewWorkflow extends Marionette.CompositeView
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
            "all": "render"
        };
        this.ui = {
            workflowDuplicate: '#workflow-duplicate',
            workflowEdit: '#workflow-edit',
            workflowDelete: '#workflow-delete'

        }
        this.events = {
            'click @ui.workflowDuplicate': '_handleButtonWorkflowDuplicate',
            'click @ui.workflowEdit': '_handleButtonWorkflowEdit',
            'click @ui.workflowDelete': '_handleButtonWorkflowDelete'
        };
        this._initializeRadio();
        this.template = "#template-main_workflow_individual";
        this.childView = VISRC_ViewWorkflowRunListItem;
        this.childViewContainer = 'tbody';
    }

    /**
     * Returns the associated WorkflowRun collection to the template.
     */
    templateHelpers() 
    {
        return { items: this.collection.toJSON() };
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOW_SELECTED, aReturn => this._handleEventItemSelected(aReturn));
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aReturn)
    {
        this.model = aReturn.workflow;
        this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_WORKFLOWRUN);
        this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_WORKFLOWRUNS, {workflow: this.model.id});
    }

    /**
     * Handle button workflow duplicate.
     */
    _handleButtonWorkflowDuplicate()
    {
        alert("not implemented");
    }

    /**
     * Handle button workflow edit.
     */
    _handleButtonWorkflowEdit()
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__WORKFLOWBUILDER_SELECTED, {workflow: this.model});
    }

    /**
     * Handle button workflow delete.
     */
    _handleButtonWorkflowDelete()
    {// TODO fix
        var confirmation = confirm("Are you sure you want to delete workflow '" + this.model.attributes.name + "'?");
        if (confirmation)
        {
            this.model.destroy();
        }
    }
}

export default VISRC_ViewWorkflow;
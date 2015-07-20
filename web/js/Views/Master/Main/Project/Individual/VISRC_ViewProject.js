import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_Project from '../../../../../Models/VISRC_Project';
import VISRC_ViewWorkflowRunListItem from './VISRC_ViewWorkflowRunListItem';

/**
 * This class represents the view (and controller) for a project
 */
class VISRC_ViewProject extends Marionette.CompositeView
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
        this.model = aParameters.project;
        this._initializeRadio();
        this.ui = {
            buttonSave: '#button-save_project',
            buttonDelete: '#button-delete_project',
            resourceCount: '#resource_count',
            workflowCount: '#workflow_count',
            textName: '#text-project_name',
            textDescription: '#text-project_description'
        }
        this.events = {
            'click @ui.buttonSave': '_handleButtonSave',
            'click @ui.buttonDelete': '_handleButtonDelete',
            'click @ui.resourceCount': '_handleClickResourceCount',
            'click @ui.workflowCount': '_handleClickWorkflowCount'
        };
        this.template = "#template-main_project_individual";
        this.childView = VISRC_ViewWorkflowRunListItem;
        this.childViewContainer = 'tbody';
        this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_WORKFLOWRUN);
        this.collection.reset();
        this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_WORKFLOWRUNS, {project: this.model.id});
    }

    /**
     * Returns the associated WorkflowRun collection to the template.
     */
    templateHelpers() 
    {
        return { items: this.collection.toJSON() };
    }

    /**
     * Destroy callback.
     */
    onDestroy()
    {
        this.collection = null;
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
    }

    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__PROJECT_SAVE, 
                                  {project: this.model,
                                   fields: {name: this.ui.textName.val(), description: this.ui.textDescription.val()}});
    }

    /**
     * Handle delete button.
     */
    _handleButtonDelete()
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__PROJECT_DELETE, {project: this.model});
    }

    /**
     * TODO docs
     */
    _handleClickResourceCount()
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__RESOURCES_SELECTED, {project: this.model});
    }

    /**
     * TODO docs
     */
    _handleClickWorkflowCount()
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__WORKFLOWS_SELECTED, {project: this.model});
    }
}

export default VISRC_ViewProject;
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewWorkflowRunListItem from './ViewWorkflowRunListItem';

/**
 * This class represents the view (and controller) for a project
 */
class ViewProject extends Marionette.CompositeView
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
        this.model = aParameters.project;
        this._initializeRadio();
        this.ui = {
            buttonSave: '#button-save_project',
            buttonDelete: '#button-delete_project',
            resourceCount: '#resource_count',
            workflowCount: '#workflow_count',
            textName: '#text-project_name',
            textDescription: '#text-project_description'
        };
        this.events = {
            'click @ui.buttonSave': '_handleButtonSave',
            'click @ui.buttonDelete': '_handleButtonDelete',
            'click @ui.resourceCount': '_handleClickResourceCount',
            'click @ui.workflowCount': '_handleClickWorkflowCount'
        };
        this.template = '#template-main_project_individual';
        this.childView = ViewWorkflowRunListItem;
        this.childViewContainer = 'tbody';
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_WORKFLOWRUN);
        this.collection.reset();
        this.rodanChannel.command(Events.COMMAND__LOAD_WORKFLOWRUNS, {project: this.model.id});
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
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        this.rodanChannel.command(Events.COMMAND__PROJECT_SAVE, 
                                  {project: this.model,
                                   fields: {name: this.ui.textName.val(), description: this.ui.textDescription.val()}});
    }

    /**
     * Handle delete button.
     */
    _handleButtonDelete()
    {
        this.rodanChannel.command(Events.COMMAND__PROJECT_DELETE, {project: this.model});
    }

    /**
     * TODO docs
     */
    _handleClickResourceCount()
    {
        this.rodanChannel.trigger(Events.EVENT__RESOURCES_SELECTED, {project: this.model});
    }

    /**
     * TODO docs
     */
    _handleClickWorkflowCount()
    {
        this.rodanChannel.trigger(Events.EVENT__WORKFLOWS_SELECTED, {project: this.model});
    }
}

export default ViewProject;
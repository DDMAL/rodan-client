import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewWorkflowRunListItem from '../../WorkflowRun/List/ViewWorkflowRunListItem';

/**
 * Project view.
 */
class ViewProject extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(aOptions)
    {
        this.modelEvents = {
            'all': 'render'
        };
        this.model = aOptions.project;
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
        this.collection = this._rodanChannel.request(Events.REQUEST__COLLECTION_WORKFLOWRUN);
        this._rodanChannel.command(Events.COMMAND__LOAD_WORKFLOWRUNS, {project: this.model.id});
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
        this._rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        this._rodanChannel.command(Events.COMMAND__PROJECT_SAVE, 
                                  {project: this.model,
                                   fields: {name: this.ui.textName.val(), description: this.ui.textDescription.val()}});
    }

    /**
     * Handle delete button.
     */
    _handleButtonDelete()
    {
        this._rodanChannel.command(Events.COMMAND__PROJECT_DELETE, {project: this.model});
    }

    /**
     * Handle click resource count.
     */
    _handleClickResourceCount()
    {
        this._rodanChannel.trigger(Events.EVENT__RESOURCES_SELECTED, {project: this.model});
    }

    /**
     * Handle click workflow count.
     */
    _handleClickWorkflowCount()
    {
        this._rodanChannel.trigger(Events.EVENT__WORKFLOWS_SELECTED, {project: this.model});
    }
}

export default ViewProject;
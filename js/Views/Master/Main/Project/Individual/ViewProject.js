import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import Events from '../../../../../Shared/Events';

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
    initialize(options)
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
     * Handle save button.
     */
    _handleButtonSave()
    {
        this.rodanChannel.request(Events.REQUEST__PROJECT_SAVE, 
                                  {project: this.model,
                                   fields: {name: this.ui.textName.val(), description: this.ui.textDescription.val()}});
    }

    /**
     * Handle delete button.
     */
    _handleButtonDelete()
    {
        this.rodanChannel.request(Events.REQUEST__PROJECT_DELETE, {project: this.model});
    }

    /**
     * Handle RunJob button.
     */
    _handleButtonRunJobs()
    {
        this.rodanChannel.trigger(Events.EVENT__RUNJOB_SELECTED_COLLECTION, {project: this.model});
    }

    /**
     * Handle click resource count.
     */
    _handleClickResourceCount()
    {
        this.rodanChannel.trigger(Events.EVENT__RESOURCE_SELECTED_COLLECTION, {project: this.model});
    }

    /**
     * Handle click workflow count.
     */
    _handleClickWorkflowCount()
    {
        this.rodanChannel.trigger(Events.EVENT__WORKFLOW_SELECTED_COLLECTION, {project: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewProject.prototype.modelEvents = {
            'all': 'render'
        };
ViewProject.prototype.ui = {
            buttonSave: '#button-save_project',
            buttonDelete: '#button-delete_project',
            resourceCount: '#resource_count',
            workflowCount: '#workflow_count',
            buttonRunJobs: '#button-runjobs',
            textName: '#text-project_name',
            textDescription: '#text-project_description'
        };
ViewProject.prototype.events = {
            'click @ui.buttonSave': '_handleButtonSave',
            'click @ui.buttonDelete': '_handleButtonDelete',
            'click @ui.resourceCount': '_handleClickResourceCount',
            'click @ui.workflowCount': '_handleClickWorkflowCount',
            'click @ui.buttonRunJobs': '_handleButtonRunJobs'
        };
ViewProject.prototype.template = '#template-main_project_individual';

export default ViewProject;
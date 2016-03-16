import BaseController from './BaseController';
import Events from '../Shared/Events';
import LayoutViewModel from '../Views/Master/Main/LayoutViewModel';
import Project from '../Models/Project';
import ViewProject from '../Views/Master/Main/Project/Individual/ViewProject';
import ViewProjectList from '../Views/Master/Main/Project/List/ViewProjectList';
import ViewWorkflowRunList from '../Views/Master/Main/WorkflowRun/List/ViewWorkflowRunList';
import WorkflowRunCollection from '../Collections/WorkflowRunCollection';

/**
 * Controller for Project views.
 */
class ControllerProject extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this._activeProject = null;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        // Events.
        this.rodanChannel.on(Events.EVENT__PROJECT_CREATED, options => this._handleEventProjectGenericResponse(options));
        this.rodanChannel.on(Events.EVENT__PROJECT_DELETED, options => this._handleEventProjectDeleteResponse(options));
        this.rodanChannel.on(Events.EVENT__PROJECT_SAVED, options => this._handleEventProjectGenericResponse(options));
        this.rodanChannel.on(Events.EVENT__PROJECT_SELECTED, options => this._handleEventItemSelected(options));
        this.rodanChannel.on(Events.EVENT__PROJECT_SELECTED_COLLECTION, () => this._handleEventListSelected());

        // Requests.
        this.rodanChannel.reply(Events.REQUEST__PROJECT_GET_ACTIVE, () => this._handleRequestProjectActive());
        this.rodanChannel.reply(Events.REQUEST__PROJECT_CREATE, options => this._handleRequestCreateProject(options));
        this.rodanChannel.reply(Events.REQUEST__PROJECT_SET_ACTIVE, options => this._handleRequestSetActiveProject(options));
        this.rodanChannel.reply(Events.REQUEST__PROJECT_SAVE, options => this._handleRequestProjectSave(options));
        this.rodanChannel.reply(Events.REQUEST__PROJECT_DELETE, options => this._handleRequestProjectDelete(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Event handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle event Project generic response.
     */
    _handleEventProjectGenericResponse(options)
    {
        this.rodanChannel.request(Events.REQUEST__GLOBAL_PROJECTS_LOAD, {});
    }

    /**
     * Handle event Project delete response.
     */
    _handleEventProjectDeleteResponse(options)
    {
        this.rodanChannel.request(Events.REQUEST__GLOBAL_PROJECTS_LOAD, {});
        this.rodanChannel.trigger(Events.EVENT__PROJECT_SELECTED_COLLECTION);
    }

    /**
     * Handle request Project save.
     */
    _handleRequestProjectSave(options)
    {
        options.project.save(options.fields, {patch: true, success: (model) => this.rodanChannel.trigger(Events.EVENT__PROJECT_SAVED, {project: model})});
    }

    /**
     * Handle request Project create.
     */
    _handleRequestCreateProject(options)
    {
        var project = new Project({creator: options.user});
        project.save({}, {success: (model) => this.rodanChannel.trigger(Events.EVENT__PROJECT_CREATED, {project: model})});
    }

    /**
     * Handle request Project delete.
     */
    _handleRequestProjectDelete(options)
    {
        this._activeProject = null;
        options.project.destroy({success: (model) => this.rodanChannel.trigger(Events.EVENT__PROJECT_DELETED, {project: model})});
    }

    /**
     * Handle request set active Project.
     */
    _handleRequestSetActiveProject(options)
    {
        this._activeProject = options.project;
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        this._activeProject = options.project;
        this._activeProject.fetch();
        var collection = new WorkflowRunCollection();
        collection.fetch({data: {project: this._activeProject.id}});
        this.rodanChannel.request(Events.REQUEST__TIMER_SET_FUNCTION, {function: () => collection.syncList()});
        var layoutView = new LayoutViewModel({template: '#template-main_layoutview_model_inverse'});
        this.rodanChannel.request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: layoutView});
        layoutView.showItem(new ViewProject({model: this._activeProject}));
        layoutView.showList(new ViewWorkflowRunList({collection: collection}));
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        var collection = this.rodanChannel.request(Events.REQUEST__GLOBAL_PROJECT_COLLECTION);
        this.rodanChannel.request(Events.REQUEST__TIMER_SET_FUNCTION, {function: () => collection.syncList()});
        var view = new ViewProjectList({collection: collection})
        this.rodanChannel.request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: view});
    }

    /**
     * Handle request for current active project. Returns null.
     */
    _handleRequestProjectActive()
    {
        return this._activeProject;
    }
}

export default ControllerProject;
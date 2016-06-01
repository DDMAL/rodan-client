import BaseController from './BaseController';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import LayoutViewModel from 'js/Views/Master/Main/LayoutViewModel';
import Project from 'js/Models/Project';
import Radio from 'backbone.radio';
import ViewProject from 'js/Views/Master/Main/Project/Individual/ViewProject';
import ViewProjectCollection from 'js/Views/Master/Main/Project/Collection/ViewProjectCollection';
import ViewWorkflowRunList from 'js/Views/Master/Main/WorkflowRun/List/ViewWorkflowRunList';
import WorkflowRunCollection from 'js/Collections/WorkflowRunCollection';

/**
 * Controller for Projects.
 */
export default class ControllerProject extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize the instance.
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
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__PROJECT_CREATED, options => this._handleEventProjectGenericResponse(options));
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__PROJECT_DELETED, options => this._handleEventProjectDeleteResponse(options));
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__PROJECT_SAVED, options => this._handleEventProjectGenericResponse(options));
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__PROJECT_SELECTED, options => this._handleEventItemSelected(options));
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__PROJECT_SELECTED_COLLECTION, () => this._handleEventListSelected());

        // Requests.
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__PROJECT_GET_ACTIVE, () => this._handleRequestProjectActive());
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__PROJECT_CREATE, options => this._handleRequestCreateProject(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__PROJECT_SET_ACTIVE, options => this._handleRequestSetActiveProject(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__PROJECT_SAVE, options => this._handleRequestProjectSave(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__PROJECT_DELETE, options => this._handleRequestProjectDelete(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Event handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle event Project generic response.
     */
    _handleEventProjectGenericResponse()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_PROJECTS_LOAD, {});
    }

    /**
     * Handle event Project delete response.
     */
    _handleEventProjectDeleteResponse()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_PROJECTS_LOAD, {});
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__PROJECT_SELECTED_COLLECTION);
    }

    /**
     * Handle request Project save.
     */
    _handleRequestProjectSave(options)
    {
        options.project.save(options.fields, {patch: true, success: (model) => Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__PROJECT_SAVED, {project: model})});
    }

    /**
     * Handle request Project create.
     */
    _handleRequestCreateProject(options)
    {
        var project = new Project({creator: options.user});
        project.save({}, {success: (model) => Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__PROJECT_CREATED, {project: model})});
    }

    /**
     * Handle request Project delete.
     */
    _handleRequestProjectDelete(options)
    {
        this._activeProject = null;
        options.project.destroy({success: (model) => Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__PROJECT_DELETED, {project: model})});
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
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__UPDATER_SET_COLLECTIONS, {collections: [collection]});
        var layoutView = new LayoutViewModel({template: '#template-main_layoutview_model_inverse'});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MAINREGION_SHOW_VIEW, {view: layoutView});
        layoutView.showItem(new ViewProject({model: this._activeProject}));
        layoutView.showList(new ViewWorkflowRunList({collection: collection}));
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        var collection = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_PROJECT_COLLECTION);
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__UPDATER_SET_COLLECTIONS, {collections: [collection]});
        var view = new ViewProjectCollection({collection: collection});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MAINREGION_SHOW_VIEW, {view: view});
    }

    /**
     * Handle request for current active project. Returns null.
     */
    _handleRequestProjectActive()
    {
        return this._activeProject;
    }
}
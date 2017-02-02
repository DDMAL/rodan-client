import BaseController from './BaseController';
import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';
import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import LayoutViewModel from 'js/Views/Master/Main/LayoutViewModel';
import LayoutViewProjectUsers from 'js/Views/Master/Main/Project/Individual/LayoutViewProjectUsers';
import Project from 'js/Models/Project';
import Radio from 'backbone.radio';
import ViewProject from 'js/Views/Master/Main/Project/Individual/ViewProject';
import ViewProjectCollection from 'js/Views/Master/Main/Project/Collection/ViewProjectCollection';
import ViewWorkflowRunCollection from 'js/Views/Master/Main/WorkflowRun/Collection/ViewWorkflowRunCollection';
import WorkflowRunCollection from 'js/Collections/WorkflowRunCollection';

import UserCollection from 'js/Collections/UserCollection';

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
// PRIVATE METHODS - initialization
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        // Events.
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__PROJECT_ADMIN, options => this._handleEventProjectAdmin(options));
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__PROJECT_CREATED, options => this._handleEventProjectGenericResponse(options));
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__PROJECT_DELETED, options => this._handleEventProjectDeleteResponse(options));
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__PROJECT_SAVED, options => this._handleEventProjectGenericResponse(options));
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__PROJECT_SELECTED, options => this._handleEventItemSelected(options));
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__PROJECT_SELECTED_COLLECTION, () => this._handleEventCollectionSelected());

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
     * Handle event Project admin.
     */
    _handleEventProjectAdmin(options)
    {
        // Create collections to store admins and workers.
        var adminUserCollection = new UserCollection();
        var workerUserCollection = new UserCollection();

        // Get admins and workers for project.
        var ajaxSettingsAdmins = {success: (response) => this._handleProjectGetAdminsSuccess(response, adminUserCollection),
                                  error: (response) => Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SYSTEM_HANDLE_ERROR, {response: response}),
                                  type: 'GET',
                                  dataType: 'json',
                                  url: options.project.get('url') + 'admins/'};
        var ajaxSettingsWorkers = {success: (response) => this._handleProjectGetWorkersSuccess(response, workerUserCollection),
                                   error: (response) => Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SYSTEM_HANDLE_ERROR, {response: response}),
                                   type: 'GET',
                                   dataType: 'json',
                                   url: options.project.get('url') + 'workers/'};
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_REQUEST_AJAX, {settings: ajaxSettingsAdmins});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_REQUEST_AJAX, {settings: ajaxSettingsWorkers});

        // Create view.
        var projectAdminsView = new BaseViewCollection({collection: adminUserCollection,
                                                        template: '#template-main_user_collection', 
                                                        childView: BaseViewCollectionItem,
                                                        childViewOptions: {template: '#template-main_user_collection_item'}});
        var projectWorkersView = new BaseViewCollection({collection: workerUserCollection,
                                                         template: '#template-main_user_collection',
                                                         childView: BaseViewCollectionItem,
                                                         childViewOptions: {template: '#template-main_user_collection_item'}});
        var view = new LayoutViewProjectUsers({viewprojectadmins: projectAdminsView, viewprojectworkers: projectWorkersView});

        // Show modal.
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_SHOW, {view: view, title: 'Project Users'});
    }

    /**
     * Handle event Project generic response.
     */
    _handleEventProjectGenericResponse()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_HIDE);
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_PROJECTS_LOAD, {});
    }

    /**
     * Handle event Project delete response.
     */
    _handleEventProjectDeleteResponse()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_HIDE);
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_PROJECTS_LOAD, {});
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__PROJECT_SELECTED_COLLECTION);
    }

    /**
     * Handle request Project save.
     */
    _handleRequestProjectSave(options)
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_SHOW_SIMPLE, {title: 'Saving Project', text: 'Please wait...'});
        options.project.save(options.fields, {patch: true, success: (model) => Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__PROJECT_SAVED, {project: model})});
    }

    /**
     * Handle request Project create.
     */
    _handleRequestCreateProject(options)
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_SHOW_SIMPLE, {title: 'Creating Project', text: 'Please wait...'});
        var project = new Project({creator: options.user});
        project.save({}, {success: (model) => Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__PROJECT_CREATED, {project: model})});
    }

    /**
     * Handle request Project delete.
     */
    _handleRequestProjectDelete(options)
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_SHOW_SIMPLE, {title: 'Deleting Project', text: 'Please wait...'});
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
        layoutView.showCollection(new ViewWorkflowRunCollection({collection: collection}));
    }

    /**
     * Handle collection selection.
     */
    _handleEventCollectionSelected()
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

    /**
     * Handle project admins get success.
     */
    _handleProjectGetAdminsSuccess(response, collection)
    {
        collection.fetch({data: {username__in: response.join()}});
    }

    /**
     * Handle project workers get success.
     */
    _handleProjectGetWorkersSuccess(response, collection)
    {
        collection.fetch({data: {username__in: response.join()}});
    }
}
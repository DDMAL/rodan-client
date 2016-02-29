import BaseController from './BaseController';
import Events from '../Shared/Events';
import LayoutViewModel from '../Views/Master/Main/LayoutViewModel';
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
        this._collection = null;
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
        this.rodanChannel.on(Events.EVENT__PROJECT_SELECTED, options => this._handleEventItemSelected(options));
        this.rodanChannel.on(Events.EVENT__PROJECTS_SELECTED, () => this._handleEventListSelected());

        // Requests.
        this.rodanChannel.reply(Events.REQUEST__PROJECT_ACTIVE, () => this._handleRequestProjectActive());
        this.rodanChannel.reply(Events.REQUEST__PROJECT_CREATE, options => this._handleRequestCreateProject(options));
        this.rodanChannel.reply(Events.REQUEST__PROJECT_SET_ACTIVE, options => this._handleRequestSetActiveProject(options));
        this.rodanChannel.reply(Events.REQUEST__PROJECT_SAVE, options => this._handleRequestProjectSave(options));
        this.rodanChannel.reply(Events.REQUEST__PROJECT_DELETE, options => this._handleRequestProjectDelete(options));
        this.rodanChannel.reply(Events.REQUEST__PROJECTS_SYNC, options => this._handleRequestProjectsSync(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Event handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle request Project save.
     */
    _handleRequestProjectSave(options)
    {
        options.project.save(options.fields, {patch: true});
    }

    /**
     * Handle request Project create.
     */
    _handleRequestCreateProject(options)
    {
        this._collection.create({creator: options.user});
    }

    /**
     * Handle request Project delete.
     */
    _handleRequestProjectDelete(options)
    {
        var confirmation = confirm('Are you sure you want to delete this project?');
        if (confirmation)
        {
            this._activeProject = null;
            options.project.destroy({success: () => this._handleCallbackDeleteSuccess()});
        }
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
        this.rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__WORKFLOWRUNS_SYNC, 
                                                                       options: {collection: collection}, 
                                                                       callback: null});
        var layoutView = new LayoutViewModel({template: '#template-main_layoutview_model_inverse'});
        this.rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, layoutView);
        layoutView.showItem(new ViewProject({model: this._activeProject}));
        layoutView.showList(new ViewWorkflowRunList({collection: collection}));
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        this._collection = this.rodanChannel.request(Events.REQUEST__GLOBAL_PROJECT_COLLECTION);
        this.rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__PROJECTS_SYNC, 
                                                                       options: {collection: this._collection}, 
                                                                       callback: null});
        var view = new ViewProjectList({collection: this._collection})
        this.rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, view);
    }

    /**
     * Handle request for current active project. Returns null.
     */
    _handleRequestProjectActive()
    {
        return this._activeProject !== null ? this._activeProject : null;
    }

    /**
     * Handle request project sync.
     */
    _handleRequestProjectsSync(options)
    {
        options.collection.syncList();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Callback handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle delete success.
     */
    _handleCallbackDeleteSuccess()
    {
        this.rodanChannel.trigger(Events.EVENT__PROJECTS_SELECTED);
    }
}

export default ControllerProject;
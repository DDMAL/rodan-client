import BaseController from '../../../../Controllers/BaseController';
import Events from '../../../../Shared/Events';
import LayoutViewProject from './LayoutViewProject';
import ViewProjectList from './List/ViewProjectList';
import ViewProject from './Individual/ViewProject';
import WorkflowRunCollection from '../../../../Collections/WorkflowRunCollection';

/**
 * Controller for Project views.
 */
class ProjectController extends BaseController
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
        this._rodanChannel.on(Events.EVENT__PROJECT_SELECTED, options => this._handleEventItemSelected(options));
        this._rodanChannel.on(Events.EVENT__PROJECTS_SELECTED, () => this._handleEventListSelected());

        // Requests.
        this._rodanChannel.reply(Events.REQUEST__PROJECT_ACTIVE, () => this._handleRequestProjectActive());
        this._rodanChannel.reply(Events.REQUEST__PROJECT_CREATE, options => this._handleRequestCreateProject(options));
        this._rodanChannel.reply(Events.REQUEST__PROJECT_SET_ACTIVE, options => this._handleRequestSetActiveProject(options));
        this._rodanChannel.reply(Events.REQUEST__PROJECT_SAVE, options => this._handleRequestProjectSave(options));
        this._rodanChannel.reply(Events.REQUEST__PROJECT_DELETE, options => this._handleRequestProjectDelete(options));
        this._rodanChannel.reply(Events.REQUEST__PROJECTS_SYNC, options => this._handleRequestProjectsSync(options));
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
            try
            {
                options.project.destroy({success: () => this._handleCallbackDeleteSuccess()});
            }
            catch (aError)
            {
                console.log('TODO - not sure why this error is happening; see https://github.com/ELVIS-Project/vis-client/issues/5');
            }
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
        // Get appropriate collection. In this case, a single project is being shown.
        // So, we want to pass all the WorkflowRuns associated with it.
        // Make sure we update it.
        this._activeProject = options.project;
        var workflowRunCollection = new WorkflowRunCollection();
        workflowRunCollection.fetch({data: {project: this._activeProject.id}});
        this._rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__WORKFLOWRUNS_SYNC, 
                                                                       options: {}, 
                                                                       callback: null});

        // Show layout view.
        var layoutView = new LayoutViewProject();
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, layoutView);

        // Show the list view with the collection.
        var view = new ViewProject({model: this._activeProject, collection: workflowRunCollection});
        layoutView.showView(view);
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        // Get appropriate collection. In this case, a list of Projects.
        // Make sure we update it.
        this._collection = this._rodanChannel.request(Events.REQUEST__GLOBAL_PROJECT_COLLECTION);
        this._rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__PROJECTS_SYNC, 
                                                                       options: {collection: this._collection}, 
                                                                       callback: null});

        // Show layout view.
        var layoutView = new LayoutViewProject();
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, layoutView);

        // Show the list view with the collection.
        layoutView.showView(new ViewProjectList({collection: this._collection}));
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
        if (options.collection)
        {
            options.collection.syncList();
        }
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Callback handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle delete success.
     */
    _handleCallbackDeleteSuccess()
    {
        this._rodanChannel.trigger(Events.EVENT__PROJECTS_SELECTED);
    }
}

export default ProjectController;
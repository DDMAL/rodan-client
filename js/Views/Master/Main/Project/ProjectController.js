import BaseController from '../../../../Controllers/BaseController';
import Events from '../../../../Shared/Events';
import LayoutViewProject from './LayoutViewProject';
import ProjectCollection from '../../../../Collections/ProjectCollection';
import ViewProjectList from './List/ViewProjectList';
import ViewProject from './Individual/ViewProject';

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
        this._collection = null;
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
        this._rodanChannel.reply(Events.REQUEST__PROJECT_ADD, options => this._handleRequestAddProject(options));
        this._rodanChannel.reply(Events.REQUEST__PROJECT_SET_ACTIVE, options => this._handleRequestSetActiveProject(options));
        this._rodanChannel.reply(Events.REQUEST__PROJECT_SAVE, options => this._handleRequestProjectSave(options));
        this._rodanChannel.reply(Events.REQUEST__PROJECT_DELETE, options => this._handleRequestProjectDelete(options));
        this._rodanChannel.reply(Events.REQUEST__PROJECTS_SYNC, options => this._handleRequestProjectsSync(options));
        this._rodanChannel.reply(Events.REQUEST__PROJECT_COLLECTION, options => this._handleRequestProjectsCollection(options));
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
     * Handle request Project add.
     */
    _handleRequestAddProject(options)
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
        this._activeProject = options.project;
        var layoutView = new LayoutViewProject();
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, layoutView);
        var view = new ViewProject({project: this._activeProject});
        layoutView.showView(view);
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        var user = this._rodanChannel.request(Events.REQUEST__AUTHENTICATION_USER);
        this._collection = new ProjectCollection();
        this._collection.fetch({data: {user: user.get('uuid')}});

        var layoutView = new LayoutViewProject();
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, layoutView);

        layoutView.showView(new ViewProjectList({collection: this._collection}));

        this._rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__PROJECTS_SYNC, 
                                                                       options: {collection: this._collection}, 
                                                                       callback: null});
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

    /**
     * Handle request project collection.
     */
    _handleRequestProjectsCollection(options)
    {
        return this._collection;
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
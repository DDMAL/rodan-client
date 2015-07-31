import BaseController from '../../../../Controllers/BaseController';
import Events from '../../../../Shared/Events';
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
        this._activeProject = null;
        this.collection = this._rodanChannel.request(Events.REQUEST__PROJECT_COLLECTION);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        // Commands.
        this._rodanChannel.comply(Events.COMMAND__PROJECT_ADD, aOptions => this._handleCommandAddProject(aOptions));
        this._rodanChannel.comply(Events.COMMAND__PROJECT_SET_ACTIVE, aOptions => this._handleCommandSetActiveProject(aOptions));
        this._rodanChannel.comply(Events.COMMAND__PROJECT_SAVE, aOptions => this._handleCommandProjectSave(aOptions));
        this._rodanChannel.comply(Events.COMMAND__PROJECT_DELETE, aOptions => this._handleCommandProjectDelete(aOptions));

        // Events.
        this._rodanChannel.on(Events.EVENT__PROJECT_SELECTED, aOptions => this._handleEventItemSelected(aOptions));
        this._rodanChannel.on(Events.EVENT__PROJECTS_SELECTED, () => this._handleEventListSelected());

        // Requests.
        this._rodanChannel.reply(Events.REQUEST__PROJECT_ACTIVE, () => this._handleRequestProjectActive());
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Command handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle command Project save.
     */
    _handleCommandProjectSave(aOptions)
    {
        aOptions.project.save(aOptions.fields, {patch: true});
    }

    /**
     * Handle command Project add.
     */
    _handleCommandAddProject(aOptions)
    {
        var collection = this._rodanChannel.request(Events.REQUEST__PROJECT_COLLECTION);
        collection.create({creator: aOptions.user});
    }

    /**
     * Handle command Project delete.
     */
    _handleCommandProjectDelete(aOptions)
    {
        var confirmation = confirm('Are you sure you want to delete this project?');
        if (confirmation)
        {
            this._activeProject = null;
            try
            {
                aOptions.project.destroy({success: () => this._handleCallbackDeleteSuccess()});
            }
            catch (aError)
            {
                console.log('TODO - not sure why this error is happening; see https://github.com/ELVIS-Project/vis-client/issues/5');
            }
        }
    }

    /**
     * Handle command set active Project.
     */
    _handleCommandSetActiveProject(aOptions)
    {
        this._activeProject = aOptions.project;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Event handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aOptions)
    {
        this._activeProject = aOptions.project;
        this._rodanChannel.command(Events.COMMAND__LAYOUTVIEW_SHOW, new ViewProject({project: this._activeProject}));
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        this._rodanChannel.command(Events.COMMAND__LAYOUTVIEW_SHOW, new ViewProjectList());
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Request handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle request for current active project. Returns null.
     */
    _handleRequestProjectActive()
    {
        return this._activeProject !== null ? this._activeProject : null;
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
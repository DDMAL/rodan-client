import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../Shared/Events';
import ViewProjectList from './List/ViewProjectList';
import ViewProject from './Individual/ViewProject';
import BaseController from '../../../../Controllers/BaseController';

/**
 * Controller for all Project views.
 */
class ProjectController extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Basic constructor.
     */
    constructor(aOptions)
    {
        super(aOptions);
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
        this._rodanChannel.on(Events.EVENT__PROJECT_SELECTED, aReturn => this._handleEventItemSelected(aReturn));
        this._rodanChannel.on(Events.EVENT__PROJECTS_SELECTED, () => this._handleEventListSelected());
        this._rodanChannel.reply(Events.REQUEST__PROJECT_ACTIVE, () => this._handleRequestProjectActive());
        this._rodanChannel.comply(Events.COMMAND__NEW_PROJECT, aReturn => this._handleCommandNewProject(aReturn));
        this._rodanChannel.comply(Events.COMMAND__SET_ACTIVE_PROJECT, aReturn => this._handleCommandSetActiveProject(aReturn));
        this._rodanChannel.comply(Events.COMMAND__PROJECT_SAVE, aReturn => this._handleCommandProjectSave(aReturn));
        this._rodanChannel.comply(Events.COMMAND__PROJECT_DELETE, aReturn => this._handleCommandProjectDelete(aReturn));
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
    }

    /**
     * Save changes to project.
     */
    _handleCommandProjectSave(aReturn)
    {
        aReturn.project.save(aReturn.fields, {patch: true});
    }

    /**
     * Delete project.
     */
    _handleCommandProjectDelete(aReturn)
    {
        alert("Not yet implemented");
    }

    /**
     * Handle command set active project.
     */
    _handleCommandSetActiveProject(aReturn)
    {
        this._activeProject = aReturn.project;
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aReturn)
    {
        this._activeProject = aReturn.project;
        this._viewItem = new ViewProject({project: this._activeProject});
        this._rodanChannel.command(Events.COMMAND__LAYOUTVIEW_SHOW, this._viewItem);
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        this._viewList = new ViewProjectList();
        this._rodanChannel.command(Events.COMMAND__LAYOUTVIEW_SHOW, this._viewList);
    }

    /**
     * Handle request for current active project. Returns null.
     */
    _handleRequestProjectActive()
    {
        return this._activeProject != null ? this._activeProject : null;
    }
}

export default ProjectController;
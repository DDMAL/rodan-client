import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';
import VISRC_ViewProjectList from './List/VISRC_ViewProjectList';
import VISRC_ViewProject from './Individual/VISRC_ViewProject';
import VISRC_BaseController from '../../../../Controllers/VISRC_BaseController';

/**
 * Controller for all Project views.
 */
class VISRC_ProjectController extends VISRC_BaseController
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
        this._rodanChannel.on(VISRC_Events.EVENT__PROJECT_SELECTED, aReturn => this._handleEventItemSelected(aReturn));
        this._rodanChannel.on(VISRC_Events.EVENT__PROJECTS_SELECTED, () => this._handleEventListSelected());
        this._rodanChannel.reply(VISRC_Events.REQUEST__PROJECT_ACTIVE, () => this._handleRequestProjectActive());
        this._rodanChannel.comply(VISRC_Events.COMMAND__NEW_PROJECT, aReturn => this._handleCommandNewProject(aReturn));
        this._rodanChannel.comply(VISRC_Events.COMMAND__SET_ACTIVE_PROJECT, aReturn => this._handleCommandSetActiveProject(aReturn));
        this._rodanChannel.comply(VISRC_Events.COMMAND__PROJECT_SAVE, aReturn => this._handleCommandProjectSave(aReturn));
        this._rodanChannel.comply(VISRC_Events.COMMAND__PROJECT_DELETE, aReturn => this._handleCommandProjectDelete(aReturn));
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
        console.log("todo");
        //aReturn.project.destroy();
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
        this._viewItem = new VISRC_ViewProject({project: this._activeProject});
        this._rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this._viewItem);
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        this._viewList = new VISRC_ViewProjectList();
        this._rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this._viewList);
    }

    /**
     * Handle request for current active project. Returns null.
     */
    _handleRequestProjectActive()
    {
        return this._activeProject != null ? this._activeProject : null;
    }
}

export default VISRC_ProjectController;
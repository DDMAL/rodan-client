import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'
import VISRC_ViewProjectList from './List/VISRC_ViewProjectList'
import VISRC_ViewProject from './Individual/VISRC_ViewProject'

/**
 * 'Controller' for all Project views.
 */
class VISRC_ViewProjectController extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aOptions)
    {
        this._initializeViews();
        this._initializeRadio();
        this.activeProject = null;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.on(VISRC_Events.EVENT__PROJECT_SELECTED, aReturn => this._handleEventItemSelected(aReturn));
        this.rodanChannel.on(VISRC_Events.EVENT__PROJECTS_SELECTED, () => this._handleEventListSelected());
        this.rodanChannel.reply(VISRC_Events.REQUEST__PROJECT_ACTIVE, () => this._handleRequestProjectActive());
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.viewList = new VISRC_ViewProjectList();
        this.viewItem = new VISRC_ViewProject();
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aReturn)
    {
        this.activeProject = aReturn.project;
        this.rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this.viewItem);
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this.viewList);
    }

    /**
     * Handle request for current active project. Returns null.
     */
    _handleRequestProjectActive()
    {
        return this.activeProject != null ? this.activeProject : null;
    }
}

export default VISRC_ViewProjectController;
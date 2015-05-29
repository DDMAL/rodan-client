import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'
import VISRC_ViewProjectList from './List/VISRC_ViewProjectList'
import VISRC_ViewProjectSummary from './Summary/VISRC_ViewProjectSummary'

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
        this.addRegions({
            regionMainProject: "#region-main_project"
        });
        this._initializeViews();
        this._initializeRadio();
    }

    /**
     * Return the appropriate template based on state.
     */
    getTemplate()
    {
        return "#template-main_project";
    }

    /**
     * Show the appropriate view based on state.
     */
    onDomRefresh()
    {
        this.regionMainProject.show(this.viewProjectList);
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
        this.rodanChannel.on(VISRC_Events.EVENT__PROJECT_SELECTED, () => this._handleEventItemSelected());
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.viewProjectList = new VISRC_ViewProjectList();
        this.viewProjectSummary = new VISRC_ViewProjectSummary();
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected()
    {
        this.regionMainProject.show(this.viewProjectSummary);
    }
}

export default VISRC_ViewProjectController;
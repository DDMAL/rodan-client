import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import VISRC_ViewProjectList from './VISRC_ViewProjectList'
import VISRC_ViewProjectSummary from './VISRC_ViewProjectSummary'

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
    }

    /**
     * Return the appropriate template based on state.
     */
    getTemplate()
    {
        return "#template-project";
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
     * Initialize views.
     */
    _initializeViews()
    {
        this.viewProjectList = new VISRC_ViewProjectList();
        this.viewProjectSummary = new VISRC_ViewProjectSummary();
    }
}

export default VISRC_ViewProjectController;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events'
import VISRC_Project from '../VISRC_Project'

/**
 * This class represents the view (and controller) for the project summary.
 */
class VISRC_ViewProjectSummary extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.model = null;
        this.modelEvents = {
            "all": "render"
        };
        this._initializeRadio();
    }

    /**
     * TODO
     */
    getTemplate()
    {
        return "#template-main_project_summary";
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
        this.rodanChannel.on(VISRC_Events.EVENT__APPLICATION_READY, () => this._handleEventApplicationReady());
        this.rodanChannel.on(VISRC_Events.EVENT__AUTHENTICATION_SUCCESS, aUser => this._handleAuthenticationSuccess(aUser));
        this.rodanChannel.on(VISRC_Events.EVENT__PROJECT_SELECTED, aProject => this._handleEventProjectSelected(aProject));
    }

    /**
     * TODO docs
     */
    _handleEventApplicationReady()
    {
    }

    /**
     * Handle authentication notification.
     */
    _handleAuthenticationSuccess(aUser)
    {
    }

    /**
     * Handle project selection.
     */
    _handleEventProjectSelected(aProject)
    {
        this.model = aProject;
    }
}

export default VISRC_ViewProjectSummary;
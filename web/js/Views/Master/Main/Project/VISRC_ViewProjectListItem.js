import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'

/**
 * This class represents the view (and controller) for the project summary.
 */
class VISRC_ViewProjectListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    constructor(aParameters)
    {
        this._initializeRadio();

        this.modelEvents = {
            "all": "render"
        };
        this.template = "#template-main_project_list_item";
        this.tagName = 'tr';

        super(aParameters);
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
}

export default VISRC_ViewProjectListItem;
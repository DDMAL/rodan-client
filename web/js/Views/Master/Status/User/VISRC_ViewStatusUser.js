import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'

/**
 * This class represents the view (and controller) for the status bar - login info.
 */
class VISRC_ViewStatusUser extends Marionette.CompositeView
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
        if (this.model != null)
        {
            return "#template-status_user";
        }
        else
        {
            return "#template-status_user_none";
        }
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
        console.log("status view registered app ready");
    }

    /**
     * Handle authentication notification.
     */
    _handleAuthenticationSuccess(aUser)
    {
        this._updateLoginStatus(aUser);
    }

    /**
     * Updates status bar to reflect current user.
     */
    _updateLoginStatus(aUser)
    {
        if (aUser != null)
        {
            this.model = aUser;
        }
        else
        {
            console.log("no user");
        }
        this.render();
    }
}

export default VISRC_ViewStatusUser;
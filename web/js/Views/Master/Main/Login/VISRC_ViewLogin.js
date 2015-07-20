import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';

/**
 * This represents the login view.
 */
class VISRC_ViewLogin extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.modelEvents = {
            "all": "render"
        };
        this.model = null;
        this._initializeRadio();
        this.template = "#template-main_login";
        this.ui = {
            textUsername: '#text-login_username',
            textPassword: '#text-login_password',
            buttonLogin: '#button-login'

        }
        this.events = {
            'click @ui.buttonLogin': '_handleButton'
        };
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel("rodan");
        this._rodanChannel.on(VISRC_Events.EVENT__AUTHENTICATION_ERROR_401, () => this._handleAuthentication401());
    }

    /**
     * Handles failed authentication check.
     */
    _handleAuthentication401()
    {
        this._rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this);
    }

    /**
     * Handle login button.
     */
    _handleButton()
    {
        this._rodanChannel.command(VISRC_Events.COMMAND__AUTHENTICATION_LOGIN, {username: this.ui.textUsername.val(), password: this.ui.textPassword.val()}); 
    }
}

export default VISRC_ViewLogin;
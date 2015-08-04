import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../Shared/Events';

/**
 * Login view.
 */
class ViewLogin extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.modelEvents = {
            'all': 'render'
        };
        this.model = null;
        this._initializeRadio();
        this.template = '#template-main_login';
        this.ui = {
            textUsername: '#text-login_username',
            textPassword: '#text-login_password',
            buttonLogin: '#button-login'
        };
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
        this._rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle login button.
     */
    _handleButton()
    {
        this._rodanChannel.command(Events.COMMAND__AUTHENTICATION_LOGIN, {username: this.ui.textUsername.val(), password: this.ui.textPassword.val()}); 
    }
}

export default ViewLogin;
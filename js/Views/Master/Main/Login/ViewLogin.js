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
        this.model = null;
        this._initializeRadio();
        this._rodanChannel.request(Events.REQUEST__CLEAR_TIMED_EVENT);
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
        this._rodanChannel.request(Events.REQUEST__AUTHENTICATION_LOGIN, {username: this.ui.textUsername.val(), password: this.ui.textPassword.val()}); 
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewLogin.prototype.modelEvents = {
    'all': 'render'
};
ViewLogin.prototype.ui = {
    textUsername: '#text-login_username',
    textPassword: '#text-login_password',
    buttonLogin: '#button-login'
};
ViewLogin.prototype.events = {
    'click @ui.buttonLogin': '_handleButton'
};
ViewLogin.prototype.template = '#template-main_login';

export default ViewLogin;
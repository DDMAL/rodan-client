import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../Shared/Events';

/**
 * This class represents the view (and controller) for the status bar - login info.
 */
class ViewStatusUser extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.model = aParameters.user;
        this.modelEvents = {
            'all': 'render'
        };
        this._initializeRadio();
    }

    /**
     * TODO
     */
    getTemplate()
    {
        if (this.model !== null)
        {
            return '#template-status_user';
        }
        else
        {
            return '#template-status_user_none';
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
        this._rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle button.
     */
    _handleButton()
    {
        this._rodanChannel.request(Events.REQUEST__AUTHENTICATION_LOGOUT);
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewStatusUser.prototype.ui = {
    buttonLogout: '#button-navigation_logout'
};
ViewStatusUser.prototype.events = {
    'click @ui.buttonLogout': '_handleButton'
};

export default ViewStatusUser;
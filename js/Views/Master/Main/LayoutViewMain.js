import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../Shared/Events';
import ViewLogin from './Login/ViewLogin';

/**
 * Layout view for main work area. This is responsible for loading views within the main region.
 */
class LayoutViewMain extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize()
    {
        this.addRegions({
            region: 'div'
        });
        this._initializeRadio();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.reply(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, view => this._handleCommandShow(view));
        this.rodanChannel.on(Events.EVENT__DEAUTHENTICATION_SUCCESS, () => this._handleDeauthenticationSuccess());
        this.rodanChannel.on(Events.EVENT__AUTHENTICATION_LOGINREQUIRED, () => this._handleAuthenticationLoginRequired());
    }

    /**
     * Handles request for login.
     */
    _handleAuthenticationLoginRequired()
    {
        this.loginView = new ViewLogin();
        this.rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this.loginView);
    }

    /**
     * Handle show.
     */
    _handleCommandShow(view)
    {
        this.region.show(view);
    }

    /**
     * Handle deauthentication success.
     */
    _handleDeauthenticationSuccess()
    {
        this.loginView = new ViewLogin();
        this.rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this.loginView);
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewMain.prototype.template = '#template-empty';

export default LayoutViewMain;
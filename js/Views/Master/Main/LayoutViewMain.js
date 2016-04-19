import Marionette from 'backbone.marionette';
import Events from '../../../Shared/Events';
import Radio from 'backbone.radio';
import ViewLogin from './Login/ViewLogin';

/**
 * Layout view for main work area. This is responsible for loading views within the main region.
 */
export default class LayoutViewMain extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
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
        Radio.channel('rodan').reply(Events.REQUEST__MAINREGION_SHOW_VIEW, options => this._handleCommandShow(options));
        Radio.channel('rodan').on(Events.EVENT__AUTHENTICATION_LOGOUT_SUCCESS, () => this._handleDeauthenticationSuccess());
        Radio.channel('rodan').on(Events.EVENT__AUTHENTICATION_LOGINREQUIRED, () => this._handleAuthenticationLoginRequired());
    }

    /**
     * Handles request for login.
     */
    _handleAuthenticationLoginRequired()
    {
        this._loginView = new ViewLogin();
        Radio.channel('rodan').request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: this.loginView});
    }

    /**
     * Handle show.
     */
    _handleCommandShow(options)
    {
        /** @ignore */
        this.region.show(options.view);
    }

    /**
     * Handle deauthentication success.
     */
    _handleDeauthenticationSuccess()
    {
        this._loginView = new ViewLogin();
        Radio.channel('rodan').request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: this.loginView});
    }
}
LayoutViewMain.prototype.template = '#template-empty';
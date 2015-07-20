import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Configuration from '../VISRC_Configuration';
import VISRC_Cookie from '../Shared/VISRC_Cookie'
import VISRC_Events from '../Shared/VISRC_Events'
import VISRC_User from '../Models/VISRC_User'

/**
 * TODO docs
 */
class VISRC_ControllerAuthentication extends Marionette.Object
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aControllerServer)
    {
        this._user = null;
        this._CSRFToken = new VISRC_Cookie('csrftoken');
        this.controllerServer = aControllerServer;
        this._initializeRadio();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.reply(VISRC_Events.REQUEST__USER, () => this._handleRequestUser());
        this.rodanChannel.comply(VISRC_Events.COMMAND__AUTHENTICATION_LOGIN, aData => this._login(aData));
        this.rodanChannel.comply(VISRC_Events.COMMAND__AUTHENTICATION_CHECK, () => this._checkAuthenticationStatus());
        this.rodanChannel.comply(VISRC_Events.COMMAND__AUTHENTICATION_LOGOUT, () => this._logout());
    }

    /**
     * Handle authentication response.
     */
    _handleAuthenticationResponse(aEvent)
    {
        var request = aEvent.currentTarget;
        if (request.responseText === null)
        {
            this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_ERROR_NULL);
        }

        switch (request.status)
        {
            case 200:
                this._CSRFToken = new VISRC_Cookie('csrftoken');
                var parsed = JSON.parse(request.responseText);
                this._user = new VISRC_User(parsed);
                this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_SUCCESS, {user: this._user});
                break;
            case 400:
                this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_ERROR_400);
                break;
            case 401:
                this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_ERROR_401);
                break;
            case 403:
                this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_ERROR_403);
                break;
            default:
                this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_ERROR_UNKNOWN);
                break;
        }
    }

    /**
     * Handle deauthentication response.
     */
    _handleDeauthenticationResponse(aEvent)
    {
        var request = aEvent.currentTarget;
        if (request.responseText === null)
        {
            this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_ERROR_NULL);
        }

        switch (request.status)
        {
            case 200:
                this.rodanChannel.trigger(VISRC_Events.EVENT__DEAUTHENTICATION_SUCCESS);
                break;
            case 400:
                this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_ERROR_400);
                break;
            case 401:
                this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_ERROR_401);
                break;
            case 403:
                this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_ERROR_403);
                break;
            default:
                this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_ERROR_UNKNOWN);
                break;
        }
    }

    /**
     * Handle timeout.
     */
    _handleTimeout(aEvent)
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__SERVER_WENT_AWAY);
    }

    /**
     * Sends request to check authentication.
     */
    _checkAuthenticationStatus()
    {
        var authStatusRoute = this.controllerServer.routeForRouteName('session-status');
        var request = new XMLHttpRequest();
        request.onload = (aEvent) => this._handleAuthenticationResponse(aEvent);
        request.ontimeout = (event) => this._handleTimeout(aEvent);
        request.open('GET', authStatusRoute, true);
        request.setRequestHeader('Accept', 'application/json');
        if (VISRC_Configuration.SERVER_AUTHENTICATION_TYPE === 'token')
        {
            var authToken = VISRC_Configuration.authenticationToken;
            request.setRequestHeader('Authorization', 'Token ' + authToken);
        }
        else if (VISRC_Configuration.SERVER_AUTHENTICATION_TYPE === 'session')
        {
            if (!this._CSRFToken.value)
            {
                this._CSRFToken = new VISRC_Cookie('csrftoken');
            }
            request.withCredentials = true;
            request.setRequestHeader('X-CSRFToken', this._CSRFToken.value);
        }
        request.send();
    }

    /**
     * Login.
     */
    _login(aData)
    {
        var authRoute = this.controllerServer.getAuthenticationRoute();
        var authType = VISRC_Configuration.SERVER_AUTHENTICATION_TYPE;
        var request = new XMLHttpRequest();
        request.onload = (aEvent) => this._handleAuthenticationResponse(aEvent);
        request.ontimeout = (aEvent) => this._handleTimeout(aEvent);
        request.open('POST', authRoute, true);
        if (authType === 'session')
        {
            request.withCredentials = true;
        }
        request.setRequestHeader('Accept', 'application/json');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.send('username=' + aData.username + '&password=' + aData.password);
    }

    /**
     * Logout.
     */
    _logout()
    {
        var authRoute = this.controllerServer.routeForRouteName('session-close');
        var authType = VISRC_Configuration.SERVER_AUTHENTICATION_TYPE;
        var request = new XMLHttpRequest();
        request.onload = (aEvent) => this._handleDeauthenticationResponse(aEvent);
        request.ontimeout = (aEvent) => this._handleTimeout(aEvent);
        request.open('POST', authRoute, true);
        request.setRequestHeader('Accept', 'application/json');
        if (authType === 'session')
        {
            request.withCredentials = true;
            request.setRequestHeader('X-CSRFToken', this._CSRFToken.value);
        }
        else
        {
            var authToken = this.controllerServer.authenticationToken;
            request.setRequestHeader('Authorization', 'Token ' + authToken);
        }
        request.send();
        this._user = null;
    }

    /**
     * Send out active user.
     */
    _handleRequestUser()
    {
        return this._user;
    }
}

export default VISRC_ControllerAuthentication;
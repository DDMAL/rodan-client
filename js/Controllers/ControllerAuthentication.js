import $ from 'jquery';

import Configuration from '../Configuration';
import Cookie from '../Shared/Cookie';
import Events from '../Shared/Events';
import User from '../Models/User';
import BaseController from '../Controllers/BaseController';

/**
 * Controls authentication.
 */
class ControllerAuthentication extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(aControllerServer)
    {
        // AJAX prefilter.
        var that = this;
        $.ajaxPrefilter(function(options)
        {
            if (Configuration.DEBUG)
            {
                console.log('ajax prefilter');
            }
            options.xhrFields = { withCredentials: true, };
            if (Configuration.SERVER_AUTHENTICATION_TYPE === 'session' && !options.beforeSend) 
            {
                options.beforeSend = function (xhr) 
                { 
                    xhr.setRequestHeader('X-CSRFToken', that._CSRFToken.value);
                };
            }
        });

        this._user = null;
        this._CSRFToken = new Cookie('csrftoken');
        this.controllerServer = aControllerServer;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.reply(Events.REQUEST__USER, () => this._handleRequestUser());
        this._rodanChannel.comply(Events.COMMAND__AUTHENTICATION_LOGIN, aData => this._login(aData));
        this._rodanChannel.comply(Events.COMMAND__AUTHENTICATION_CHECK, () => this._checkAuthenticationStatus());
        this._rodanChannel.comply(Events.COMMAND__AUTHENTICATION_LOGOUT, () => this._logout());
    }

    /**
     * Handle authentication response.
     */
    _handleAuthenticationResponse(aEvent)
    {
        var request = aEvent.currentTarget;
        if (request.responseText === null)
        {
            this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_ERROR_NULL);
        }

        switch (request.status)
        {
            case 200:
                this._CSRFToken = new Cookie('csrftoken');
                var parsed = JSON.parse(request.responseText);
                this._user = new User(parsed);
                this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_SUCCESS, {user: this._user});
                break;
            case 400:
                this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_ERROR_400);
                break;
            case 401:
                this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_ERROR_401);
                break;
            case 403:
                this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_ERROR_403);
                break;
            default:
                this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_ERROR_UNKNOWN);
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
            this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_ERROR_NULL);
        }

        switch (request.status)
        {
            case 200:
                this._rodanChannel.trigger(Events.EVENT__DEAUTHENTICATION_SUCCESS);
                break;
            case 400:
                this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_ERROR_400);
                break;
            case 401:
                this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_ERROR_401);
                break;
            case 403:
                this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_ERROR_403);
                break;
            default:
                this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_ERROR_UNKNOWN);
                break;
        }
    }

    /**
     * Handle timeout.
     */
    _handleTimeout(aEvent)
    {
        this._rodanChannel.trigger(Events.EVENT__SERVER_WENT_AWAY, {event: aEvent});
    }

    /**
     * Sends request to check authentication.
     */
    _checkAuthenticationStatus()
    {
        var authRoute = this._rodanChannel.request(Events.REQUEST__SERVER_ROUTE, 'session-status');
        var request = new XMLHttpRequest();
        request.onload = (aEvent) => this._handleAuthenticationResponse(aEvent);
        request.ontimeout = (aEvent) => this._handleTimeout(aEvent);
        request.open('GET', authRoute, true);
        request.setRequestHeader('Accept', 'application/json');
        if (Configuration.SERVER_AUTHENTICATION_TYPE === 'token')
        {
            alert('TODO - token auth not working at the moment');
            //request.setRequestHeader('Authorization', 'Token ' + authToken);
        }
        else if (Configuration.SERVER_AUTHENTICATION_TYPE === 'session')
        {
            if (!this._CSRFToken.value)
            {
                this._CSRFToken = new Cookie('csrftoken');
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
        var authRoute = this._getAuthenticationRoute();
        var authType = Configuration.SERVER_AUTHENTICATION_TYPE;
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
        var authRoute = this._rodanChannel.request(Events.REQUEST__SERVER_ROUTE, 'session-close');
        var authType = Configuration.SERVER_AUTHENTICATION_TYPE;
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
            alert('TODO - token auth not working at the moment');
            //request.setRequestHeader('Authorization', 'Token ' + authToken);
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

    /**
     * Returns authentication route.
     */
    _getAuthenticationRoute()
    {
        switch (Configuration.SERVER_AUTHENTICATION_TYPE)
        {
            case 'session':
            {
                return this._rodanChannel.request(Events.REQUEST__SERVER_ROUTE, 'session-auth');
            }

            case 'token':
            {
                return this._rodanChannel.request(Events.REQUEST__SERVER_ROUTE, 'token-auth');
            }

            default:
            {
                console.error('An acceptable Authentication Type was not provided');
                break;
            }
        }
    }
}

export default ControllerAuthentication;
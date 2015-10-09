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
    initialize()
    {
        this._user = null;
        if (Configuration.SERVER_AUTHENTICATION_TYPE === 'session')
        {
            this._token = new Cookie('csrftoken');
        }
        else if (Configuration.SERVER_AUTHENTICATION_TYPE === 'token')
        {
            this._token = new Cookie('token');
        }
        else
        {
            // todo error
        }
    }

    /**
     * AJAx prefilter associated with authentication.
     */
    ajaxPrefilter(options)
    {
        var that = this;
        if (Configuration.SERVER_AUTHENTICATION_TYPE === 'session' && !options.beforeSend) 
        {
            options.xhrFields = { withCredentials: true };
            options.beforeSend = function (xhr) 
            {
                xhr.setRequestHeader('X-CSRFToken', that._token.value);
            };
        }
        else if(Configuration.SERVER_AUTHENTICATION_TYPE === 'token')
        {
            options.beforeSend = function (xhr)
            {
                xhr.setRequestHeader('Authorization', 'Token ' + that._token.value);
            }
        }
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
        this._rodanChannel.reply(Events.COMMAND__AUTHENTICATION_LOGIN, aData => this._login(aData));
        this._rodanChannel.reply(Events.COMMAND__AUTHENTICATION_CHECK, () => this._checkAuthenticationStatus());
        this._rodanChannel.reply(Events.COMMAND__AUTHENTICATION_LOGOUT, () => this._logout());
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
                var parsed = JSON.parse(request.responseText);
                this._user = new User(parsed);
                this._processAuthenticationData();
                this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_SUCCESS, {user: this._user});
                break;
            case 400:
                this._rodanChannel.request(Events.COMMAND__HANDLER_ERROR, {response: request});
                this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_LOGINREQUIRED);
                break;
            case 401:
                this._rodanChannel.request(Events.COMMAND__HANDLER_ERROR, {response: request,
                                                                           message: 'Incorrect username/password.'});
                this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_LOGINREQUIRED);
                break;
            case 403:
                this._rodanChannel.request(Events.COMMAND__HANDLER_ERROR, {response: request});
                this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_LOGINREQUIRED);
                break;
            default:
                this._rodanChannel.request(Events.COMMAND__HANDLER_ERROR, {response: request});
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
                this._rodanChannel.request(Events.COMMAND__HANDLER_ERROR, {response: request});
                break;
            case 401:
                this._rodanChannel.request(Events.COMMAND__HANDLER_ERROR, {response: request});
                break;
            case 403:
                this._rodanChannel.request(Events.COMMAND__HANDLER_ERROR, {response: request});
                break;
            default:
                this._rodanChannel.request(Events.COMMAND__HANDLER_ERROR, {response: request});
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
        // First, check if we have the appropriate authentication data. If we do, check it.
        // If we don't, trigger an event to inform of login require.
        if (this._token.value === '')
        {
            this._rodanChannel.trigger(Events.EVENT__AUTHENTICATION_LOGINREQUIRED);
        }
        else
        {
            var authRoute = this._rodanChannel.request(Events.REQUEST__SERVER_ROUTE, 'auth-me');
            var request = new XMLHttpRequest();
            request.onload = (aEvent) => this._handleAuthenticationResponse(aEvent);
            request.ontimeout = (aEvent) => this._handleTimeout(aEvent);
            request.open('GET', authRoute, true);
            request.setRequestHeader('Accept', 'application/json');
            this._setAuthenticationData(request);
            request.send();
        }
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
        var authRoute = this._rodanChannel.request(Events.REQUEST__SERVER_ROUTE, 'auth-reset-token');
        var authType = Configuration.SERVER_AUTHENTICATION_TYPE;
        var request = new XMLHttpRequest();
        request.onload = (aEvent) => this._handleDeauthenticationResponse(aEvent);
        request.ontimeout = (aEvent) => this._handleTimeout(aEvent);
        request.open('POST', authRoute, true);
        request.setRequestHeader('Accept', 'application/json');
        this._setAuthenticationData(request);
        this._deleteAuthenticationData();
        request.send();
        this._user = null;
    }

    /**
     * Sets the appropriate authentication data to the request.
     */
    _setAuthenticationData(request)
    {
        if (Configuration.SERVER_AUTHENTICATION_TYPE === 'token')
        {
            request.setRequestHeader('Authorization', 'Token ' + this._token.value);
        }
        else if (Configuration.SERVER_AUTHENTICATION_TYPE === 'session')
        {
            request.withCredentials = true;
            request.setRequestHeader('X-CSRFToken', this._token.value);
        }   
    }

    /**
     * Deletes authentication data.
     */
    _deleteAuthenticationData()
    {
        // Only need to worry about token authentication.
        if (Configuration.SERVER_AUTHENTICATION_TYPE === 'token')
        {
            Cookie.saveCookie('token', '', 0);
            this._token = new Cookie('token');
        }
    }

    /** 
     * Save authentication data.
     */
    _processAuthenticationData()
    {
        if (Configuration.SERVER_AUTHENTICATION_TYPE === 'token' && this._user.has('token'))
        {
            Cookie.saveCookie('token', this._user.get('token'), 365);
            this._token = new Cookie('token');
        }
        else if (Configuration.SERVER_AUTHENTICATION_TYPE === 'session')
        {
            this._token = new Cookie('csrftoken');
        }
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
                return this._rodanChannel.request(Events.REQUEST__SERVER_ROUTE, 'auth-token');
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
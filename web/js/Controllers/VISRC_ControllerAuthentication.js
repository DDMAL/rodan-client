import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Cookie from '../Shared/VISRC_Cookie'
import VISRC_Events from '../Shared/VISRC_Events'
import VISRC_User from '../VISRC_User'

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
        this.user = null;

        // TODO - couldn't we just have a master radio channel that is passed to all objects?
        // or perhaps a base class controller...
        this.controllerServer = aControllerServer;
        this._initializeRadio();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");

        // Requests
        this.rodanChannel.reply(VISRC_Events.REQUEST__USER, () => this._handleRequestUser());
        this.rodanChannel.comply(VISRC_Events.COMMAND__AUTHENTICATION_LOGIN, aData => this._login(aData));
    }

    /**
     * TODO docs
     */
    _checkAuthenticationStatus()
    {
        var authStatusRoute = this.controllerServer.statusRoute;
        var authRequest = new XMLHttpRequest();

        authRequest.onload = (event) =>
        {
            // stuff
            if (authRequest.responseText === null)
            {
                this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_ERROR_NULL);
            }

            switch (authRequest.status)
            {
                case 200:
                    var parsed = JSON.parse(authRequest.responseText);
                    this.user = new VISRC_User(parsed);
                    this.rodanChannel.trigger(VISRC_Events.EVENT__SUCCESS_AUTHENTICATION, this.user);
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
        };

        authRequest.ontimeout = (event) =>
        {
            this.rodanChannel.trigger(VISRC_Events.EVENT__SERVER_WENT_AWAY);
        };

        authRequest.open('GET', authStatusRoute, true);
        authRequest.setRequestHeader('Accept', 'application/json');

        if (this.controllerServer.authenticationType === 'token')
        {
            var authToken = this.controllerServer.authenticationToken;
            authRequest.setRequestHeader('Authorization', 'Token ' + authToken);
        }
        else if (this.controllerServer.authenticationType === 'session')
        {
            console.log('Injecting the cookie for session authentication');
            // if the server controller doesn't have the CSRF Token, set it now
            if (!this.controllerServer.CSRFToken.value)
            {
                this.controllerServer.CSRFToken = new Cookie('csrftoken');//reads cookie from browser
            }

            authRequest.withCredentials = true;
            authRequest.setRequestHeader('X-CSRFToken', this.controllerServer.CSRFToken.value);
        }

        authRequest.send();
    }

    /**
     * TODO docs
     */
    _login(aData)
    {
        var username = aData.username;
        var password = aData.password;

        // request from the server and set the authentication tokens
        var authRoute = this.controllerServer.authenticationRoute;
        var authType = this.controllerServer.authenticationType;
        var loginRequest = new XMLHttpRequest();
        var requestBody;

        loginRequest.onload = (event) =>
        {
            if (loginRequest.statusText === null)
            {
                console.log('null resp');
            }
            
            switch (loginRequest.status)
            {
                case 200:
                    var parsed = JSON.parse(loginRequest.responseText);
                    this.user = new VISRC_User(parsed);
                    console.log('Success', this.user);

                    if (authType === 'token')
                    {
                        this.controllerServer.authenticationToken = this.user.attributes.token;
                    }
                    //else
                    //{
                    //    this.controllerServer.CSRFToken = new Cookie('csrftoken');
                    //}

                    this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_SUCCESS, this.user);
                    break;
                case 400:
                    this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_ERROR_400);
                    break;
                case 401:
                    this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_ERROR_401); //@TODO AuthenticationFailed?
                    //this.rodanChannel.trigger(Events.UserMustAuthenticate); @TODO re-enable, this is a loop right now
                    break;
                case 403:
                    this.rodanChannel.trigger(VISRC_Events.EVENT__AUTHENTICATION_ERROR_403);
                    break;
                default:
                    console.log('Error: ', loginRequest.status);
                    break;
            }
        };

        loginRequest.open('POST', authRoute, true);

        if (authType === 'session')
        {
            //if (!this.serverController.CSRFToken)
            //    this.serverController.CSRFToken = new Cookie('csrftoken');//@TODO does this do what we want it to?

            loginRequest.withCredentials = true;
            loginRequest.setRequestHeader('X-CSRFToken', this.serverController.CSRFToken.value);
        }

        loginRequest.setRequestHeader('Accept', 'application/json');
        loginRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        requestBody = 'username=' + username + '&password=' + password;

        loginRequest.send(requestBody);
    }

    /**
     * TODO docs
     */
    logout()
    {
        // request from the server and set the authentication tokens
        var logoutRoute = this.serverController.logoutRoute;
        var authType = this.serverController.authenticationType;
        var logoutRequest = new XMLHttpRequest();

        logoutRequest.onload = (event) => {
            if (logoutRequest.statusText === null) {
                console.log('null resp');
            }

            switch (logoutRequest.status) {
                case 200:
                    var parsed = JSON.parse(logoutRequest.responseText);
                    console.log('Logout success');
                    //remove cookies here

                    this.rodanChannel.trigger(Events.DeauthenticationSuccess);
                    //this.rodanChannel.trigger(Events.UserMustAuthenticate); @TODO trigger this to show login again
                    break;
                case 400:
                    console.log('Bad request');
                    this.rodanChannel.trigger(Events.AuthenticationError);
                    break;
                case 401:
                    console.log('Deauthentication failed');
                    this.rodanChannel.trigger(Events.AuthenticationError);
                    //this.rodanChannel.trigger(Events.UserMustAuthenticate); @TODO trigger this to show login again
                    break;
                case 403:
                    console.log('Forbidden');
                    this.rodanChannel.trigger(Events.UserCannotAuthenticate);
                    break;
                default:
                    console.log('Error: ', logoutRequest.status);
                    break;
            }
        }

        logoutRequest.open('POST', logoutRoute, true);
        logoutRequest.setRequestHeader('Accept', 'application/json');

        if (authType === 'session')
        {
            //if (!this.serverController.CSRFToken) @TODO necessary?
            //    this.serverController.CSRFToken = new Cookie();

            logoutRequest.withCredentials = true;
            logoutRequest.setRequestHeader('X-CSRFToken', this.serverController.CSRFToken.value);
        }
        else
        {
            var authToken = this.serverController.authenticationToken;
            logoutRequest.setRequestHeader('Authorization', 'Token ' + authToken);
        }

        logoutRequest.send();
    }

    /**
     * Send out active user.
     */
    _handleRequestUser()
    {
        return this.user;
    }
}

export default VISRC_ControllerAuthentication;
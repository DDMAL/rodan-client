import $ from 'jquery';
import BaseController from 'js/Controllers/BaseController';
import Configuration from 'js/Configuration';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';
import UserPreference from 'js/Models/UserPreference';

/**
 * UserPreference controller.
 */
export default class ControllerUserPreference extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     */
    initialize()
    {
        /** @ignore */
        this._userPreference = null;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Event bindings.
     */
    _initializeRadio()
    {
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__AUTHENTICATION_LOGIN_SUCCESS, (options) => this._handleEventAuthenticationSuccess(options));
    }

    /**
     * Handle authentication success.
     */
    _handleEventAuthenticationSuccess(options)
    {
        var route = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_GET_ROUTE, 'userpreferences');
        var ajaxSettings = {success: (response) => this._handleAjaxLoadUserPreference(response, options.user),
                            type: 'GET',
                            url: route,
                            dataType: 'json',
                            data: {user: options.user.get('url')}};
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_REQUEST_AJAX, {settings: ajaxSettings});
    }

    /**
     * Handle loading of user preference. If DNE, will automatically create it.
     */
    _handleAjaxLoadUserPreference(response, user)
    {
        if (!response.results || response.results.length === 0)
        {
            var route = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_GET_ROUTE, 'userpreferences');
            var ajaxSettings = {success: (response) => this._handleAjaxLCreateUserPreference(response),
                                type: 'POST',
                                url: route,
                                dataType: 'json',
                                data: {user: user.get('url')}};
            Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__SERVER_REQUEST_AJAX, {settings: ajaxSettings});
        }
        else
        {
            this._createUserPreferenceModel(response.results[0]);
        }
    }

    /**
     * Handle creation of user preference.
     */
    _handleAjaxLCreateUserPreference(response)
    {
        this._createUserPreferenceModel(response);
    }

    /**
     * Creates new model for user preference based on JSON response.
     */
    _createUserPreferenceModel(json)
    {
        this._userPreference = new UserPreference(json);
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__USER_PREFERENCE_LOADED, {user_preference: this._userPreference});
    }
}
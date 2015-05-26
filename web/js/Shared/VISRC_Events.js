var VISRC_Events = {

///////////////////////////////////////////////////////////////////////////////////////
// COMMANDS
///////////////////////////////////////////////////////////////////////////////////////
    COMMAND__GET_ROUTES: 'COMMAND__GET_ROUTES',
    COMMAND__AUTHENTICATION_LOGIN: 'COMMAND__AUTHENTICATION_LOGIN',

///////////////////////////////////////////////////////////////////////////////////////
// EVENTS
///////////////////////////////////////////////////////////////////////////////////////

    // Application events.
    EVENT__APPLICATION_READY: 'EVENT__APPLICATION_READY',
    EVENT__ROUTESLOADED: 'EVENT__ROUTES_LOADED',

    // Authentication events.
    EVENT__AUTHENTICATION_ERROR_400: 'EVENT__AUTHENTICATION_ERROR_400',
    EVENT__AUTHENTICATION_ERROR_401: 'EVENT__AUTHENTICATION_ERROR_401',
    EVENT__AUTHENTICATION_ERROR_403: 'EVENT__AUTHENTICATION_ERROR_403',
    EVENT__AUTHENTICATION_ERROR_NULL: 'EVENT__AUTHENTICATION_ERROR_NULL',
    EVENT__AUTHENTICATION_ERROR_UNKNOWN: 'EVENT__AUTHENTICATION_ERROR_UNKNOWN',
    EVENT__AUTHENTICATION_SUCCESS: 'EVENT__SUCCESS_AUTHENTICATION',
    EVENT__AUTHENTICATION_USER_MUST_AUTHENTICATE: 'EVENT__AUTHENTICATION_USER_MUST_AUTHENTICATE',
    EVENT__DEAUTHENTICATION_SUCCESS: 'EVENT__DEAUTHENTICATION_SUCCESS',

    // Connection events.
    EVENT__SERVER_WENT_AWAY: 'EVENT__SERVER_WENT_AWAY',

///////////////////////////////////////////////////////////////////////////////////////
// REQUESTS
///////////////////////////////////////////////////////////////////////////////////////
    REQUEST__APPLICATION: 'REQUEST_APPLICATION',
    REQUEST__USER: 'REQUEST__USER'
};

export default VISRC_Events;
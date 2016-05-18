import RODAN_EVENTS from './RODAN_EVENTS';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * General error handler.
 */
export default class ErrorHandler extends Marionette.Object
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this._initializeRadio();
        window.onerror = (errorText, url, lineNumber, columnNumber, error) => this._handleJavaScriptError(errorText, url, lineNumber, columnNumber, error);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__SYSTEM_HANDLE_ERROR, (options) => this._handleError(options));
    }

    /**
     * Handles Javscript error.
     */
    _handleJavaScriptError(errorText, url, lineNumber, columnNumber, error)
    {
        var text = 'text: ' + errorText + '\n';
        text += 'url: ' + url + '\n';
        text += 'line: ' + lineNumber + '\n';
        text += 'column: ' + columnNumber;
        console.log(error);
    }

    /**
     * Handle error.
     */
    _handleError(options)
    {
        var response = options.response;
        var responseTextObject = response.responseText !== '' ? JSON.parse(response.responseText) : null;
        if (responseTextObject !== null)
        {
            if (responseTextObject.hasOwnProperty('error_code'))
            {
                this._processRodanError(options); // custom Rodan error code present
            }
            else
            {
                this._processHTTPError(options); // HTTP error
            }
        }
        else
        {
            alert(response.statusText);
        }
    }

    /**
     * Processes HTTP errors.
     */
    _processHTTPError(options)
    {
        var response = options.response;
        var responseTextObject = JSON.parse(response.responseText);
        var message = 'An unknown error occured.';

        // Look for message in options first.
        if (options.hasOwnProperty('message'))
        {
            message = options.message;
        }

        // Go through the response text.
        var first =  true;
        for(var property in responseTextObject)
        {
            if (responseTextObject.hasOwnProperty(property))
            {
                message += '\n';
                if (first)
                {
                    message += '\n';
                    first = false;
                }
                message += responseTextObject[property];
            }
        }
        alert(message);
    }

    /**
     * Processes Rodan-generated error response.
     */
    _processRodanError(options)
    {
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__SERVER_ERROR, {json: options.response.responseJSON});
    }
}
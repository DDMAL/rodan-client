import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from './Events';

/**
 * General error handler.
 */
class ErrorHandler extends Marionette.Object
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
     * Initialize radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.reply(Events.REQUEST__HANDLER_ERROR, (options) => this._handleError(options));
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
        this.rodanChannel.trigger(Events.EVENT__RODAN_ERROR, {json: options.response.responseJSON});
    }
}

export default ErrorHandler;
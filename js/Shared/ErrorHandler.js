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
        this._rodanChannel = Radio.channel('rodan');
        this._rodanChannel.reply(Events.COMMAND__HANDLER_ERROR, (options) => this._handleError(options));
    }

    /**
     * Handles Javscript error.
     */
    _handleJavaScriptError(errorText, url, lineNumber, columnNumber, error)
    {
        var text = 'text: ' + errorText + '\n';
        text += 'url: ' + url + '\n';
        text += 'line: ' + lineNumber + '\n';
        text += 'column: ' + columnNumber + '\n';
        text += 'stack trace: ' + '\n';
        text += error.stack;
    }

    /**
     * Handle error.
     */
    _handleError(options)
    {
        var response = options.response;
        var responseTextObject = JSON.parse(response.responseText);
        if (responseTextObject.hasOwnProperty('error_code'))
        {
            this._processRodanError(options); // custom Rodan error code present
        }
        else
        {
            this._processHTTPError(options); // HTTP error
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
        var response = options.response;
        var responseTextObject = JSON.parse(response.responseText);
        switch (responseTextObject.error_code)
        {
            case 'IP_TOO_MANY_CONNECTIONS':
            {
                alert('The InputPort has more than one connection.');
                break;
            }

            case 'IP_TYPE_MISMATCH':
            {
                alert('The InputPortType of InputPort does not belong to the underlying Job of WorkflowJob.');
                break;
            }

            case 'NO_COMMON_RESOURCETYPE':
            {
                alert('There is no common ResourceType between an OutputPort and connected InputPorts.');
                break;
            }

            case 'OP_TYPE_MISMATCH':
            {
                alert('The OutputPortType of OutputPort does not belong to the underlying Job of WorkflowJob.');
                break;
            }

            case 'WF_EMPTY':
            {
                alert('Workflow is empty.');
                break;
            }

            case 'WF_HAS_CYCLES':
            {
                alert('The Workflow has cycles.');
                break;
            }

            case 'WFJ_INVALID_SETTINGS':
            {
                alert('The WorkflowJob has invalid settings.');
                break;
            }

            case 'WFJ_NO_OP':
            {
                alert('The WorkflowJob has no OutputPort.');
                break;
            }

            case 'WF_NOT_CONNECTED':
            {
                alert('The Workflow is not connected.');
                break;
            }

            case 'WFJ_TOO_FEW_IP':
            {
                alert('The WorkflowJob has too few InputPorts.');
                break;
            }

            case 'WFJ_TOO_FEW_OP':
            {
                alert('The WorkflowJob has too few OutputPorts.');
                break;
            }

            case 'WFJ_TOO_MANY_IP':
            {
                alert('The WorkflowJob has too many InputPorts.');
                break;
            }

            case 'WFJ_TOO_MANY_OP':
            {
                alert('The WorkflowJob has too many OutputPorts.');
                break;
            }

            default:
            {
                alert('Unknown error code ' + response.error_code);
                break;
            }
        }
    }
}

export default ErrorHandler;
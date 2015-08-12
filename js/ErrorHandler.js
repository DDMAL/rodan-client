import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from './Shared/Events';

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
     * Handle error.
     */
    _handleError(options)
    {
        var responseObject = JSON.parse(options.response.responseText);
        if (responseObject.hasOwnProperty('error_code'))
        {
            this._processRodanError(responseObject);
        }
        else
        {
            alert('Unknown error.');
        }
    }

    /**
     * Processes Rodan-generated error response.
     */
    _processRodanError(responseObject)
    {
        switch (responseObject.error_code)
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
                alert('Unknown error code ' + responseObject.error_code);
                break;
            }
        }
    }
}

export default ErrorHandler;
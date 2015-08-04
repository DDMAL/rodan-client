import Backbone from 'backbone';
import Radio from 'backbone.radio';

import Events from '../Shared/Events';

/**
 * Base model.
 */
class BaseModel extends Backbone.Model
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(aParameters)
    {
        this.idAttribute = 'uuid';
        this._initializeRadio();
        this.on('change', aEvent => this._onChange(aEvent));
        super(aParameters);
    }

    /**
     * URL override to add trailing slash.
     * Also, the URL will depend if this model instance has been saved or not.
     * If not saved, we have to use the plural route for the model to save it.
     * That's the way Rodan works. :)
     */
    url()
    {
        var original_url = this.rodanChannel.request(Events.REQUEST__SERVER_ROUTE, this.routeName);
        if (typeof this.get('uuid') !== 'undefined')
        {
            original_url = this.get('url');
        }
        var parsed_url = original_url + ( original_url.charAt( original_url.length - 1 ) === '/' ? '' : '/' );
        return parsed_url;
    }

    /**
     * Override of destroy to allow for generic handling.
     */
    destroy(aOptions)
    {
        aOptions = this._applyResponseHandlers(aOptions);
        super.destroy(aOptions);
    }

    /**
     * Override of save to allow for generic handling.
     */
    save(aAttributes, aOptions)
    {
        aOptions = this._applyResponseHandlers(aOptions);
        super.save(aAttributes, aOptions);
    }

    /**
     * Override of fetch to allow for generic handling.
     */
    fetch(aOptions)
    {
        aOptions = this._applyResponseHandlers(aOptions);
        super.fetch(aOptions);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * On change handler.
     */
    _onChange()
    {
        this.rodanChannel.trigger(Events.EVENT__MODEL_HASCHANGED, {model: this});
    }

    /**
     * Applies response handlers.
     */
    _applyResponseHandlers(aOptions)
    {
        // Check if options are defined.
        if (aOptions === undefined)
        {
            aOptions = {};
        }

        // Success.
        var genericSuccessFunction = (aModel, aResponse, aOptions) => this._handleSuccessResponse(aModel, aResponse, aOptions);
        if (!aOptions.hasOwnProperty('success'))
        {
            aOptions.success = (aModel, aResponse, aOptions) => this._handleSuccessResponse(aModel, aResponse, aOptions);
        }
        else
        {
            var customSuccessFunction = aOptions.success;
            aOptions.success = function(aModel, aResponse, aOptions)
            {
                customSuccessFunction(aModel, aResponse, aOptions);
                genericSuccessFunction(aModel, aResponse, aOptions);
            };
        }

        // Error.
        var genericErrorFunction = (aModel, aResponse, aOptions) => this._handleErrorResponse(aModel, aResponse, aOptions);
        if (!aOptions.hasOwnProperty('error'))
        {
            aOptions.error = (aModel, aResponse, aOptions) => this._handleErrorResponse(aModel, aResponse, aOptions);
        }
        else
        {
            var customErrorFunction = aOptions.error;
            aOptions.error = function(aModel, aResponse, aOptions)
            {
                customErrorFunction(aModel, aResponse, aOptions);
                genericErrorFunction(aModel, aResponse, aOptions);
            };
        }

        return aOptions;
    }

    /**
     * Handle success response.
     */
    _handleSuccessResponse(aModel, aResponse, aOptions)
    {
        var text = 'Success: ' 
                   + ' (' + aOptions.xhr.status + ') ' 
                   + aModel.constructor.name + ' "' + aModel.get('name') + '"';
        this.rodanChannel.command(Events.COMMAND__PROCESS_MESSAGE, {text: text});
    }

    /**
     * Handle error response.
     */
    _handleErrorResponse(aModel, aResponse, aOptions)
    {
        var text = 'todo - need to process error code';
        /*var text = 'Error: ' 
                   + ' (' + aOptions.xhr.status + ') ' 
                   + aResponse;*/
        this.rodanChannel.command(Events.COMMAND__PROCESS_MESSAGE, {text: text});
    }
}

export default BaseModel;
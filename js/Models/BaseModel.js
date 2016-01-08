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
    constructor(options)
    {
        super(options);
        this._initializeRadio();
        this.on('change', event => this._onChange(event));
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
    destroy(options)
    {
        options = this._applyResponseHandlers(options);
        options.task = 'destroy';
        super.destroy(options);
    }

    /**
     * Override of save to allow for generic handling.
     */
    save(attributes, options)
    {
        options = this._applyResponseHandlers(options);
        options.task = 'save';
        super.save(attributes, options);
    }

    /**
     * Override of fetch to allow for generic handling.
     */
    fetch(options)
    {
        options = this._applyResponseHandlers(options);
        options.task = 'fetch';
        super.fetch(options);
    }

    /**
     * Returns descriptive string for model. This should be overridden by sub-classes.
     */
    getDescription()
    {
        return "no description available";
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
    _applyResponseHandlers(options)
    {
        // Check if options are defined.
        if (options === undefined)
        {
            options = {};
        }

        // Success.
        var genericSuccessFunction = (model, response, options) => this._handleSuccessResponse(model, response, options);
        if (!options.hasOwnProperty('success'))
        {
            options.success = (model, response, options) => this._handleSuccessResponse(model, response, options);
        }
        else
        {
            var customSuccessFunction = options.success;
            options.success = function(model, response, options)
            {
                customSuccessFunction(model, response, options);
                genericSuccessFunction(model, response, options);
            };
        }

        // Error.
        var genericErrorFunction = (model, response, options) => this._handleErrorResponse(model, response, options);
        if (!options.hasOwnProperty('error'))
        {
            options.error = (model, response, options) => this._handleErrorResponse(model, response, options);
        }
        else
        {
            var customErrorFunction = options.error;
            options.error = function(model, response, options)
            {
                customErrorFunction(model, response, options);
                genericErrorFunction(model, response, options);
            };
        }

        return options;
    }

    /**
     * Handle success response.
     */
    _handleSuccessResponse(model, response, options)
    {
        var text = 'Successful ' + options.task
                   + ' (' + options.xhr.status + '): ' 
                   + model.constructor.name + ' "' + model.get('name') + '"'
                   + ' (' + model.get('url') + ')';
        this.rodanChannel.request(Events.REQUEST__DISPLAY_MESSAGE, {text: text});
    }

    /**
     * Handle error response.
     */
    _handleErrorResponse(model, response, options)
    {
        this.rodanChannel.request(Events.REQUEST__HANDLER_ERROR, {model: model,
                                                                  response: response,
                                                                  options: options});
        var text = 'Unsuccessful ' + options.task
                   + ' (' + options.xhr.status + '): ' 
                   + model.constructor.name + ' "' + model.get('name') + '"';
        this.rodanChannel.request(Events.REQUEST__DISPLAY_MESSAGE, {text: text});
    }
}
BaseModel.prototype.idAttribute = 'uuid';

export default BaseModel;
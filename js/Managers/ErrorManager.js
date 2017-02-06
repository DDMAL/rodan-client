import Backbone from 'backbone';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';
import ViewError from 'js/Views/Master/Error/ViewError';

/**
 * General error manager.
 */
export default class ErrorHandler
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor()
    {
        window.onerror = (errorText, url, lineNumber, columnNumber, error) => this._handleJavaScriptError(errorText, url, lineNumber, columnNumber, error);
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__SYSTEM_HANDLE_ERROR, (options) => this._handleError(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles Javscript error.
     */
    _handleJavaScriptError(errorText, url, lineNumber, columnNumber, error)
    {
        var text = 'Rodan Client has encountered an unexpected error.<br><br>';
        text += 'text: ' + errorText + '<br>';
        text += 'url: ' + url + '<br>';
        text += 'line: ' + lineNumber + '<br>';
        text += 'column: ' + columnNumber;
        this._showErrorView(text, error);
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
                var error = options.response.responseJSON
                var text = error.error_code + '<br>';
                text += error.details[0];
                Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__SERVER_ERROR, {json: error});
     //           this._showRodanErrorView(text, error);
            }
            else
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
                this._showRodanErrorView(message, null);
            }
        }
        else
        {
            this._showErrorView(response.statusText, null);
        }
    }

    /**
     * Show error view.
     */
    _showErrorView(text, error)
    {
        var log = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__LOG);
        var model = new Backbone.Model({text: text, error: error, log: log});
        var view = new ViewError({model: model, template: '#template-modal_error'});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_SHOW, {content: view, title: 'Error'});
    }

    /**
     * Show Rodan error view.
     */
    _showRodanErrorView(text, error)
    {
        var log = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__LOG);
        var model = new Backbone.Model({text: text, error: error, log: log});
        var view = new ViewError({model: model, template: '#template-rodan_error'});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MODAL_SHOW, {content: view, title: 'Error'});
    }
}
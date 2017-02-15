import $ from 'jquery';
import BaseController from 'js/Controllers/BaseController';
import Configuration from 'js/Configuration';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';
import saveAs from 'file-saver';

/**
 * Download controller.
 */
export default class ControllerDownload extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     */
    initialize()
    {
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Event bindings.
     */
    _initializeRadio()
    {
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__DOWNLOAD_START, (options) => this._handleRequestDownloadStart(options));
    }

    /**
     * Handle download start.
     */
    _handleRequestDownloadStart(options)
    {
        var data = options.data;
        var filename = options.filename;
        var mimetype = options.mimetype;
        var blob = new Blob([data], {type: mimetype});
        saveAs(blob, filename);
    }
}
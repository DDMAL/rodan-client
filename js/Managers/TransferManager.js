import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import saveAs from 'filesaver';

import Events from '../Shared/Events';

/**
 * Transfer manager.
 */
class TransferManager
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(options)
    {
        this._initializeRadio();
        this._uploads = {pending: [], failed: [], completed: []};
        this._totalUploads = 0; // TODO: fix holes in pending array
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
        this.rodanChannel.reply(Events.REQUEST__TRANSFERMANAGER_DOWNLOAD, options => this._handleRequestDownload(options));
        this.rodanChannel.reply(Events.REQUEST__TRANSFERMANAGER_MONITOR_UPLOAD, options => this._handleRequestMonitorUpload(options));
    }

    /**
     * Handle download request.
     */
    _handleRequestDownload(options)
    {
        var request = new XMLHttpRequest();
        request.open('GET', options.url, true);
        request.responseType = 'blob';
        request.onreadystatechange = (event) => this._handleStateChange(event, options.filename, options.mimetype);
        request.onprogress = (event) => this._handleDownloadProgress(event);
        request.send();
    }

    /**
     * Handle request monitor upload.
     */
    _handleRequestMonitorUpload(options)
    {
        var request = options.request;
        request.uploadId = this._totalUploads;
        this._totalUploads++;
        this._uploads.pending[request.uploadId] = options;
        request.done((response, code, jqXHR) => this._handleUploadSuccess(response, code, jqXHR));
        request.fail((jqXHR, code, error) => this._handleUploadFail(jqXHR, code, error));
    }

    /**
     * Handle upload success.
     */
    _handleUploadSuccess(response, code, jqXHR)
    {
        var file = this._uploads.pending[jqXHR.uploadId].file;
        this._uploads.completed.push(this._uploads.pending[jqXHR.uploadId]);
        delete this._uploads.pending[jqXHR.uploadId];
        this.rodanChannel.trigger(Events.EVENT__TRANSFERMANAGER_UPLOAD_SUCCEEDED, {request: jqXHR, file: file});
    }

    /**
     * Handle upload fail.
     */
    _handleUploadFail(jqXHR, code, error)
    {
        var file = this._uploads.pending[jqXHR.uploadId].file;
        this._uploads.failed.push(this._uploads.pending[jqXHR.uploadId]);
        delete this._uploads.pending[jqXHR.uploadId];
        this.rodanChannel.trigger(Events.EVENT__TRANSFERMANAGER_UPLOAD_FAILED, {request: jqXHR, file: file});
    }

    /**
     * Handle request state change.
     */
    _handleStateChange(event, filename, mimetype)
    {
        var request = event.currentTarget;
        switch (request.readyState)
        {
            case 0: //UNSENT
            {
                break;
            }

            case 1: //OPENED
            {
                break;
            }

            case 2: //HEADERS_RECEIVED
            {
                break;
            }

            case 3: //LOADING
            {
                break;
            }

            case 4:
            {
                var blob = new Blob([request.response], {type: mimetype});
                saveAs(blob, filename);
                break;
            }

            default:
            {
                break;
            }
        }
    }

    /**
     * Handle download progress.
     */
    _handleDownloadProgress(event)
    {
    }
}

export default TransferManager;
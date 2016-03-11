import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import saveAs from 'filesaver';

import Events from '../Shared/Events';

/**
 * Download manager.
 */
class DownloadManager
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
        this.rodanChannel.reply(Events.REQUEST__DOWNLOADMANAGER_DOWNLOAD, options => this._handleRequestDownload(options));
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

export default DownloadManager;
import Radio from 'backbone.radio';

import BaseCollection from '../BaseCollection';
import Events from '../../Shared/Events';

/**
 * Global collections that should be loaded on startup.
 * These are not expected to change during the lifetime of a session.
 * They are also customized to get non-paginated results.
 */
class GlobalCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
     initialize(options)
     {
        super.initialize(options);
        this._allowPagination = false;
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
        this.rodanChannel.reply(this.loadCommand, options => this._retrieveList(options));
        this.rodanChannel.reply(this.requestCommand, () => this._handleRequestInstance());
    }

    /**
     * Returns this instance.
     */
    _handleRequestInstance()
    {
        return this;
    }

    /**
     * Retrieves list.
     */
    _retrieveList(options)
    {
        options = options ? options : {};
        this.reset();
        var data = options.hasOwnProperty('data') ? options.data : {};
        if (!this._allowPagination)
        {
            data.disable_pagination = true;
        }
        options.data = data;
        options = this._applyResponseHandlers(options);
        this.url = this.rodanChannel.request(Events.REQUEST__SERVER_GET_ROUTE, this.route);
        this.fetch(options);
    }
}

export default GlobalCollection;
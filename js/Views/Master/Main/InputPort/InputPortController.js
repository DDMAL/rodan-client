import BaseController from '../../../../Controllers/BaseController';
import Events from '../../../../Shared/Events';
import InputPortCollection from '../../../../Collections/InputPortCollection';

/**
 * Controller for InputPorts.
 */
class InputPortController extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.reply(Events.REQUEST__INPUTPORTS_SYNC, options => this._handleRequestSync(options));
        this._rodanChannel.reply(Events.REQUEST__INPUTPORTS_LOAD, options => this._handleRequestInputPorts(options));
    }

    /**
     * Handle add success.
     */
    _handleRequestSync()
    {
        this._collection.syncList();
    }

    /**
     * Handle request InputPorts.
     */
    _handleRequestInputPorts(options)
    {
        this._collection = new InputPortCollection();
        this._collection.fetch(options);
        this._rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__INPUTPORTS_SYNC, 
                                                                       options: {}, 
                                                                       callback: null});
        return this._collection;
    }
}

export default InputPortController;
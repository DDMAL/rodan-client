import GlobalCollection from './GlobalCollection';
import Events from '../../Shared/Events';
import InputPortType from '../../Models/InputPortType';

let _instance = null;

/**
 * Global Collection of InputPortType models. This uses a pseudo-singleton model so we can inherit from BaseCollection.
 */
export default class GlobalInputPortTypeCollection extends GlobalCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance. As this class is a singleton, an Error will be thrown if called more than once.
     *
     * @throws {Error} thrown iff called more than once
     */
    initialize()
    {
        if (_instance)
        {
            throw new Error('only one instance of this class may exist');
        }
        _instance = this;
        /** @ignore */
        this.model = InputPortType;
        this._route = 'inputporttypes';
        this._loadCommand = Events.REQUEST__GLOBAL_INPUTPORTTYPES_LOAD;
        this._requestCommand = Events.REQUEST__GLOBAL_INPUTPORTTYPE_COLLECTION;
    }
}
import GlobalCollection from './GlobalCollection';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import OutputPortType from 'js/Models/OutputPortType';

let _instance = null;

/**
 * Global Collection of OutputPortType models.
 * This uses a pseudo-singleton model so we can inherit from BaseCollection.
 */
export default class GlobalOutputPortTypeCollection extends GlobalCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
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
        this.model = OutputPortType;
        this._route = 'outputporttypes';
        this._loadCommand = RODAN_EVENTS.REQUEST__GLOBAL_OUTPUTPORTTYPES_LOAD;
        this._requestCommand = RODAN_EVENTS.REQUEST__GLOBAL_OUTPUTPORTTYPE_COLLECTION;
    }
}
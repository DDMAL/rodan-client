import BaseCollection from './BaseCollection';
import Resource from '../Models/Resource';

/**
 * Collection of Resource models.
 */
export default class ResourceCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     */
    initialize()
    {
        /** @ignore */
        this.model = Resource;
        this._route = 'resources';
    }
}
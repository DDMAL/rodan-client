import GlobalCollection from './GlobalCollection';
import RODAN_EVENTS from '../../Shared/RODAN_EVENTS';
import Job from '../../Models/Job';

let _instance = null;

/**
 * Global Collection of Job models.
 * This uses a pseudo-singleton model so we can inherit from BaseCollection.
 */
export default class GlobalJobCollection extends GlobalCollection
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
        this.model = Job;
        this._route = 'jobs';
        this._loadCommand = RODAN_EVENTS.REQUEST__GLOBAL_JOBS_LOAD;
        this._requestCommand = RODAN_EVENTS.REQUEST__GLOBAL_JOB_COLLECTION;
        this._enumerations = [{field: 'category', label: 'Category'},
                             {field: 'interactive', label: 'Interactive', values: [{value: 'True', label: 'True'},
                                                                                   {value: 'False', label: 'False'}]}];
    }
}
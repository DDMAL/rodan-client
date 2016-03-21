import GlobalCollection from './GlobalCollection';
import Events from '../../Shared/Events';
import Job from '../../Models/Job';

let _instance = null;

/**
 * Global Collection of Job models.
 * This uses a pseudo-singleton model so we can inherit from BaseCollection.
 */
class GlobalJobCollection extends GlobalCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        if (_instance)
        {
            throw new Error('only one instance of this class may exist');
        }
        _instance = this;
        this.model = Job;
        this.route = 'jobs';
        this.loadCommand = Events.REQUEST__GLOBAL_JOBS_LOAD;
        this.requestCommand = Events.REQUEST__GLOBAL_JOB_COLLECTION;
        this.enumerations = [{field: 'category', label: 'Category'},
                             {field: 'interactive', label: 'Interactive', values: [{value: 'True', label: 'True'},
                                                                                   {value: 'False', label: 'False'}]}];
    }
}

export default GlobalJobCollection;
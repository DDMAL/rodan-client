import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import Job from '../Models/Job';

/**
 * Collection of Job models.
 */
class JobCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = Job;
        this.route = 'jobs';
        this.enumerations = [{field: 'category', label: 'Category'},
                             {field: 'interactive', label: 'Interactive', values: [{value: 'True', label: 'True'},
                                                                                   {value: 'False', label: 'False'}]}];
    }
}

export default JobCollection;
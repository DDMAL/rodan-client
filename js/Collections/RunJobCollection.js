import BaseCollection from './BaseCollection';
import RunJob from '../Models/RunJob';

/**
 * Collection of RunJob models.
 */
class RunJobCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = RunJob;
        this.route = 'runjobs';
        this.enumerations = [{field: 'status', label: 'Status', values: [{value: -1, label: 'Failed'},
                                                                         {value: 0, label: 'Scheduled'},
                                                                         {value: 1, label: 'Processing'},
                                                                         {value: 2, label: 'Waiting for input'},
                                                                         {value: 4, label: 'Finished'},
                                                                         {value: 8, label: 'Expired'},
                                                                         {value: 9, label: 'Cancelled'},
                                                                         {value: 11, label: 'Retrying'}]}];
    }
}

export default RunJobCollection;
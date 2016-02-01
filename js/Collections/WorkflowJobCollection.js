import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import WorkflowJob from '../Models/WorkflowJob';

/**
 * Collection of WorkflowJob models.
 */
class WorkflowJobCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = WorkflowJob;
        this.route = 'workflowjobs';
    }
}

export default WorkflowJobCollection;
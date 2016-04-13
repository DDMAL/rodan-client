import BaseCollection from './BaseCollection';
import WorkflowRun from '../Models/WorkflowRun';

/**
 * Collection of WorkflowRun models.
 */
class WorkflowRunCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = WorkflowRun;
        this.route = 'workflowruns';
    }
}

export default WorkflowRunCollection;
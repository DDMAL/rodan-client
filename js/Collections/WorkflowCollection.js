import BaseCollection from './BaseCollection';
import Workflow from '../Models/Workflow';

/**
 * Collection of Workflow models.
 */
class WorkflowCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = Workflow;
        this.route = 'workflows';
    }
}

export default WorkflowCollection;
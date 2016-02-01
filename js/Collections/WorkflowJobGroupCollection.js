import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import WorkflowJobGroup from '../Models/WorkflowJobGroup';

/**
 * Collection of WorkflowJobGroup models.
 */
class WorkflowJobGroupCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = WorkflowJobGroup;
        this.route = 'workflowjobgroups';
    }
}

export default WorkflowJobGroupCollection;
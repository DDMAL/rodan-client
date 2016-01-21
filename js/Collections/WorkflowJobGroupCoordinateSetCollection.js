import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import WorkflowJobGroupCoordinateSet from '../Models/WorkflowJobGroupCoordinateSet';

/**
 * Collection of WorkflowJobGroupCoordinateSet models.
 */
class WorkflowJobGroupCoordinateSetCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = WorkflowJobGroupCoordinateSet;
        this.route = 'workflowjobgroupcoordinatesets';
        this.loadCommand = Events.REQUEST__WORKFLOWJOBGROUPCOORDINATESETS_LOAD;
        this.requestCommand = Events.REQUEST__WORKFLOWJOBGROUPCOORDINATESET_COLLECTION;
    }
}

export default WorkflowJobGroupCoordinateSetCollection;
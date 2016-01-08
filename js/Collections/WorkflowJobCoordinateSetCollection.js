import BaseCollection from './BaseCollection';
import Events from '../Shared/Events';
import WorkflowJobCoordinateSet from '../Models/WorkflowJobCoordinateSet';

/**
 * Collection of WorkflowJobCoordinateSet models.
 */
class WorkflowJobCoordinateSetCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = WorkflowJobCoordinateSet;
        this.route = 'workflowjobcoordinatesets';
        this.loadCommand = Events.REQUEST__WORKFLOWJOBCOORDINATESETS_LOAD;
        this.requestCommand = Events.REQUEST__WORKFLOWJOBCOORDINATESET_COLLECTION;
    }
}

export default WorkflowJobCoordinateSetCollection;
import Rodan from 'rodan';

/**
 * WorkflowJobGroupCoordinateSet.
 */
class WorkflowJobGroupCoordinateSet extends Rodan.BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.routeName = 'workflowjobgroupcoordinatesets';
    }

    /**
     * Parse response from server.
     */
    parse(response)
    {
        if (!response.results)
        {
            return response;
        }
        else if (response.results.length > 1)
        {
            throw new Error('received multiple results for individual model');
        }
        return response.results[0];
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default WorkflowJobGroupCoordinateSet;
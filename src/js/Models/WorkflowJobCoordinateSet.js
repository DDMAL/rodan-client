import Rodan from 'rodan';

/**
 * WorkflowJobCoordinateSet.
 */
class WorkflowJobCoordinateSet extends Rodan.BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.routeName = 'workflowjobcoordinatesets';
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

export default WorkflowJobCoordinateSet;
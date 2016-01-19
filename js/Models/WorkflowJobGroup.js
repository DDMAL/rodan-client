import BaseModel from './BaseModel';
import Events from '../Shared/Events';
import InputPortCollection from '../Collections/InputPortCollection';
import OutputPortCollection from '../Collections/OutputPortCollection';

/**
 * Represents a WorkflowJobGroup.
 */
class WorkflowJobGroup extends BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize
     */
    initialize(aParameters)
    {
        this.routeName = 'workflowjobgroups';
    }

    defaults()
    {
        return {name: 'untitled'};
    }

    /**
     * Initialize.
     */
    parse(resp)
    {
        return resp;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default WorkflowJobGroup;
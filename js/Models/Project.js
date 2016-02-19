import BaseModel from './BaseModel';

/**
 * Project model.
 */
class Project extends BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.routeName = 'projects';
    }

    /**
     * Set the resource type.
     */
    parse(resp)
    {
        resp = super.parse(resp);
        if (!resp.workflow_count)
        {
            resp.workflow_count = resp.workflows.length;
        }
        return resp;
    }

    /**
     * Return defaults.
     */
    defaults()
    {
        return {creator: {username: null},
                created: null,
                updated: null,
                workflow_count: null,
                resource_count: null,
                name: 'untitled'};
    }
}

export default Project;
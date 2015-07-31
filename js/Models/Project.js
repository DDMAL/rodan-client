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
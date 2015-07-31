import Backbone from 'backbone';
import Radio from 'backbone.radio';

import Events from '../Shared/Events';
import Project from '../Models/Project';

/**
 * Project collection.
 */
class ProjectCollection extends Backbone.Collection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = Project;
        this._initializeRadio();
    }

    /**
     * Parse.
     */
    parse(resp)
    {
        return resp.results;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.comply(Events.COMMAND__PROJECTS_LOAD, aQueryParameters => this._retrieveList(aQueryParameters));
        this.rodanChannel.reply(Events.REQUEST__PROJECT_COLLECTION, () => this._handleRequestInstance());
    }

    /**
     * Retrieves list.
     */
    _retrieveList(aQueryParameters)
    {
        this.reset();
        this.url = this.rodanChannel.request(Events.REQUEST__SERVER_ROUTE, 'projects');
        this.fetch({ data: $.param(aQueryParameters) });
    }

    /**
     * Returns this instance.
     */
    _handleRequestInstance()
    {
        return this;
    }
}

export default ProjectCollection;
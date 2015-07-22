import $ from 'jquery';
import Backbone from 'backbone';
import Radio from 'backbone.radio';

import Events from '../Shared/Events';
import WorkflowJob from '../Models/WorkflowJob';

class WorkflowJobCollection extends Backbone.Collection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize()
    {
        this.model = WorkflowJob;
        this._initializeRadio();
    }

    /**
     * TODO docs
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
        //this.rodanChannel.comply(Events.COMMAND__LOAD_WORKFLOWS, aQueryParameters => this._retrieveList(aQueryParameters));
        //this.rodanChannel.reply(Events.REQUEST__COLLECTION_WORKFLOW, () => this._handleRequestInstance());
    }

    /**
     * Retrieves list.
     */
    _retrieveList(aQueryParameters)
    {
        this.url = this.rodanChannel.request(Events.REQUEST__SERVER_ROUTE, 'workflow_jobs');
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

export default WorkflowJobCollection;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../Shared/VISRC_Events';
import VISRC_WorkflowRun from '../Models/VISRC_WorkflowRun';

class VISRC_WorkflowRunCollection extends Backbone.Collection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.model = VISRC_WorkflowRun;
        this._initializeRadio();
    }

    /**
     * TODO docs
     */
    parse(resp, options)
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
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.comply(VISRC_Events.COMMAND__LOAD_WORKFLOWRUNS, aQueryParameters => this._retrieveList(aQueryParameters));
        this.rodanChannel.on(VISRC_Events.EVENT__APPLICATION_READY, () => this._handleEventApplicationReady());
        this.rodanChannel.reply(VISRC_Events.REQUEST__COLLECTION_WORKFLOWRUN, () => this._handleRequestInstance());
    }

    /**
     * Retrieves list.
     */
    _retrieveList(aQueryParameters)
    {
        this.fetch({ data: $.param(aQueryParameters) });
    }

    /**
     * Returns this instance.
     */
    _handleRequestInstance()
    {
        return this;
    }

    /**
     * Handles application ready notification.
     */
    _handleEventApplicationReady()
    {
        var appInstance = this.rodanChannel.request(VISRC_Events.REQUEST__APPLICATION);
        this.url = appInstance.controllerServer.routeForRouteName('workflowruns');
    }
}

export default VISRC_WorkflowRunCollection;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import VISRC_Configuration from '../VISRC_Configuration';
import VISRC_BaseModel from './VISRC_BaseModel';
import VISRC_InputPortCollection from '../Collections/VISRC_InputPortCollection';
import VISRC_OutputPortCollection from '../Collections/VISRC_OutputPortCollection';

/**
 * Represents a VIS WorkflowJob model.
 */
class VISRC_WorkflowJob extends VISRC_BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    constructor(aParameters)
    {
        this.idAttribute = 'uuid';
        this.url = VISRC_Configuration.server + "/workflowjobs/";
        super(aParameters);
    }

    defaults()
    {
        return {input_ports: null, output_ports: null};
    }

    /**
     * TODO docs
     */
    parse(resp, options)
    {
        resp.input_ports = new VISRC_InputPortCollection(resp.input_ports);
        resp.output_ports = new VISRC_OutputPortCollection(resp.output_ports);
        return resp;
    }

    /**
     * Returns UUID of associated job.
     */
    getJobUuid()
    {
        var lastSlash = this.get("job").lastIndexOf('/');
        var subString = this.get("job").substring(0, lastSlash);
        var secondLastSlash = subString.lastIndexOf('/');
        return this.get("job").substring(secondLastSlash + 1, lastSlash);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_WorkflowJob;
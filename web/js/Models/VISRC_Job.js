import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import VISRC_Configuration from '../VISRC_Configuration';
import VISRC_BaseModel from './VISRC_BaseModel';
import VISRC_InputPortTypeCollection from '../Collections/VISRC_InputPortTypeCollection';
import VISRC_OutputPortTypeCollection from '../Collections/VISRC_OutputPortTypeCollection';

/**
 * TODO docs.
 */
class VISRC_Job extends VISRC_BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    constructor(data)
    {
        this.idAttribute = 'uuid';
        this.url = VISRC_Configuration.server + "/jobs/";
        super(data);
        this.set("input_port_types", new VISRC_InputPortTypeCollection(data.input_port_types));
        this.set("output_port_types", new VISRC_OutputPortTypeCollection(data.output_port_types));
    }

    defaults()
    {
        return {input_port_types: null, output_port_types: null};
    }

    /**
     * TODO docs
     */
    parse(resp, options)
    {
        resp.input_port_types = new VISRC_InputPortTypeCollection(resp.input_port_types);
        resp.output_port_types = new VISRC_OutputPortTypeCollection(resp.output_port_types);
        return resp;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_Job;
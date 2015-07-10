import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

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
    initialize(aParameters)
    {
        this.routeName = "jobs";
        this.set("input_port_types", new VISRC_InputPortTypeCollection(aParameters.input_port_types));
        this.set("output_port_types", new VISRC_OutputPortTypeCollection(aParameters.output_port_types));
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
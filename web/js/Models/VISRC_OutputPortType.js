import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import VISRC_Configuration from '../VISRC_Configuration';
import VISRC_BaseModel from './VISRC_BaseModel';

/**
 * OutputPortType.
 */
class VISRC_OutputPortType extends VISRC_BaseModel
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
        this.url = VISRC_Configuration.server + "/outputporttypes/";
        super(data);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_OutputPortType;
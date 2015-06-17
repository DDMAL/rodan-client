import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import VISRC_Configuration from '../VISRC_Configuration';
import VISRC_BaseModel from './VISRC_BaseModel';

/**
 * InputPortType.
 */
class VISRC_InputPortType extends VISRC_BaseModel
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
        this.url = VISRC_Configuration.server+ "/inputporttypes/";
        super(data);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_InputPortType;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_BaseModel from './VISRC_BaseModel';
import VISRC_InputPortTypeCollection from '../Collections/VISRC_InputPortTypeCollection';
import VISRC_OutputPortTypeCollection from '../Collections/VISRC_OutputPortTypeCollection';

/**
 * ResourceType
 */
class VISRC_ResourceType extends VISRC_BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.routeName = "resourcetypes";
    }

    /**
     * TODO docs
     */
    parse(resp, options)
    {
        return resp;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_ResourceType;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import BaseModel from './BaseModel';
import InputPortTypeCollection from '../Collections/InputPortTypeCollection';
import OutputPortTypeCollection from '../Collections/OutputPortTypeCollection';

/**
 * ResourceType
 */
class ResourceType extends BaseModel
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

export default ResourceType;
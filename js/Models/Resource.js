import Backbone from 'backbone';
import _ from 'underscore';

import BaseModel from './BaseModel';

/**
 * Resource model.
 */
class Resource extends BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize()
    {
        this.routeName = 'resources';
    }

    defaults()
    {
        return {resource_type: null};
    }

    /**
     * Set the resource type.
     */
    parse(resp)
    {
        return resp;
    }

    /**
     * Override of sync. We do this to allow file uploads.
     */
    sync(aMethod, aModel, aOptions)
    {
        if (aMethod === 'create')
        {
            var formData = new FormData();
            formData.append('project', aModel.get('project'));
            formData.append('files', aModel.get('file'));

            // Set processData and contentType to false so data is sent as FormData
            _.defaults(aOptions || (aOptions = {}), {
                url: this.url(),
                data: formData,
                processData: false,
                contentType: false
            });
        }
        Backbone.sync.call(this, aMethod, aModel, aOptions);
    }

    /**
     * Returns UUID of associated ResourceType.
     */
    getResourceTypeUuid()
    {
        var lastSlash = this.get('resource_type').lastIndexOf('/');
        var subString = this.get('resource_type').substring(0, lastSlash);
        var secondLastSlash = subString.lastIndexOf('/');
        return this.get('resource_type').substring(secondLastSlash + 1, lastSlash);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default Resource;
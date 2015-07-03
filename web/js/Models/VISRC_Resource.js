import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import _ from 'underscore';

import VISRC_BaseModel from './VISRC_BaseModel';

/**
 * Resource model.
 */
class VISRC_Resource extends VISRC_BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.routeName = "resources";
    }

    /**
     * Override of sync. We do this to allow file uploads.
     */
    sync(aMethod, aModel, aOptions)
    {
        if (aMethod === "create")
        {
            var formData = new FormData();
            formData.append("project", aModel.get("project"));
            formData.append("files", aModel.get("file"));

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

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default VISRC_Resource;
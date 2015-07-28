import Backbone from 'backbone';
import _ from 'underscore';

import BaseModel from './BaseModel';
import Events from '../Shared/Events';

/**
 * Resource model.
 */
class Resource extends BaseModel
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(aParameters)
    {
        this.resourceTypeCollection = this.rodanChannel.request(Events.REQUEST__COLLECTION_RESOURCETYPE);
        this.routeName = 'resources';
        this._updateResourceTypeFull();
        this.on('change:resource_type', () => this._updateResourceTypeFull());
    }

    /**
     * Set the resource type.
     */
    parse(resp)
    {
        return resp;
    }

    /**
     * Defaults
     */

    defaults()
    {
        return {
            creator: {first_name: null, last_name: null, username: null},
            created: null,
            updated: null
        };
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
        if (this.get('resource_type') !== undefined)
        {
            var lastSlash = this.get('resource_type').lastIndexOf('/');
            var subString = this.get('resource_type').substring(0, lastSlash);
            var secondLastSlash = subString.lastIndexOf('/');
            return this.get('resource_type').substring(secondLastSlash + 1, lastSlash);
        }
        return null;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Updates full description of resource type.
     */
    _updateResourceTypeFull()
    {
        var resourceTypeId = this.getResourceTypeUuid();
        var jsonString = {};
        if (resourceTypeId !== null)
        {
            jsonString = this.resourceTypeCollection.get(resourceTypeId).toJSON();
        }
        this.set('resource_type_full', jsonString); 
    }
}

export default Resource;
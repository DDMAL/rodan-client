import Backbone from 'backbone';
import Radio from 'backbone.radio';
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
    initialize()
    {
        this.rodanChannel = Radio.channel('rodan'); // TODO - this is a hack; need to find better way of managing radio channels in general
        this.resourceTypeCollection = this.rodanChannel.request(Events.REQUEST__GLOBAL_RESOURCETYPE_COLLECTION);
        this.routeName = 'resources';
        this._updateResourceTypeFull();
        this.on('change:resource_type', () => this._updateResourceTypeFull());

        // If the creator is null (i.e. was not uploaded by a person), inject a dummy.
        if (this.get('creator') === null)
        {
            this.set('creator', 'generated result');
        }
    }

    /**
     * Set the resource type.
     */
    parse(resp)
    {
        // If the creator is null (i.e. was not uploaded by a person), inject a dummy.
        // TODO not sure why this is just happening here...
        if (resp.creator === null)
        {
            resp.creator = 'generated result';
        }
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
    sync(method, model, options)
    {
        if (method === 'create')
        {
            var formData = new FormData();
            formData.append('project', model.get('project'));
            formData.append('files', model.get('file'));

            // Set processData and contentType to false so data is sent as FormData
            _.defaults(options || (options = {}), {
                url: this.url(),
                data: formData,
                processData: false,
                contentType: false
            });
        }
        Backbone.sync.call(this, method, model, options);
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
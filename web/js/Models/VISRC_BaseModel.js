import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../Shared/VISRC_Events'

/**
 * Base VISRC model
 */
class VISRC_BaseModel extends Backbone.Model
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(aParameters)
    {
        this.idAttribute = 'uuid';
        this._initializeRadio();
        super(aParameters);
    }

    /**
     * URL override to add trailing slash.
     * Also, the URL will depend if this model instance has been saved or not.
     * If not saved, we have to use the plural route for the model to save it.
     * That's the way Rodan works. :)
     */
    url()
    {
        var id = this.get("uuid");
        var original_url = this.rodanChannel.request(VISRC_Events.REQUEST__SERVER_ROUTE, this.routeName);
        if (typeof this.get("uuid") !== "undefined")
        {
            original_url = this.get("url");
        }
        var parsed_url = original_url + ( original_url.charAt( original_url.length - 1 ) == '/' ? '' : '/' );
        return parsed_url;
    }


///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
    }
}

export default VISRC_BaseModel;
import Backbone from 'backbone';
import Radio from 'backbone.radio';

import Events from '../Shared/Events';

/**
 * Base VISRC model
 */
class BaseModel extends Backbone.Model
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
        this.on('change', aEvent => this._onChange(aEvent));
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
        var original_url = this.rodanChannel.request(Events.REQUEST__SERVER_ROUTE, this.routeName);
        if (typeof this.get('uuid') !== 'undefined')
        {
            original_url = this.get('url');
        }
        var parsed_url = original_url + ( original_url.charAt( original_url.length - 1 ) === '/' ? '' : '/' );
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
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * On change handler.
     */
    _onChange()
    {
        this.rodanChannel.trigger(Events.EVENT__MODEL_HASCHANGED, {model: this});
    }
}

export default BaseModel;
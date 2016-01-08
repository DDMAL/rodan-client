import _ from 'underscore';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * Resource list view.
 */
class ViewResourceList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
    {
        this._initializeRadio();
        this.collection = this._rodanChannel.request(Events.REQUEST__RESOURCE_COLLECTION);
        this._rodanChannel.request(Events.REQUEST__RESOURCES_LOAD, {query: options.query});
        /*this._rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__RESOURCES_SYNC, 
                                                                      options: {query: options.query}, 
                                                                      callback: null});*/
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel('rodan');
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewResourceList.prototype.modelEvents = {
    'all': 'render'
};
ViewResourceList.prototype.ui = {
};
ViewResourceList.prototype.events = {
};
ViewResourceList.prototype.childViewContainer = 'tbody';
ViewResourceList.prototype.behaviors = {Table: {'table': '#table-resources'}};

export default ViewResourceList;
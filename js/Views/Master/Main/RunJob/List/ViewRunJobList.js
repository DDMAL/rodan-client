import _ from 'underscore';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * RunJob list view.
 */
class ViewRunJobList extends Marionette.CompositeView
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
        this.collection = this._rodanChannel.request(Events.REQUEST__RUNJOB_COLLECTION);
        this._rodanChannel.request(Events.COMMAND__LOAD_RUNJOBS, {query: options.query});
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
ViewRunJobList.prototype.modelEvents = {
    'all': 'render'
};
ViewRunJobList.prototype.collectionEvents = {
    'all': 'render'
};
ViewRunJobList.prototype.childViewContainer = 'tbody';

export default ViewRunJobList;
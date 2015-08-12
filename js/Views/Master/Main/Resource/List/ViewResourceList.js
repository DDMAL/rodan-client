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
    initialize(aOptions)
    {
        this._initializeRadio();
        this.collection = this._rodanChannel.request(Events.REQUEST__RESOURCE_COLLECTION);
        this._rodanChannel.request(Events.COMMAND__RESOURCES_LOAD, {query: {project: aOptions.project.id}});
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
ViewResourceList.prototype.childViewContainer = 'tbody';

export default ViewResourceList;
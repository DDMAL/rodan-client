import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewResourceListItem from './ViewResourceListItem';

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
        this.modelEvents = {
            'all': 'render'
        };
        this.template = '#template-main_resource_list';
        this.childView = ViewResourceListItem;
        this.childViewContainer = 'tbody';
        this.collection = this._rodanChannel.request(Events.REQUEST__RESOURCE_COLLECTION);
        this._rodanChannel.command(Events.COMMAND__RESOURCES_LOAD, {project: aOptions.project.id});
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

export default ViewResourceList;
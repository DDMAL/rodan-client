import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../Shared/Events';
import ViewResourceListItem from './ViewResourceListItem';

/**
 * This class represents the view (and controller) for the resource list.
 */
class ViewResourceList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.modelEvents = {
            'all': 'render'
        };
        this._initializeRadio();
        this.template = '#template-main_workflowrun_newworkflowrun_resource_list';
        this.childView = ViewResourceListItem;
        this.childViewContainer = 'tbody';
        this._workflow = aParameters.workflow;
        var project = this.rodanChannel.request(Events.REQUEST__PROJECT_ACTIVE);
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_RESOURCE);
        this.collection.reset();
        this.rodanChannel.command(Events.COMMAND__LOAD_RESOURCES, {project: project.id});
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
}

export default ViewResourceList;
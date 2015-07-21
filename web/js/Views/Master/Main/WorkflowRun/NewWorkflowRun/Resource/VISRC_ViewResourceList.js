import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../Shared/VISRC_Events';
import VISRC_ViewResourceListItem from './VISRC_ViewResourceListItem';

/**
 * This class represents the view (and controller) for the resource list.
 */
class VISRC_ViewResourceList extends Marionette.CompositeView
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
            "all": "render"
        };
        this._initializeRadio();
        this.template = "#template-main_workflowrun_newworkflowrun_resource_list";
        this.childView = VISRC_ViewResourceListItem;
        this.childViewContainer = 'tbody';
        this._workflow = aParameters.workflow;
        var project = this.rodanChannel.request(VISRC_Events.REQUEST__PROJECT_ACTIVE);
        this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_RESOURCE);
        this.collection.reset();
        this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_RESOURCES, {project: project.id});
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

export default VISRC_ViewResourceList;
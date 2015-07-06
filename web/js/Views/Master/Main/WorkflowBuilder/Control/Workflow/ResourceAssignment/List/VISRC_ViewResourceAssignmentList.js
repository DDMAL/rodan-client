import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../../../Shared/VISRC_Events';
import VISRC_ViewResourceAssignmentListItem from './VISRC_ViewResourceAssignmentListItem';

/**
 * This class represents the collection view for resource assignment.
 */
class VISRC_ViewResourceAssignmentList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize()
    {
        this.modelEvents = {
            "all": "render"
        };
        this._initializeRadio();
        this.childViewContainer = 'tbody';
        this.template = "#template-main_workflowbuilder_control_resourceassignment_list";
        this.childView = VISRC_ViewResourceAssignmentListItem;
        var project = this.rodanChannel.request(VISRC_Events.REQUEST__PROJECT_ACTIVE);
        this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_RESOURCE);
        this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_RESOURCES, {project: project.id});
    }

    /**
     * Initially show the list.
     */
    onBeforeShow()
    {
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

export default VISRC_ViewResourceAssignmentList;
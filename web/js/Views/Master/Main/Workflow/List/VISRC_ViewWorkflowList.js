import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_ViewWorkflowListItem from './VISRC_ViewWorkflowListItem';

/**
 * This class represents a list view of workflows
 */
class VISRC_ViewWorkflowList extends Marionette.CompositeView
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
        this.template = "#template-main_workflow_list";
        this.childView = VISRC_ViewWorkflowListItem;
        this.childViewContainer = 'tbody';
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
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWS_SELECTED, () => this._handleEventListSelected());
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        var project = this.rodanChannel.request(VISRC_Events.REQUEST__PROJECT_ACTIVE);
        this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_WORKFLOW);
        this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_WORKFLOWS, {project: project.id});
    }
}

export default VISRC_ViewWorkflowList;
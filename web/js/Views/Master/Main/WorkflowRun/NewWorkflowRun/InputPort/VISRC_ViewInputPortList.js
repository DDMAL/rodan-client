import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../Shared/VISRC_Events';
import VISRC_ViewInputPortListItem from './VISRC_ViewInputPortListItem';

/**
 * This class represents a list of input ports.
 */
class VISRC_ViewInputPortList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this._initializeRadio();
        this.modelEvents = {
            "all": "render"
        };
        this.template = "#template-main_workflowrun_newworkflowrun_inputport_list";
        this.childView = VISRC_ViewInputPortListItem;
        this.childViewContainer = 'tbody';
        this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_INPUTPORT);
        this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_INPUTPORTS, {workflow: aParameters.workflow.id});
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

export default VISRC_ViewInputPortList;
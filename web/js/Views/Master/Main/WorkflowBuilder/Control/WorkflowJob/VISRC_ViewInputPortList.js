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
        this.modelEvents = {
            "all": "render"
        };
        this._initializeRadio();
        this.template = "#template-main_workflowbuilder_control_inputport_list";
        this.childView = VISRC_ViewInputPortListItem;
        this.childViewContainer = 'tbody';
     //   this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_INPUTPORTTYPE);
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
        this.rodanChannel.on(VISRC_Events.EVENT__WORKFLOWBUILDER_WORKFLOWJOB_SELECTED, aReturn => this._handleEventWorkflowJobSelected(aReturn));
    }

    /**
     * Handle workflow job selection.
     */
    _handleEventWorkflowJobSelected(aReturn)
    {
   //     this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_INPUTPORTTYPES, {job: aReturn.workflowjob.getJobUuid()});
    }
}

export default VISRC_ViewInputPortList;
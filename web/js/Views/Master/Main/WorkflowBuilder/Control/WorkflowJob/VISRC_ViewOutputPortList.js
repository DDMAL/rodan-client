import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../Shared/VISRC_Events';
import VISRC_ViewOutputPortListItem from './VISRC_ViewOutputPortListItem';

/**
 * This class represents a list of output ports.
 */
class VISRC_ViewOutputPortList extends Marionette.CompositeView
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
        this.template = "#template-main_workflowbuilder_control_outputport_list";
        this.childView = VISRC_ViewOutputPortListItem;
        this.childViewContainer = 'tbody';
        this.collection = aParameters.workflowjob.get("output_ports");
    }
}

export default VISRC_ViewOutputPortList;
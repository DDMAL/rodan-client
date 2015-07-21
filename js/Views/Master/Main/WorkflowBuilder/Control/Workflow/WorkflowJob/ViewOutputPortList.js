import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../../Shared/Events';
import ViewOutputPortListItem from './ViewOutputPortListItem';

/**
 * This class represents a list of output ports.
 */
class ViewOutputPortList extends Marionette.CompositeView
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
        this.childView = ViewOutputPortListItem;
        this.childViewContainer = 'tbody';
        this.collection = aParameters.workflowjob.get("output_ports");
    }
}

export default ViewOutputPortList;
import Marionette from 'backbone.marionette';

import ViewInputPortListItem from './ViewInputPortListItem';

/**
 * This class represents a list of input ports.
 */
class ViewInputPortList extends Marionette.CompositeView
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
        this.template = '#template-main_workflowbuilder_control_inputport_list';
        this.childView = ViewInputPortListItem;
        this.childViewContainer = 'tbody';
        this.collection = aParameters.workflowjob.get('input_ports');
    }
}

export default ViewInputPortList;
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
        this.collection = aParameters.workflowjob.get('input_ports');
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewInputPortList.prototype.modelEvents = {
    'all': 'render'
};
ViewInputPortList.prototype.template = '#template-main_workflowbuilder_control_inputport_list';
ViewInputPortList.prototype.childView = ViewInputPortListItem;
ViewInputPortList.prototype.childViewContainer = 'tbody';

export default ViewInputPortList;
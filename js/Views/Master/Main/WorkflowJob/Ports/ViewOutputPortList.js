import Marionette from 'backbone.marionette';

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
        this.childView = ViewOutputPortListItem;
        this.collection = aParameters.workflowjob.get('output_ports');
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewOutputPortList.prototype.modelEvents = {
    'all': 'render'
};
ViewOutputPortList.prototype.template = '#template-main_outputport_list';
ViewOutputPortList.prototype.childViewContainer = 'tbody';

export default ViewOutputPortList;
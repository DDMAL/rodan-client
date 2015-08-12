import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../../Shared/Events';
import ViewInputPortTypeListItem from './ViewInputPortTypeListItem';

/**
 * This class represents a list of input port types.
 */
class ViewInputPortTypeList extends Marionette.CompositeView
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
        var jobCollection = this.rodanChannel.request(Events.REQUEST__COLLECTION_JOB);
        var job = jobCollection.get(aParameters.workflowjob.getJobUuid());
        this.collection = job.get('input_port_types');
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewInputPortTypeList.prototype.modelEvents = {
    'all': 'render'
};
ViewInputPortTypeList.prototype.template = '#template-main_workflowbuilder_control_inputporttype_list';
ViewInputPortTypeList.prototype.childView = ViewInputPortTypeListItem;
ViewInputPortTypeList.prototype.childViewContainer = 'tbody';

export default ViewInputPortTypeList;
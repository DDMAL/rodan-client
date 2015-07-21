import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../../Shared/Events';
import ViewOutputPortTypeListItem from './ViewOutputPortTypeListItem';

/**
 * This class represents a list of output port types.
 */
class ViewOutputPortTypeList extends Marionette.CompositeView
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
        this._initializeRadio();
        this.template = '#template-main_workflowbuilder_control_outputporttype_list';
        this.childView = ViewOutputPortTypeListItem;
        this.childViewContainer = 'tbody';
        var jobCollection = this.rodanChannel.request(Events.REQUEST__COLLECTION_JOB);
        var job = jobCollection.get(aParameters.workflowjob.getJobUuid());
        this.collection = job.get('output_port_types');
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

export default ViewOutputPortTypeList;
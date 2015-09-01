import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
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
     * Initialize.
     */
    initialize(options)
    {
        this._initializeRadio();
        var jobCollection = this.rodanChannel.request(Events.REQUEST__COLLECTION_JOB);
        var job = jobCollection.get(options.workflowjob.getJobUuid());
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

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewOutputPortTypeList.prototype.modelEvents = {
    'all': 'render'
};
ViewOutputPortTypeList.prototype.template = '#template-main_outputporttype_list';
ViewOutputPortTypeList.prototype.childView = ViewOutputPortTypeListItem;
ViewOutputPortTypeList.prototype.childViewContainer = 'tbody';

export default ViewOutputPortTypeList;
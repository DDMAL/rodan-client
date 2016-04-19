import Events from '../../../../../Shared/Events';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import ViewOutputPortTypeListItem from './ViewOutputPortTypeListItem';

/**
 * OutputPortTYpe list view.
 */
export default class ViewOutputPortTypeList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object
     */
    initialize(options)
    {
        var jobCollection = Radio.channel('rodan').request(Events.REQUEST__GLOBAL_JOB_COLLECTION);
        var job = jobCollection.get(options.workflowjob.getJobUuid());
        /** @ignore */
        this.collection = job.get('output_port_types');
    }
}
ViewOutputPortTypeList.prototype.modelEvents = {
    'all': 'render'
};
ViewOutputPortTypeList.prototype.template = '#template-main_outputporttype_list';
ViewOutputPortTypeList.prototype.childView = ViewOutputPortTypeListItem;
ViewOutputPortTypeList.prototype.childViewContainer = 'tbody';
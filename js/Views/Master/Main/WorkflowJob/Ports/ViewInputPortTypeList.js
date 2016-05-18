import Marionette from 'backbone.marionette';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';
import ViewInputPortTypeListItem from './ViewInputPortTypeListItem';

/**
 * InputPortType list view.
 */
export default class ViewInputPortTypeList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.workflowjob' (WorkflowJob) must also be provided
     */
    initialize(options)
    {
        var jobCollection = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_JOB_COLLECTION);
        var job = jobCollection.get(options.workflowjob.getJobUuid());
        /** @ignore */
        this.collection = job.get('input_port_types');
    }
}
ViewInputPortTypeList.prototype.modelEvents = {
    'all': 'render'
};
ViewInputPortTypeList.prototype.template = '#template-main_inputporttype_list';
ViewInputPortTypeList.prototype.childView = ViewInputPortTypeListItem;
ViewInputPortTypeList.prototype.childViewContainer = 'tbody';
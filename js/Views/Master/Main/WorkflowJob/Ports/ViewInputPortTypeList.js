import Marionette from 'backbone.marionette';
import Events from '../../../../../Shared/Events';
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
     * @param {object} options Marionette.View options object
     */
    initialize(options)
    {
        this._initializeRadio();
        var jobCollection = this.rodanChannel.request(Events.REQUEST__GLOBAL_JOB_COLLECTION);
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
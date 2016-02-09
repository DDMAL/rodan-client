import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewJobListItem from './ViewJobListItem';

/**
 * This class represents the view (and controller) for the job list.
 */
class ViewJobList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TInitialize.
     */
    initialize()
    {
        this._initializeRadio();
        this.collection = this.rodanChannel.request(Events.REQUEST__GLOBAL_JOB_COLLECTION);
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
ViewJobList.prototype.modelEvents = {
    'all': 'render'
};
ViewJobList.prototype.childViewContainer = 'tbody';
ViewJobList.prototype.template = '#template-main_job_list';
ViewJobList.prototype.childView = ViewJobListItem;
ViewJobList.prototype.behaviors = {Table: {'table': '#table-jobs'}};

export default ViewJobList;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../../../Shared/Events'
import ViewJobListItem from './ViewJobListItem'

/**
 * This class represents the view (and controller) for the job list.
 */
class ViewJobList extends Marionette.CompositeView
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

        this.modelEvents = {
            "all": "render"
        };
        this.childViewContainer = 'tbody';
        this.template = "#template-main_workflowbuilder_control_job_list";
        this.childView = ViewJobListItem;
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_JOB);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
    }
}

export default ViewJobList;
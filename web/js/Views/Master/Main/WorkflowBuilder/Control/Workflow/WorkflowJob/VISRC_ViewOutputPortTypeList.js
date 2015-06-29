import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../../Shared/VISRC_Events';
import VISRC_ViewOutputPortTypeListItem from './VISRC_ViewOutputPortTypeListItem';

/**
 * This class represents a list of output port types.
 */
class VISRC_ViewOutputPortTypeList extends Marionette.CompositeView
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
            "all": "render"
        };
        this._initializeRadio();
        this.template = "#template-main_workflowbuilder_control_outputporttype_list";
        this.childView = VISRC_ViewOutputPortTypeListItem;
        this.childViewContainer = 'tbody';
        var jobCollection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_JOB);
        var job = jobCollection.get(aParameters.workflowjob.getJobUuid());
        this.collection = job.get("output_port_types");
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

export default VISRC_ViewOutputPortTypeList;
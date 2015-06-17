import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../Shared/VISRC_Events';
import VISRC_InputPort from '../../../../../../Models/VISRC_InputPort';

/**
 * This class represents the view for editing a workflow job.
 */
class VISRC_ViewWorkflowJob extends Marionette.ItemView
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
        this.model = aParameters.workflowjob;
        this._initializeRadio();
        this.template = "#template-main_workflowbuilder_control_workflowjob_individual";
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
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_INPUTPORT, aPass => this._handleCommandAddInputPort(aPass));
    }

    /**
     * Create input port
     */
    _handleCommandAddInputPort(aPass)
    {
        var inputPort = this._createInputPort(aPass.inputporttype, this.model);
    }

    /**
     * Create workflow job.
     */
    _createInputPort(aInputPortType, aWorkflowJob)
    {
        var inputPort = new VISRC_InputPort({input_port_type: aInputPortType.attributes.url, workflow_job: aWorkflowJob.attributes.url});
        inputPort.save();
        return inputPort;
    }
}

export default VISRC_ViewWorkflowJob;
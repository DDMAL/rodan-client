import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../../Shared/VISRC_Events';
import VISRC_InputPort from '../../../../../../Models/VISRC_InputPort';
import VISRC_OutputPort from '../../../../../../Models/VISRC_OutputPort';

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
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_OUTPUTPORT, aPass => this._handleCommandAddOutputPort(aPass));
    }

    /**
     * Create input port
     */
    _handleCommandAddInputPort(aPass)
    {
        // TODO - need to check if too many input ports
        var port = this._createInputPort(aPass.inputporttype);
    }

    /**
     * Create output port
     */
    _handleCommandAddOutputPort(aPass)
    {
        // TODO - need to check if too many input ports
        var port = this._createOutputPort(aPass.outputporttype);
    }

    /**
     * Create input port.
     */
    _createInputPort(aInputPortType)
    {
        var port = new VISRC_InputPort({input_port_type: aInputPortType.get("url"), workflow_job: this.model.get("url")});
        port.save();
        this.model.get("input_ports").add(port);
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKSPACE_UPDATE_ITEM_WORKFLOWJOB, {workflowjob: this.model});
    }

    /**
     * Create input port.
     */
    _createOutputPort(aOutputPortType)
    {
        var port = new VISRC_OutputPort({output_port_type: aOutputPortType.get("url"), workflow_job: this.model.get("url")});
        port.save();
        this.model.get("output_ports").add(port);
    }
}

export default VISRC_ViewWorkflowJob;
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
        this.ui = {
            buttonShowWorkflow: '#button-show_workflow'
        }
        this.events = {
            'click @ui.buttonShowWorkflow': '_handleButtonShowWorkflow'
        };
        this.model = aParameters.workflowjob;
        this._initializeRadio();
        this.template = "#template-main_workflowbuilder_control_workflowjob_individual";
    }

    /**
     * Before destroy, detatch from radio.
     */
    onBeforeDestroy(aParameters)
    {
        this.rodanChannel.stopComplying(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_INPUTPORT);
        this.rodanChannel.stopComplying(VISRC_Events.COMMAND__WORKFLOWBUILDER_ADD_OUTPUTPORT);
        this.rodanChannel.stopComplying(VISRC_Events.COMMAND__WORKFLOWBUILDER_DELETE_INPUTPORT);
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
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_DELETE_INPUTPORT, aPass => this._handleCommandDeleteInputPort(aPass));
        this.rodanChannel.comply(VISRC_Events.COMMAND__WORKFLOWBUILDER_DELETE_OUTPUTPORT, aPass => this._handleCommandDeleteOutputPort(aPass));
    }

    /**
     * Handle button show workflow.
     */
    _handleButtonShowWorkflow()
    {
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKFLOWBUILDER_SHOW_JOBCONTROLVIEW, {});
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
     * Delete input port
     */
    _handleCommandDeleteInputPort(aPass)
    {
        this._deleteInputPort(aPass.inputport);
    }

    /**
     * Delete output port
     */
    _handleCommandDeleteOutputPort(aPass)
    {
        this._deleteOutputPort(aPass.outputport);
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
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKSPACE_UPDATE_ITEM_WORKFLOWJOB, {workflowjob: this.model});
    }

    /**
     * Delete input port.
     */
    _deleteInputPort(aInputPort)
    {
        try
        {
            aInputPort.destroy();
        }
        catch (aError)
        {
            console.log("TODO - not sure why this error is happening; see https://github.com/ELVIS-Project/vis-client/issues/5");
        }
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKSPACE_UPDATE_ITEM_WORKFLOWJOB, {workflowjob: this.model});
    }

    /**
     * Delete output port.
     */
    _deleteOutputPort(aPort)
    {
        try
        {
            aPort.destroy();
        }
        catch (aError)
        {
            console.log("TODO - not sure why this error is happening; see https://github.com/ELVIS-Project/vis-client/issues/5");
        }
        this.rodanChannel.command(VISRC_Events.COMMAND__WORKSPACE_UPDATE_ITEM_WORKFLOWJOB, {workflowjob: this.model});
    }
}

export default VISRC_ViewWorkflowJob;
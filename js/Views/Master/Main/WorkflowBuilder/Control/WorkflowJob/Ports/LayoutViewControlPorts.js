import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../../../Shared/Events';
import ViewInputPortList from './ViewInputPortList';
import ViewInputPortTypeList from './ViewInputPortTypeList';
import ViewOutputPortList from './ViewOutputPortList';
import ViewOutputPortTypeList from './ViewOutputPortTypeList';

/**
 * This class represents the view for editing ports.
 */
class LayoutViewControlPorts extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize
     */
    initialize(aParameters)
    {
        this._initializeRadio();
        this.addRegions({
            regionControlInputPortTypes: '#region-main_workflowbuilder_control_inputporttypes',
            regionControlInputPorts: '#region-main_workflowbuilder_control_inputports',
            regionControlOutputPortTypes: '#region-main_workflowbuilder_control_outputporttypes',
            regionControlOutputPorts: '#region-main_workflowbuilder_control_outputports'
        });
        this._workflowJob = aParameters.workflowjob;
        this._initializeViews(aParameters);
        this.template = '#template-main_workflowbuilder_control_ports';
    }

    /**
     * Initially show the list.
     */
    onBeforeShow()
    {
        this.regionControlInputPortTypes.show(this._inputPortTypeListView);
        this.regionControlInputPorts.show(this._inputPortListView);
        this.regionControlOutputPortTypes.show(this._outputPortTypeListView);
        this.regionControlOutputPorts.show(this._outputPortListView);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle workflowjob selection.
     */
    _initializeViews(aParameters)
    {
        this._inputPortListView = new ViewInputPortList(aParameters);
        this._outputPortListView = new ViewOutputPortList(aParameters);
        this._inputPortTypeListView = new ViewInputPortTypeList(aParameters);
        this._outputPortTypeListView = new ViewOutputPortTypeList(aParameters);
    }
    
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }
}

export default LayoutViewControlPorts;
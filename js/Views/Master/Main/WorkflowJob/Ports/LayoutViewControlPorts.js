import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import ViewInputPortList from '../../InputPort/ViewInputPortList';
import ViewInputPortListItem from './ViewInputPortListItem';
import ViewInputPortTypeList from './ViewInputPortTypeList';
import ViewOutputPortList from './ViewOutputPortList';
import ViewOutputPortTypeList from './ViewOutputPortTypeList';
import Events from '../../../../../Shared/Events';

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
            regionControlInputPortTypes: '#region-main_inputporttypes',
            regionControlInputPorts: '#region-main_inputports',
            regionControlOutputPortTypes: '#region-main_outputporttypes',
            regionControlOutputPorts: '#region-main_outputports'
        });
        this._workflowJob = aParameters.workflowjob;
        this._initializeViews(aParameters);
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
    _initializeViews(options)
    {
        var inputPortsCollection = this.rodanChannel.request(Events.REQUEST__INPUTPORTS_LOAD, {data: {workflow_job: options.workflowjob.id}});
        this._inputPortListView = new ViewInputPortList({collection: inputPortsCollection,
                                                         template: '#template-main_inputport_list',
                                                         childView: ViewInputPortListItem});
        this._outputPortListView = new ViewOutputPortList(options);
        this._inputPortTypeListView = new ViewInputPortTypeList(options);
        this._outputPortTypeListView = new ViewOutputPortTypeList(options);
    }
    
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
LayoutViewControlPorts.prototype.template = '#template-main_workflowbuilder_control_ports';

export default LayoutViewControlPorts;
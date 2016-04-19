import Marionette from 'backbone.marionette';
import ViewInputPortList from '../../InputPort/ViewInputPortList';
import ViewInputPortListItem from './ViewInputPortListItem';
import ViewInputPortTypeList from './ViewInputPortTypeList';
import ViewOutputPortList from './ViewOutputPortList';
import ViewOutputPortTypeList from './ViewOutputPortTypeList';

/**
 * View for editing ports.
 */
export default class LayoutViewControlPorts extends Marionette.LayoutView
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
        this.addRegions({
            regionControlInputPortTypes: '#region-main_inputporttypes',
            regionControlInputPorts: '#region-main_inputports',
            regionControlOutputPortTypes: '#region-main_outputporttypes',
            regionControlOutputPorts: '#region-main_outputports'
        });
        this._workflowJob = options.workflowjob;
        this._initializeViews(options);
    }

    /**
     * Show the subviews before showing this view.
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
        this._inputPortListView = new ViewInputPortList({collection: options.workflowjob.get('input_ports'),
                                                         template: '#template-main_inputport_list',
                                                         childView: ViewInputPortListItem,
                                                         childViewOptions: options});
        this._outputPortListView = new ViewOutputPortList({collection: options.workflowjob.get('output_ports'),
                                                           childViewOptions: options});
        this._inputPortTypeListView = new ViewInputPortTypeList({workflowjob: options.workflowjob,
                                                                 childViewOptions: options});
        this._outputPortTypeListView = new ViewOutputPortTypeList({workflowjob: options.workflowjob,
                                                                   childViewOptions: options});
    }
}
LayoutViewControlPorts.prototype.template = '#template-main_workflowjob_ports';
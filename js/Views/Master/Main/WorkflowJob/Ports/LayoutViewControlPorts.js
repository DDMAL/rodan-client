import Marionette from 'backbone.marionette';
import ViewInputPortCollection from 'js/Views/Master/Main/InputPort/ViewInputPortCollection';
import ViewInputPortCollectionItem from './ViewInputPortCollectionItem';
import ViewInputPortTypeList from './ViewInputPortTypeList';
import ViewOutputPortCollection from './ViewOutputPortCollection';
import ViewOutputPortTypeCollection from './ViewOutputPortTypeCollection';

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
     * @param {object} options Marionette.View options object; 'options.workflowjob' (WorkflowJob) must also be provided
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
        this._inputPortListView = new ViewInputPortCollection({collection: options.workflowjob.get('input_ports'),
                                                         template: '#template-main_inputport_list',
                                                         childView: ViewInputPortCollectionItem,
                                                         childViewOptions: options});
        this._outputPortListView = new ViewOutputPortCollection({collection: options.workflowjob.get('output_ports'),
                                                           childViewOptions: options});
        this._inputPortTypeListView = new ViewInputPortTypeList({workflowjob: options.workflowjob,
                                                                 childViewOptions: options});
        this._outputPortTypeListView = new ViewOutputPortTypeCollection({workflowjob: options.workflowjob,
                                                                   childViewOptions: options});
    }
}
LayoutViewControlPorts.prototype.template = '#template-main_workflowjob_ports';
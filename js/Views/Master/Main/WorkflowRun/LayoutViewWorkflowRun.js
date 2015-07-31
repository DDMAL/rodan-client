import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../Shared/Events';

/**
 * LayoutView for WorkflowRuns.
 */
class LayoutViewWorkflowRun extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize()
    {
        this.addRegions({
            regionList: '#region-main_workflowrun_list',
            regionItem: '#region-main_workflowrun_individual'
        });
        this.template = '#template-main_workflowrun';
        this._initializeRadio();
    }

    /**
     * Show list.
     */
    showList(aView)
    {
        this.regionList.show(aView);
    }

    /**
     * Show item.
     */
    showItem(aView)
    {
        this.regionItem.show(aView);
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

export default LayoutViewWorkflowRun;
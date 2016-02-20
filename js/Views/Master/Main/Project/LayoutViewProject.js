import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * LayoutView for Projects.
 */
class LayoutViewProject extends Marionette.LayoutView
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
            regionProject: '#region-main_project_view',
            regionList: '#region-main_project_workflowruns'
        });
        this._initializeRadio();
    }

    /**
     * Show view in Resource list region.
     */
    showList(view)
    {
        this.regionList.show(view);
    }

    /**
     * Show view in region
     */
    showView(view)
    {
        this.regionProject.show(view);
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

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewProject.prototype.template = '#template-main_project';

export default LayoutViewProject;
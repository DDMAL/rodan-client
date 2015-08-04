import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * LayoutView for Project controller.
 *
 * This view isn't entirely needed (for now), but having it is consistent with
 * the other views and controllers.
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
        this._initializeRadio();
        this.addRegions({
            regionProject: '#region-main_project_view'
        });
        this.template = '#template-main_project';
    }

    /**
     * Show view in region
     */
    showView(aView)
    {
        this.regionProject.show(aView);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel('rodan');
    }
}

export default LayoutViewProject;
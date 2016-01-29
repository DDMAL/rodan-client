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
        this._rodanChannel = Radio.channel('rodan');
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewProject.prototype.template = '#template-main_project';

export default LayoutViewProject;
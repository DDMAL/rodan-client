import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * This class represents the view for a resource.
 */
class ViewResourceAssignment extends Marionette.ItemView
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
            'all': 'render'
        };
        this._initializeRadio();
        this.template = '#template-main_workflowbuilder_control_resourceassignment_individual';
        this.model = aParameters.resource;
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

export default ViewResourceAssignment;
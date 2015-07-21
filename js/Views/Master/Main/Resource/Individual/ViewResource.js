import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewResourceTypeListItem from './ViewResourceTypeListItem';

/**
 * This class represents the view for a single Resource summary.
 */
class ViewResource extends Marionette.CompositeView
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
        this.model = aParameters.resource;
        this._initializeRadio();
        this.template = '#template-main_resource_individual';
        this.ui = {
            buttonSave: '#button-main_resource_individual_save',
            selectResourceType: '#select-resourcetype'
        };
        this.events = {
            'click @ui.buttonSave': '_handleClickButtonSave'
        };
        this.childView = ViewResourceTypeListItem;
        this.childViewContainer = '#select-resourcetype';
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_RESOURCETYPE);
    }

    /**
     * Returns ResourceTypes.
     */
    templateHelpers() 
    {
        return { items: this.collection.toJSON() };
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

    /**
     * Handle save.
     */
    _handleClickButtonSave()
    {
        var resourceTypeUrl = this.ui.selectResourceType.val();
        this.model.save({resource_type: resourceTypeUrl}, {patch: true});
    }
}

export default ViewResource;
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
            buttonDelete: '#button-main_resource_individual_delete',
            selectResourceType: '#select-resourcetype',
            resourceName: '#text-resource_name',
            resourceDescription: '#text-resource_description'
        };
        this.events = {
            'click @ui.buttonSave': '_handleClickButtonSave',
            'click @ui.buttonDelete': '_handleClickButtonDelete'
        };
        this.childView = ViewResourceTypeListItem;
        this.childViewContainer = '#select-resourcetype';
        this.collection = this._rodanChannel.request(Events.REQUEST__COLLECTION_RESOURCETYPE);
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
        this._rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle save.
     */
    _handleClickButtonSave()
    {
        var resourceTypeUrl = this.ui.selectResourceType.val();
        var name = this.ui.resourceName.val();
        var description = this.ui.resourceDescription.val();
        this.model.save({resource_type: resourceTypeUrl, name: name, description: description}, {patch: true});
    }

    /**
     * Handle delete.
     */
    _handleClickButtonDelete()
    {
        this._rodanChannel.command(Events.COMMAND__RESOURCE_DELETE, {resource: this.model});
    }
}

export default ViewResource;
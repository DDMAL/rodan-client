import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewResourceTypeListItem from './ViewResourceTypeListItem';

/**
 * Resource view.
 */
class ViewResource extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize
     */
    initialize(aOptions)
    {
        this.modelEvents = {
            'all': 'render'
        };
        this.model = aOptions.resource;
        this._initializeRadio();
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
        this.template = '#template-main_resource_individual';
        this.childView = ViewResourceTypeListItem;
        this.childViewContainer = '#select-resourcetype';
        this.collection = this._rodanChannel.request(Events.REQUEST__RESOURCETYPE_COLLECTION);
    }

    /**
     * Returns ResourceTypes.
     */
    templateHelpers() 
    {
        return { items: this.collection.toJSON() };
    }

    /**
     * Destroy callback.
     */
    onDestroy()
    {
        this.collection = null;
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
     * Handle button save.
     */
    _handleClickButtonSave()
    {
        this._rodanChannel.command(Events.COMMAND__RESOURCE_SAVE, {resource: this.model,
                                                                   resource_type: this.ui.selectResourceType.val(),
                                                                   name: this.ui.resourceName.val(),
                                                                   description: this.ui.resourceDescription.val()});
    }

    /**
     * Handle button delete.
     */
    _handleClickButtonDelete()
    {
        this._rodanChannel.command(Events.COMMAND__RESOURCE_DELETE, {resource: this.model});
    }
}

export default ViewResource;
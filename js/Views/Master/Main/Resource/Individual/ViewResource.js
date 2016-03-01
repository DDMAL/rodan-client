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
    initialize(options)
    {
        this.model = options.resource;
        this._initializeRadio();
        this.collection = this.rodanChannel.request(Events.REQUEST__GLOBAL_RESOURCETYPE_COLLECTION);
        this.collection.each(function(model) { model.unset('selected'); });
        var resourceType = this.collection.findWhere({url: this.model.get('resource_type')});
        resourceType.set('selected', 'selected');
    }

    /**
     * Post-render.
     */
    onRender()
    {
        var disabled = this.model.get('origin') !== null;
        $(this.ui.buttonDelete).attr('disabled', disabled); 
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
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle button save.
     */
    _handleClickButtonSave()
    {
        this.rodanChannel.request(Events.REQUEST__RESOURCE_SAVE, {resource: this.model, fields: {resource_type: this.ui.selectResourceType.val(),
                                                                                                 name: this.ui.resourceName.val(),
                                                                                                 description: this.ui.resourceDescription.val()}});
    }

    /**
     * Handle button delete.
     */
    _handleClickButtonDelete()
    {
        this.rodanChannel.request(Events.REQUEST__RESOURCE_DELETE, {resource: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewResource.prototype.modelEvents = {
    'all': 'render'
};
ViewResource.prototype.ui = {
    buttonSave: '#button-main_resource_individual_save',
    buttonDelete: '#button-main_resource_individual_delete',
    selectResourceType: '#select-resourcetype',
    resourceName: '#text-resource_name',
    resourceDescription: '#text-resource_description'
};
ViewResource.prototype.events = {
    'click @ui.buttonSave': '_handleClickButtonSave',
    'click @ui.buttonDelete': '_handleClickButtonDelete'
};
ViewResource.prototype.template = '#template-main_resource_individual';
ViewResource.prototype.childView = ViewResourceTypeListItem;
ViewResource.prototype.childViewContainer = '#select-resourcetype';

export default ViewResource;
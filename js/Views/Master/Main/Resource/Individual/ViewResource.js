import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Configuration from '../../../../../Configuration';
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
        var disabledDelete = this.model.get('origin') !== null;
        $(this.ui.buttonDelete).attr('disabled', disabledDelete); 
        var disabledDownload = this.model.get('download') === null;
        $(this.ui.buttonDownload).attr('disabled', disabledDownload); 
        var disableView = this.model.get('viewer_url') === null || disabledDownload;
        $(this.ui.buttonView).attr('disabled', disableView);
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

    /**
     * Handle button download.
     */
    _handleClickDownload()
    {
        var mimetype = this.model.get('resource_type_full').mimetype;
        var ext = this.model.get('resource_type_full').extension;
        var filename = this.model.get('name') + '.' + ext;
        this.rodanChannel.request(Events.REQUEST__TRANSFERMANAGER_DOWNLOAD, {url: this.model.get('download'), filename: filename, mimetype: mimetype});
    }

    /**
     * Handle button view.
     */
    _handleClickView()
    {
        var newWindow = window.open(this.model.get('viewer_url'));
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
    resourceDescription: '#text-resource_description',
    buttonDownload: '#button-main_resource_individual_download',
    buttonView: '#button-main_resource_individual_view'
};
ViewResource.prototype.events = {
    'click @ui.buttonSave': '_handleClickButtonSave',
    'click @ui.buttonDelete': '_handleClickButtonDelete',
    'click @ui.buttonDownload': '_handleClickDownload',
    'click @ui.buttonView': '_handleClickView'
};
ViewResource.prototype.template = '#template-main_resource_individual';
ViewResource.prototype.childView = ViewResourceTypeListItem;
ViewResource.prototype.childViewContainer = '#select-resourcetype';

export default ViewResource;
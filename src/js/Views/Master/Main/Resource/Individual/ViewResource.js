import $ from 'jquery';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import _ from 'underscore';
import ViewResourceTypeCollectionItem from 'js/Views/Master/Main/ResourceType/ViewResourceTypeCollectionItem';

/**
 * Resource view.
 */
export default class ViewResource extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     */
    initialize()
    {
        /** @ignore */
        this.collection = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_RESOURCETYPE_COLLECTION);
        this.collection.each(function(model) { model.unset('selected'); });
        var resourceType = this.collection.findWhere({url: this.model.get('resource_type')});
        resourceType.set('selected', 'selected');
    }

    /**
     * Initialize buttons after render.
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
     * Handle button save.
     */
    _handleClickButtonSave()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__RESOURCE_SAVE, {resource: this.model,
                                                                             fields: {resource_type: this.ui.selectResourceType.find(':selected').val(),
                                                                                      name: _.escape(this.ui.resourceName.val()),
                                                                                      description: _.escape(this.ui.resourceDescription.val())}});
    }

    /**
     * Handle button delete.
     */
    _handleClickButtonDelete()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__RESOURCE_DELETE, {resource: this.model});
    }

    /**
     * Handle button download.
     */
    _handleClickDownload()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__RESOURCE_DOWNLOAD, {resource: this.model});
    }

    /**
     * Handle button view.
     */
    _handleClickView()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__RESOURCE_VIEWER_ACQUIRE, {resource: this.model});
    }
}
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
ViewResource.prototype.childView = ViewResourceTypeCollectionItem;
ViewResource.prototype.childViewContainer = '#select-resourcetype';

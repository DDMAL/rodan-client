import BaseController from './BaseController';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import LayoutViewModel from 'js/Views/Master/Main/LayoutViewModel';
import Radio from 'backbone.radio';
import Resource from 'js/Models/Resource';
import ResourceCollection from 'js/Collections/ResourceCollection';
import ViewResource from 'js/Views/Master/Main/Resource/Individual/ViewResource';
import ViewResourceCollection from 'js/Views/Master/Main/Resource/Collection/ViewResourceCollection';
import ViewResourceCollectionItem from 'js/Views/Master/Main/Resource/Collection/ViewResourceCollectionItem';

/**
 * Controller for Resources.
 */
export default class ControllerResource extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        // Events
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__RESOURCE_SELECTED_COLLECTION, options => this._handleEventListSelected(options));
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__RESOURCE_SELECTED, options => this._handleEventItemSelected(options));

        // Requests
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__RESOURCE_CREATE, options => this._handleRequestResourceCreate(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__RESOURCE_DELETE, options => this._handleCommandResourceDelete(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__RESOURCE_DOWNLOAD, options => this._handleRequestResourceDownload(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__RESOURCE_SAVE, options => this._handleCommandResourceSave(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__RESOURCE_SHOWLAYOUTVIEW, options => this._handleCommandShowLayoutView(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__RESOURCES_LOAD, options => this._handleRequestResources(options));
    }
   
    /**
     * Handle show LayoutView.
     */
    _handleCommandShowLayoutView(options)
    {
        this._layoutView = options.layoutView;
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected(options)
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__RESOURCES_LOAD, {data: {project: options.project.id}});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__UPDATER_SET_COLLECTIONS, {collections: [this._collection]});
        this._layoutView = new LayoutViewModel();
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MAINREGION_SHOW_VIEW, {view: this._layoutView});
        var view = new ViewResourceCollection({collection: this._collection,
                                         template: '#template-main_resource_list',
                                         childView: ViewResourceCollectionItem,
                                         model: options.project});
        this._layoutView.showCollection(view);
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        this._layoutView.showItem(new ViewResource({model: options.resource}));
    }

    /**
     * Handle command add Resource.
     */
    _handleRequestResourceCreate(options)
    {
        var resource = null;
        if (options.resourcetype)
        {
            resource = new Resource({project: options.project.get('url'), file: options.file, resource_type: options.resourcetype});
        }
        else
        {
            resource = new Resource({project: options.project.get('url'), file: options.file});
        }
        var jqXHR = resource.save({}, {success: (model) => this._handleCreateSuccess(model, this._collection)});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__TRANSFERMANAGER_MONITOR_UPLOAD, {request: jqXHR, file: options.file});
    }

    /**
     * Handle command delete Resource.
     */
    _handleCommandResourceDelete(options)
    {
        this._layoutView.clearItemView();
        options.resource.destroy({success: (model) => this._handleDeleteSuccess(model, this._collection)});
    }

    /**
     * Handle command download Resource.
     */
    _handleRequestResourceDownload(options)
    {
        var mimetype = options.resource.get('resource_type_full').mimetype;
        var ext = options.resource.get('resource_type_full').extension;
        var filename = options.resource.get('name') + '.' + ext;
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__TRANSFERMANAGER_DOWNLOAD, {url: options.resource.get('download'), filename: filename, mimetype: mimetype});
    }

    /**
     * Handle command save Resource.
     */
    _handleCommandResourceSave(options)
    {
        options.resource.save(options.fields, {patch: true, success: (model) => Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__RESOURCE_SAVED, {resource: model})});
    }

    /**
     * Handle request Resources.
     */
    _handleRequestResources(options)
    {
        this._collection = new ResourceCollection();
        this._collection.fetch(options);
        return this._collection;
    }

    /**
     * Handle create success.
     */
    _handleCreateSuccess(resource, collection)
    {
        collection.add(resource);
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__RESOURCE_CREATED, {resource: resource});
    }

    /**
     * Handle delete success.
     */
    _handleDeleteSuccess(model, collection)
    {
        collection.remove(model);
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__RESOURCE_DELETED, {resource: model});
    }
}

export default ControllerResource;
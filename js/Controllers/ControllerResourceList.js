import BaseController from './BaseController';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import LayoutViewModel from 'js/Views/Master/Main/LayoutViewModel';
import Radio from 'backbone.radio';
import ResourceList from 'js/Models/ResourceList';
import ResourceListCollection from 'js/Collections/ResourceListCollection';
import ViewResourceListCollection from 'js/Views/Master/Main/ResourceList/Collection/ViewResourceListCollection';
import ViewResourceListCollectionItem from 'js/Views/Master/Main/ResourceList/Collection/ViewResourceListCollectionItem';

/**
 * Controller for ResourceLists.
 */
export default class ControllerResourceList extends BaseController
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
        Radio.channel('rodan').on(RODAN_EVENTS.EVENT__RESOURCELIST_SELECTED_COLLECTION, options => this._handleEventCollectionSelected(options));

        // Requests
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__RESOURCELIST_CREATE, options => this._handleRequestResourceListCreate(options));
 //       Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__RESOURCE_DELETE, options => this._handleCommandResourceDelete(options));
  //      Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__RESOURCE_DOWNLOAD, options => this._handleRequestResourceDownload(options));
  //      Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__RESOURCE_SAVE, options => this._handleCommandResourceSave(options));
  //      Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__RESOURCE_SHOWLAYOUTVIEW, options => this._handleCommandShowLayoutView(options));
        Radio.channel('rodan').reply(RODAN_EVENTS.REQUEST__RESOURCELISTS_LOAD, options => this._handleRequestLoad(options));
    }
   
    /**
     * Handle show LayoutView.
     */
 /*   _handleCommandShowLayoutView(options)
    {
        this._layoutView = options.layoutView;
    }*/

    /**
     * Handle collection selection.
     */
    _handleEventCollectionSelected(options)
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__RESOURCELISTS_LOAD, {data: {project: options.project.id}});
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__UPDATER_SET_COLLECTIONS, {collections: [this._collection]});
        this._layoutView = new LayoutViewModel();
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MAINREGION_SHOW_VIEW, {view: this._layoutView});
        var view = new ViewResourceListCollection({collection: this._collection,
                                                   template: '#template-main_resourcelist_collection',
                                                   childView: ViewResourceListCollectionItem,
                                                   model: options.project});
        this._layoutView.showCollection(view);
    }

    /**
     * Handle item selection.
     */
/*    _handleEventItemSelected(options)
    {
        this._layoutView.showItem(new ViewResource({model: options.resource}));
    }*/

    /**
     * Handle command add Resource.
     */
    _handleRequestResourceListCreate(options)
    {
        var resourceList = new ResourceList({project: options.project.get('url'), name: 'untitled'});
        resourceList.save({}, {success: (model) => this._handleCreateSuccess(model, this._collection)});
    }

    /**
     * Handle command delete Resource.
     */
 /*   _handleCommandResourceDelete(options)
    {
        this._layoutView.clearItemView();
        options.resource.destroy({success: (model) => this._handleDeleteSuccess(model, this._collection)});
    }*/

    /**
     * Handle command download Resource.
     */
/*    _handleRequestResourceDownload(options)
    {
        var mimetype = options.resource.get('resource_type_full').mimetype;
        var ext = options.resource.get('resource_type_full').extension;
        var filename = options.resource.get('name') + '.' + ext;
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__TRANSFERMANAGER_DOWNLOAD, {url: options.resource.get('download'), filename: filename, mimetype: mimetype});
    }*/

    /**
     * Handle command save Resource.
     */
 /*   _handleCommandResourceSave(options)
    {
        options.resource.save(options.fields, {patch: true, success: (model) => Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__RESOURCE_SAVED, {resource: model})});
    }*/

    /**
     * Handle request load.
     */
    _handleRequestLoad(options)
    {
        this._collection = new ResourceListCollection();
        this._collection.fetch(options);
        return this._collection;
    }

    /**
     * Handle create success.
     */
    _handleCreateSuccess(model, collection)
    {
        collection.add(model);
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__RESOURCELIST_CREATED, {resourcelist: model});
    }

    /**
     * Handle delete success.
     */
  /*  _handleDeleteSuccess(model, collection)
    {
        collection.remove(model);
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__RESOURCE_DELETED, {resource: model});
    }*/
}
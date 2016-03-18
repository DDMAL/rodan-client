import BaseController from './BaseController';
import Events from '../Shared/Events';
import LayoutViewModel from '../Views/Master/Main/LayoutViewModel';
import ViewResource from '../Views/Master/Main/Resource/Individual/ViewResource';
import ViewResourceList from '../Views/Master/Main/Resource/List/ViewResourceList';
import ViewResourceListItem from '../Views/Master/Main/Resource/List/ViewResourceListItem';
import Resource from '../Models/Resource';
import ResourceCollection from '../Collections/ResourceCollection';

/**
 * Controller for Resource views.
 */
class ControllerResource extends BaseController
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
        this.rodanChannel.on(Events.EVENT__RESOURCE_SELECTED_COLLECTION, options => this._handleEventListSelected(options));
        this.rodanChannel.on(Events.EVENT__RESOURCE_SELECTED, options => this._handleEventItemSelected(options));

        // Requests
        this.rodanChannel.reply(Events.REQUEST__RESOURCE_CREATE, options => this._handleRequestResourceCreate(options));
        this.rodanChannel.reply(Events.REQUEST__RESOURCE_DELETE, options => this._handleCommandResourceDelete(options));
        this.rodanChannel.reply(Events.REQUEST__RESOURCE_SAVE, options => this._handleCommandResourceSave(options));
        this.rodanChannel.reply(Events.REQUEST__RESOURCE_SHOWLAYOUTVIEW, options => this._handleCommandShowLayoutView(options));
        this.rodanChannel.reply(Events.REQUEST__RESOURCES_LOAD, options => this._handleRequestResources(options));
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
        this.rodanChannel.request(Events.REQUEST__RESOURCES_LOAD, {data: {project: options.project.id}});
        this.rodanChannel.request(Events.REQUEST__TIMER_SET_FUNCTION, {function: () => this._collection.syncList()});
        this._layoutView = new LayoutViewModel();
        this.rodanChannel.request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: this._layoutView});
        var view = new ViewResourceList({collection: this._collection,
                                         template: '#template-main_resource_list',
                                         childView: ViewResourceListItem,
                                         model: options.project});
        this._layoutView.showList(view);
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        this._layoutView.showItem(new ViewResource(options));
    }

    /**
     * Handle command add Resource.
     */
    _handleRequestResourceCreate(options)
    {
        var resource = new Resource({project: options.project.get('url'), file: options.file});
        var jqXHR = resource.save({}, {success: (model) => this._handleCreateSuccess(model, this._collection)});
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
     * Handle command save Resource.
     */
    _handleCommandResourceSave(options)
    {
        options.resource.save(options.fields, {patch: true, success: (model) => this.rodanChannel.trigger(Events.EVENT__RESOURCE_SAVED, {resource: model})});
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
        this.rodanChannel.trigger(Events.EVENT__RESOURCE_CREATED, {resource: resource});
    }

    /**
     * Handle delete success.
     */
    _handleDeleteSuccess(model, collection)
    {
        collection.remove(model);
        this.rodanChannel.trigger(Events.EVENT__RESOURCE_DELETED, {resource: model})
    }
}

export default ControllerResource;
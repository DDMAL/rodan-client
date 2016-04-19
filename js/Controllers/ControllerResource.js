import BaseController from './BaseController';
import RODAN_EVENTS from '../Shared/RODAN_EVENTS';
import LayoutViewModel from '../Views/Master/Main/LayoutViewModel';
import Radio from 'backbone.radio';
import Resource from '../Models/Resource';
import ResourceCollection from '../Collections/ResourceCollection';
import ViewResource from '../Views/Master/Main/Resource/Individual/ViewResource';
import ViewResourceList from '../Views/Master/Main/Resource/List/ViewResourceList';
import ViewResourceListItem from '../Views/Master/Main/Resource/List/ViewResourceListItem';

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
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__TIMER_SET_FUNCTION, {function: () => this._collection.syncList()});
        this._layoutView = new LayoutViewModel();
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__MAINREGION_SHOW_VIEW, {view: this._layoutView});
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
        Radio.channel('rodan').trigger(RODAN_EVENTS.EVENT__RESOURCE_DELETED, {resource: model})
    }
}

export default ControllerResource;
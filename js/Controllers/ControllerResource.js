import BaseController from './BaseController';
import Events from '../Shared/Events';
import LayoutViewModel from '../Views/Master/Main/LayoutViewModel';
import ViewResource from '../Views/Master/Main/Resource/Individual/ViewResource';
import ViewResourceList from '../Views/Master/Main/Resource/List/ViewResourceList';
import ViewResourceListItem from '../Views/Master/Main/Resource/List/ViewResourceListItem';
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
        this.rodanChannel.reply(Events.REQUEST__RESOURCE_CREATE, options => this._handleRequestResourceCreate(options));
        this.rodanChannel.reply(Events.REQUEST__RESOURCE_DELETE, options => this._handleCommandResourceDelete(options));
        this.rodanChannel.reply(Events.REQUEST__RESOURCE_SAVE, options => this._handleCommandResourceSave(options));
        this.rodanChannel.reply(Events.REQUEST__RESOURCE_SHOWLAYOUTVIEW, options => this._handleCommandShowLayoutView(options));
        this.rodanChannel.on(Events.EVENT__RESOURCES_SELECTED, options => this._handleEventListSelected(options));
        this.rodanChannel.on(Events.EVENT__RESOURCE_SELECTED, options => this._handleEventItemSelected(options));
        this.rodanChannel.reply(Events.REQUEST__RESOURCES_SYNC, options => this._handleRequestResourcesSync(options));
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
        this.rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__RESOURCES_SYNC, 
                                                                       options: {}, 
                                                                       callback: null});
        this._layoutView = new LayoutViewModel();
        this.rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this._layoutView);
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
        return this._collection.create({project: options.project.get('url'), file: options.file});
    }

    /**
     * Handle command delete Resource.
     */
    _handleCommandResourceDelete(options)
    {
        this._layoutView.clearItemView();
        options.resource.destroy();
        this._collection.remove(options.resource);
    }

    /**
     * Handle command save Resource.
     */
    _handleCommandResourceSave(options)
    {
        options.resource.save({resource_type: options.resource_type,
                                name: options.name,
                                description: options.description},
                               {patch: true, success: () => this._handleRequestResourcesSync()});
    }

    /**
     * Handle add success.
     */
    _handleRequestResourcesSync()
    {
        this._collection.syncList();
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
}

export default ControllerResource;
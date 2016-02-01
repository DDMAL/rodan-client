import BaseController from '../../../../Controllers/BaseController';
import Events from '../../../../Shared/Events';
import LayoutViewResource from './LayoutViewResource';
import ViewResource from './Individual/ViewResource';
import ViewResourceList from './List/ViewResourceList';
import ViewResourceListItem from './List/ViewResourceListItem';
import ResourceCollection from '../../../../Collections/ResourceCollection';

/**
 * Controller for Resource views.
 */
class ResourceController extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        // Commands.
        this._rodanChannel.reply(Events.REQUEST__RESOURCE_ADD, aOptions => this._handleCommandResourceAdd(aOptions));
        this._rodanChannel.reply(Events.REQUEST__RESOURCE_DELETE, aOptions => this._handleCommandResourceDelete(aOptions));
        this._rodanChannel.reply(Events.REQUEST__RESOURCE_SAVE, aOptions => this._handleCommandResourceSave(aOptions));
        this._rodanChannel.reply(Events.REQUEST__RESOURCE_SHOWLAYOUTVIEW, options => this._handleCommandShowLayoutView(options));

        // Requests.
        this._rodanChannel.on(Events.EVENT__RESOURCES_SELECTED, aOptions => this._handleEventListSelected(aOptions));
        this._rodanChannel.on(Events.EVENT__RESOURCE_SELECTED, aOptions => this._handleEventItemSelected(aOptions));
        this._rodanChannel.reply(Events.REQUEST__RESOURCES_SYNC, options => this._handleRequestResourcesSync(options));
        this._rodanChannel.reply(Events.REQUEST__RESOURCES_LOAD, options => this._handleRequestResources(options));
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
        this._rodanChannel.request(Events.REQUEST__RESOURCES_LOAD, {data: {project: options.project.id}});
        this._layoutView = new LayoutViewResource({project: options.project});
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this._layoutView);
        this._layoutView.showList(new ViewResourceList({collection: this._collection,
                                                        template: '#template-main_resource_list',
                                                        childView: ViewResourceListItem}));
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
    _handleCommandResourceAdd(options)
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
        this._rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__RESOURCES_SYNC, 
                                                                       options: {}, 
                                                                       callback: null});
        return this._collection;
    }
}

export default ResourceController;
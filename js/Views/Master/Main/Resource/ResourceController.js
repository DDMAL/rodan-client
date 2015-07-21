import Events from '../../../../Shared/Events';
import LayoutViewResource from './LayoutViewResource';
import ViewResource from './Individual/ViewResource';
import ViewResourceList from './List/ViewResourceList';
import BaseController from '../../../../Controllers/BaseController';

/**
 * Controller for Resource views.
 */
class ResourceController extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Basic constructor.
     */
    constructor(aOptions)
    {
        super(aOptions);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.on(Events.EVENT__RESOURCES_SELECTED, aPass => this._handleEventListSelected(aPass));
        this._rodanChannel.on(Events.EVENT__RESOURCE_SELECTED, aPass => this._handleEventItemSelected(aPass));
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected(aPass)
    {
        this._layoutView = new LayoutViewResource();
        this._rodanChannel.command(Events.COMMAND__LAYOUTVIEW_SHOW, this._layoutView);
        this._viewList = new ViewResourceList({project: aPass.project});
        this._layoutView.showList(this._viewList);
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aPass)
    {
        this._viewItem = new ViewResource(aPass);
        this._layoutView.showItem(this._viewItem);
    }
}

export default ResourceController;
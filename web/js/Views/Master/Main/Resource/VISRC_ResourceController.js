import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'
import VISRC_LayoutViewResource from './VISRC_LayoutViewResource';
import VISRC_ViewResource from './Individual/VISRC_ViewResource';
import VISRC_ViewResourceList from './List/VISRC_ViewResourceList';
import VISRC_BaseController from '../../../../Controllers/VISRC_BaseController';

/**
 * Controller for Resource views.
 */
class VISRC_ResourceController extends VISRC_BaseController
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
        this._rodanChannel.on(VISRC_Events.EVENT__RESOURCES_SELECTED, () => this._handleEventListSelected());
        this._rodanChannel.on(VISRC_Events.EVENT__RESOURCE_SELECTED, aPass => this._handleEventItemSelected(aPass));
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this._layoutView = new VISRC_LayoutViewResource();
        this._viewList = new VISRC_ViewResourceList();
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        // Send the layout view to the main region.
        this._rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this._layoutView);

        // Tell the layout view what to render.
        // TODO - don't want to do this, but for some reason my views get destroyed when
        // the containing region is destroyed!
        this._viewList.isDestroyed = false;
        this._layoutView.showList(this._viewList);
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aPass)
    {
        // Send the layout view to the main region.
        this._rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this._layoutView);

        // Tell the layout view what to render.
        // TODO - don't want to do this...
        this._viewItem = new VISRC_ViewResource(aPass);
        this._layoutView.showItem(this._viewItem);
    }
}

export default VISRC_ResourceController;
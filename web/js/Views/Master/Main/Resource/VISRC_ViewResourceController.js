import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'
import VISRC_LayoutViewResource from './VISRC_LayoutViewResource';
import VISRC_ViewResource from './Individual/VISRC_ViewResource';
import VISRC_ViewResourceList from './List/VISRC_ViewResourceList';

/**
 * Controller for Resource views.
 */
class VISRC_ViewResourceController extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize(aOptions)
    {
        this._initializeViews();
        this._initializeRadio();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.on(VISRC_Events.EVENT__RESOURCES_SELECTED, () => this._handleEventListSelected());
        this.rodanChannel.on(VISRC_Events.EVENT__RESOURCE_SELECTED, aPass => this._handleEventItemSelected(aPass));
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.layoutView = new VISRC_LayoutViewResource();
        this.viewList = new VISRC_ViewResourceList();
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        // Send the layout view to the main region.
        this.rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this.layoutView);

        // Tell the layout view what to render.
        // TODO - don't want to do this, but for some reason my views get destroyed when
        // the containing region is destroyed!
        this.viewList.isDestroyed = false;
        this.layoutView.showList(this.viewList);
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aPass)
    {
        // Send the layout view to the main region.
        this.rodanChannel.command(VISRC_Events.COMMAND__LAYOUTVIEW_SHOW, this.layoutView);

        // Tell the layout view what to render.
        // TODO - don't want to do this...
        this.viewItem = new VISRC_ViewResource(aPass);
        this.layoutView.showItem(this.viewItem);
    }
}

export default VISRC_ViewResourceController;
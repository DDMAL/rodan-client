import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events';
import VISRC_ViewScore from './Individual/VISRC_ViewScore';
import VISRC_ViewScoreList from './List/VISRC_ViewScoreList';

/**
 * This is a layout to help render a Collection and a single item.
 * We're using a LayoutView as opposed to a CompositeView because the single model
 * that would be associated with the CompositveView is not initially known, so it can't
 * rerender.
 */
class VISRC_LayoutViewScore extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize(aOptions)
    {
        this.addRegions({
            regionScoreList: "#region-main_score_list",
            regionScoreItem: "#region-main_score_item"
        });
        this.template = "#template-main_score";
        this._initializeViews();
        this._initializeRadio();
    }

    /**
     * Show the views when WE are shown. Usually, we'd wait for a message,
     * but we have to explicitly wait for our parent to render us.
     */
    onShow()
    {
        this.regionScoreList.show(this.viewList);
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
        this.rodanChannel.on(VISRC_Events.EVENT__SCORE_SELECTED, () => this._handleEventItemSelected());
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
        this.viewList = new VISRC_ViewScoreList();
        this.viewItem = new VISRC_ViewScore();
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected()
    {
        this.regionScoreItem.show(this.viewItem);
    }
}

export default VISRC_LayoutViewScore;
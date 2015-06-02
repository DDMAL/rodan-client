import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_ViewScoreListItem from './VISRC_ViewScoreListItem';

/**
 * This class represents the view (and controller) for the score list.
 */
class VISRC_ViewScoreList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.modelEvents = {
            "all": "render"
        };
        this._initializeRadio();
        this.template = "#template-main_score_list";
        this.childView = VISRC_ViewScoreListItem;
        this.childViewContainer = 'tbody';
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
        this.rodanChannel.on(VISRC_Events.EVENT__SCORES_SELECTED, aProjectId => this._handleEventListSelected(aProjectId));
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected(aProjectId)
    {
        this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_SCORE);
    }
}

export default VISRC_ViewScoreList;
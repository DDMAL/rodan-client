import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../Shared/VISRC_Events'
import VISRC_ScoreCollection from './VISRC_ScoreCollection'
import VISRC_ViewScoreListItem from './VISRC_ViewScoreListItem'

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
        this._initializeRadio();

        this.modelEvents = {
            "all": "render"
        };
        this.childViewContainer = 'tbody';
        this.template = "#template-main_project_score_list";
        this.childView = VISRC_ViewScoreListItem;
        this.collection = new VISRC_ScoreCollection();
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
    }
}

export default VISRC_ViewScoreList;
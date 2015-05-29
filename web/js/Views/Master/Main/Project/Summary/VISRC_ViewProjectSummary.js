import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events'
import VISRC_Project from '../../../../../Models/VISRC_Project'

/**
 * This class represents the view (and controller) for the project summary.
 */
class VISRC_ViewProjectSummary extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.model = null;
        this.modelEvents = {
            "all": "render"
        };
        this._initializeRadio();
        this.ui = {
            scoreCount: '#score_count',
            workflowCount: '#workflow_count'
        }
        this.events = {
            'click @ui.scoreCount': '_handleClickScoreCount',
            'click @ui.workflowCount': '_handleClickWorkflowCount'
        };
    }

    /**
     * TODO
     */
    getTemplate()
    {
        return "#template-main_project_summary";
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
        this.rodanChannel.on(VISRC_Events.EVENT__PROJECT_SELECTED, aProject => this._handleEventProjectSelected(aProject));
    }

    /**
     * Handle project selection.
     */
    _handleEventProjectSelected(aProject)
    {
        this.model = aProject;
    }

    /**
     * TODO docs
     */
    _handleClickScoreCount()
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__SCORES_SELECTED, {project: this.model.id});
    }

    /**
     * TODO docs
     */
    _handleClickWorkflowCount()
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__WORKFLOWS_SELECTED, {project: this.model.id});
    }
}

export default VISRC_ViewProjectSummary;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_Project from '../../../../../Models/VISRC_Project';
import VISRC_ViewWorkflowRunListItem from './VISRC_ViewWorkflowRunListItem';

/**
 * This class represents the view (and controller) for a project
 */
class VISRC_ViewProject extends Marionette.CompositeView
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
        this.ui = {
            scoreCount: '#score_count',
            workflowCount: '#workflow_count'
        }
        this.events = {
            'click @ui.scoreCount': '_handleClickScoreCount',
            'click @ui.workflowCount': '_handleClickWorkflowCount'
        };
        this.childView = VISRC_ViewWorkflowRunListItem;
        this.childViewContainer = 'tbody';
    }

    /**
     * TODO
     */
    getTemplate()
    {
        return "#template-main_project_individual";
    }

    /**
     * Returns the associated WorkflowRun collection to the template.
     */
    templateHelpers() 
    {
        return { items: this.collection.toJSON() };
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
        this.rodanChannel.on(VISRC_Events.EVENT__PROJECT_SELECTED, aProject => this._handleEventItemSelected(aProject));
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(aProject)
    {
        this.model = aProject;
        this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_WORKFLOWRUN);
        this.rodanChannel.command(VISRC_Events.COMMAND__GET_WORKFLOWRUNS, {project: this.model.id});
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

export default VISRC_ViewProject;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events'
import VISRC_Workflow from '../../../../../Models/VISRC_Workflow'

/**
 * This class represents the view for a Workflow in the builder.
 */
class VISRC_ViewWorkflowBuilder extends Marionette.ItemView
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
          //  scoreCount: '#score_count',
          //  workflowCount: '#workflow_count'
        }
        this.events = {
          //  'click @ui.scoreCount': '_handleClickScoreCount',
          //  'click @ui.workflowCount': '_handleClickWorkflowCount'
        };
    }

    /**
     * TODO
     */
    getTemplate()
    {
        return "#template-main_workflow_builder";
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
        this.rodanChannel.on(VISRC_Events.EVENT__PROJECT_SELECTED, aWorkflow => this._handleEventWorkflowSelected(aWorkflow));
    }

    /**
     * Handle project selection.
     */
    _handleEventWorkflowSelected(aWorkflow)
    {
        this.model = aWorkflow;
    }
}

export default VISRC_ViewWorkflowBuilder;
import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../Shared/VISRC_Events';
import VISRC_ViewNavigationNode from './VISRC_ViewNavigationNode';
import VISRC_ViewNavigationNodeResource from './VISRC_ViewNavigationNodeResource';

/**
 * This class represents a navigation menu node for a project.
 */
class VISRC_ViewNavigationNodeProject extends VISRC_ViewNavigationNode
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.model = aParameters.model;
        this.template = "#template-navigation_node_project";
        this.childViewContainer = "ul";
        this.ui = {
            navigationProject: '#navigation-project',
            navigationResources: '#navigation-resources',
            navigationBuilder: '#navigation-builder',
            navigationAnalysisRuns: '#navigation-analysis_runs'
        }
        this.events = {
            'click @ui.navigationProject': '_handleClickNavigationProject',
            'click @ui.navigationResources': '_handleClickNavigationResources',
            'click @ui.navigationBuilder': '_handleClickNavigationBuilder',
            'click @ui.navigationAnalysisRuns': '_handleClickNavigationAnalysisRuns'
        };
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
    }

    /**
     * Handle click on nav project.
     */
    _handleClickNavigationProject()
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__PROJECT_SELECTED, {project: this.model});
    }

    /**
     * Handle click on nav resources.
     */
    _handleClickNavigationResources()
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__RESOURCES_SELECTED);
    }

    /**
     * Handle click on nav builder.
     */
    _handleClickNavigationBuilder()
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__WORKFLOWBUILDER_SELECTED, {workflow: null});
    }

    /**
     * Handle click on nav analysis runs.
     */
    _handleClickNavigationAnalysisRuns()
    {
        alert('not yet implemented');
    }
}

export default VISRC_ViewNavigationNodeProject;
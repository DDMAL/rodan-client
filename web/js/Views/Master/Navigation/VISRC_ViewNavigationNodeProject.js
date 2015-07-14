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
        this._initializeRadio();
        this.model = aParameters.model;
        this._selected = false;
        this.template = "#template-navigation_node_project_empty";
        this.childViewContainer = "ul";
        this.ui = {
            navigationProject: '#navigation-project',
            navigationResources: '#navigation-resources',
            navigationBuilder: '#navigation-builder',
            navigationWorkflowRuns: '#navigation-workflowruns'
        }
        this.events = {
            'click @ui.navigationProject': '_handleClickNavigationProject',
            'click @ui.navigationResources': '_handleClickNavigationResources',
            'click @ui.navigationBuilder': '_handleClickNavigationBuilder',
            'click @ui.navigationWorkflowRuns': '_handleClickNavigationWorkflowRuns',
            'dblclick @ui.navigationProject': '_handleDoubleClickNavigationProject',
        };
    }

    /**
     * Post-render.
     */
    onRender()
    {
        this._setHighlighted(this._selected);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this.rodanChannel.on(VISRC_Events.EVENT__PROJECT_SELECTED, aPass => this._handleSelect(aPass));
    }

    /**
     * Handle select event.
     */
    _handleSelect(aPass)
    {
        this._selected = aPass.hasOwnProperty('project') && aPass.project === this.model;
        this._setHighlighted(this._selected);
    }

    /**
     * Handle click on nav project.
     */
    _handleClickNavigationProject()
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__PROJECT_SELECTED, {project: this.model});
    }

    /**
     * Handle double-click on nav project.
     */
    _handleDoubleClickNavigationProject()
    {
        this._switchTemplate();
        this.render();
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
     * Handle click on nav workflow runs.
     */
    _handleClickNavigationWorkflowRuns()
    {
        this.rodanChannel.trigger(VISRC_Events.EVENT__WORKFLOWRUNS_SELECTED);
    }

    /**
     * Set highlighted.
     */
    _setHighlighted(aHighlighted)
    {
        // todo - magic number
        var backgroundColor = (this._selected ? '#5555ff' : '');
        this.$el.find('div#navigation-project').css('background-color', backgroundColor);
    }

    /**
     * Switches templates.
     */
    _switchTemplate()
    {
        if (this.template === "#template-navigation_node_project")
        {
            this.template = "#template-navigation_node_project_empty";
        }
        else
        {
            this.template = "#template-navigation_node_project";
        }
    }
}

export default VISRC_ViewNavigationNodeProject;
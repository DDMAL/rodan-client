import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_ViewProjectListItem from './VISRC_ViewProjectListItem';
import VISRC_Project from '../../../../../Models/VISRC_Project';

/**
 * This class represents the view (and controller) for the project list.
 */
class VISRC_ViewProjectList extends Marionette.CompositeView
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
        this.ui = {
            buttonNewProject: '#button-new_project'
        }
        this.events = {
            'click @ui.buttonNewProject': '_handleButtonNewProject'
        };
        this.childViewContainer = 'tbody';
        this.template = "#template-main_project_list";
        this.childView = VISRC_ViewProjectListItem;
        this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_PROJECT);
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
        this.rodanChannel.on(VISRC_Events.EVENT__PROJECTS_SELECTED, () => this._handleEventListSelected());
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        var user = this.rodanChannel.request(VISRC_Events.REQUEST__USER);
        this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_PROJECTS, {user: user.uuid});
    }

    /**
     * Handle button new project.
     */
    _handleButtonNewProject()
    {
        var user = this.rodanChannel.request(VISRC_Events.REQUEST__USER);
        var project = new VISRC_Project({name: "untitled", creator: user});
        project.save();
        this.collection.add(project);
    }
}

export default VISRC_ViewProjectList;
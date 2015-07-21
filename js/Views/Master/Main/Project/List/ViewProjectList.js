import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewProjectListItem from './ViewProjectListItem';
import Project from '../../../../../Models/Project';

/**
 * This class represents the view (and controller) for the project list.
 */
class ViewProjectList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize()
    {
        this._initializeRadio();
        this.modelEvents = {
            'all': 'render'
        };
        this.ui = {
            buttonNewProject: '#button-new_project'
        };
        this.events = {
            'click @ui.buttonNewProject': '_handleButtonNewProject'
        };
        this.childViewContainer = 'tbody';
        this.template = '#template-main_project_list';
        this.childView = ViewProjectListItem;
        var user = this.rodanChannel.request(Events.REQUEST__USER);
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_PROJECT);
        this.collection.reset();
        this.rodanChannel.command(Events.COMMAND__LOAD_PROJECTS, {user: user.uuid});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle button new project.
     */
    _handleButtonNewProject()
    {
        var user = this.rodanChannel.request(Events.REQUEST__USER);
        var project = new Project({name: 'untitled', creator: user});
        project.save();
        this.collection.add(project);
    }
}

export default ViewProjectList;
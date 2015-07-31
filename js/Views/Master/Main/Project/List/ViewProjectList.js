import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewProjectListItem from './ViewProjectListItem';

/**
 * Project list view.
 */
class ViewProjectList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize
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
        this.collection = this.rodanChannel.request(Events.REQUEST__PROJECT_COLLECTION);
        this.rodanChannel.command(Events.COMMAND__PROJECTS_LOAD, {user: user.get('uuid')});
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
        this.rodanChannel.command(Events.COMMAND__PROJECT_ADD, {user: user});
    }
}

export default ViewProjectList;
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
    initialize(options)
    {
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
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle button new project.
     */
    _handleButtonNewProject()
    {
        var user = this.rodanChannel.request(Events.REQUEST__AUTHENTICATION_USER);
        this.rodanChannel.request(Events.REQUEST__PROJECT_ADD, {user: user});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewProjectList.prototype.modelEvents = {
    'all': 'render'
};
ViewProjectList.prototype.ui = {
    buttonNewProject: '#button-new_project'
};
ViewProjectList.prototype.events = {
    'click @ui.buttonNewProject': '_handleButtonNewProject'
};
ViewProjectList.prototype.childViewContainer = 'tbody';
ViewProjectList.prototype.template = '#template-main_project_list';
ViewProjectList.prototype.childView = ViewProjectListItem;
ViewProjectList.prototype.behaviors = {Table: {'table': '#table-projects'}};

export default ViewProjectList;
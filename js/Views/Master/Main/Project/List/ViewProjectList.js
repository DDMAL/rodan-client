import BaseViewList from '../../BaseViewList';
import Events from '../../../../../Shared/Events';
import ViewProjectListItem from './ViewProjectListItem';

class ViewProjectList extends BaseViewList
{
    _handleButtonNewProject()
    {
        var user = this.rodanChannel.request(Events.REQUEST__AUTHENTICATION_USER);
        this.rodanChannel.request(Events.REQUEST__PROJECT_CREATE, {creator: user});
    }
}

ViewProjectList.prototype.ui = {
    buttonNewProject: '#button-new_project'
};
ViewProjectList.prototype.events = {
    'click @ui.buttonNewProject': '_handleButtonNewProject'
};
ViewProjectList.prototype.template = '#template-main_project_list';
ViewProjectList.prototype.childView = ViewProjectListItem;
ViewProjectList.prototype.behaviors = {Table: {'table': '#table-projects'}};

export default ViewProjectList;
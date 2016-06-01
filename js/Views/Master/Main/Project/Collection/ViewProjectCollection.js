import BaseViewList from 'js/Views/Master/Main/BaseViewList';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';
import ViewProjectCollectionItem from './ViewProjectCollectionItem';

/**
 * Project list view.
 */
export default class ViewProjectCollection extends BaseViewList
{
    _handleButtonNewProject()
    {
        var user = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__AUTHENTICATION_USER);
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__PROJECT_CREATE, {creator: user});
    }
}

ViewProjectCollection.prototype.ui = {
    buttonNewProject: '#button-new_project'
};
ViewProjectCollection.prototype.events = {
    'click @ui.buttonNewProject': '_handleButtonNewProject'
};
ViewProjectCollection.prototype.template = '#template-main_project_list';
ViewProjectCollection.prototype.childView = ViewProjectCollectionItem;
ViewProjectCollection.prototype.behaviors = {Table: {'table': '#table-projects'}};
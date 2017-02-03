import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Radio from 'backbone.radio';

/**
 * Item view for User Collection.
 */
export default class ViewUserCollectionItem extends BaseViewCollectionItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.project' (Project) must also be provided for the associated Project
     */
    initialize(options)
    {
        this._project = options.project;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle remove button.
     */
    _handleClickButtonRemove()
    {
        Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__PROJECT_REMOVE_USER_ADMIN,
                                       {user: this.model, project: this._project});
    }
}
ViewUserCollectionItem.prototype.ui = {
    buttonRemove: '#button-main_project_remove_admin'
};
ViewUserCollectionItem.prototype.events = {
    'click @ui.buttonRemove': '_handleClickButtonRemove'
};
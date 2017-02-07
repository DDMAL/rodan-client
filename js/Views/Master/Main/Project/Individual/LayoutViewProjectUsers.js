import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * Project admin view.
 */
export default class LayoutViewProjectUsers extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.viewusers', 'options.viewprojectadmins' and 'options.viewprojectworkers' must be provided (each being Marionette.Views); also required is 'options.project' (Project)
     */
    initialize(options)
    {
        this.addRegions({
            regionProjectAdmins: '#region-main_projectusers_admins',
            regionProjectWorkers: '#region-main_projectusers_workers',
            regionUsers: '#region-main_projectusers_users'
        });
        this._viewProjectAdmins = options.viewprojectadmins;
        this._viewProjectWorkers = options.viewprojectworkers;
        this._viewUsers = options.viewusers;
    }

    /**
     * Unbind from events.
     */
    onDestroy()
    {
        Radio.channel('rodan').off(null, null, this);
        Radio.channel('rodan').stopReplying(null, null, this);
    }

    /**
     * Before the view shows we make sure the subviews are shown.
     */
    onBeforeShow()
    {
        this.regionProjectAdmins.show(this._viewProjectAdmins);
        this.regionProjectWorkers.show(this._viewProjectWorkers);
        this.regionUsers.show(this._viewUsers);
    }

    /**
     * Handle button add selected.
     */
    _handleButtonAddSelected()
    {
 //       $(this.regionAvailableResources.el).find('tr.active').trigger('dblclick');
    }

    /**
     * Handle button remove all.
     */
    _handleButtonRemoveAll()
    {
    }

    /**
     * Handle button remove selected.
     */
    _handleButtonRemoveSelected()
    {
 //       $(this.regionAssignedResources.el).find('tr.active').trigger('dblclick');
    }
}
LayoutViewProjectUsers.prototype.template = '#template-main_project_users';
LayoutViewProjectUsers.prototype.ui = {
    buttonAddAll: '#button-add_all',
    buttonAddSelected: '#button-add_selected',
    buttonRemoveAll: '#button-remove_all',
    buttonRemoveSelected: '#button-remove_selected'
};
LayoutViewProjectUsers.prototype.events = {
    'click @ui.buttonAddAll': '_handleButtonAddAll',
    'click @ui.buttonAddSelected': '_handleButtonAddSelected',
    'click @ui.buttonRemoveAll': '_handleButtonRemoveAll',
    'click @ui.buttonRemoveSelected': '_handleButtonRemoveSelected'
};
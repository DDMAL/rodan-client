import $ from 'jquery';
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

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle button add admin.
     */
    _handleButtonAddAdmin()
    {
        console.log(this._getSelectedUser());
    }

    /**
     * Handle button add worker.
     */
    _handleButtonAddWorker()
    {
        console.log(this._getSelectedUser());
    }

    /**
     * Get currently selected user.
     */
    _getSelectedUser()
    {
        return $('#region-main_projectusers_users select').find(":selected").text();
    }
}
LayoutViewProjectUsers.prototype.template = '#template-main_project_users';
LayoutViewProjectUsers.prototype.ui = {
    buttonAddAdmin: '#button-projectusers_add_admin',
    buttonAddWorker: '#button-projectusers_add_worker'
};
LayoutViewProjectUsers.prototype.events = {
    'click @ui.buttonAddAdmin': '_handleButtonAddAdmin',
    'click @ui.buttonAddWorker': '_handleButtonAddWorker'
};
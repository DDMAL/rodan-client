import BaseController from './BaseController';
import Configuration from '../Configuration';
import Events from '../Shared/Events';
import LayoutViewModel from '../Views/Master/Main/LayoutViewModel';
import ViewRunJob from '../Views/Master/Main/RunJob/Individual/ViewRunJob';
import ViewRunJobList from '../Views/Master/Main/RunJob/List/ViewRunJobList';
import ViewRunJobListItem from '../Views/Master/Main/RunJob/List/ViewRunJobListItem';
import RunJobCollection from '../Collections/RunJobCollection';

/**
 * Controller for RunJobs.
 */
class ControllerRunJob extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     */
    initialize(options)
    {
        this._runJobLocks = {};
        setInterval(() => this._reacquire(), Configuration.RUNJOB_ACQUIRE_INTERVAL);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel.reply(Events.REQUEST__RUNJOB_SHOWLAYOUTVIEW, options => this._handleCommandShowLayoutView(options));
        this.rodanChannel.on(Events.EVENT__RUNJOB_SELECTED, options => this._handleEventItemSelected(options));
        this.rodanChannel.on(Events.EVENT__RUNJOB_SELECTED_COLLECTION, options => this._handleEventCollectionSelected(options));
        this.rodanChannel.reply(Events.REQUEST__RUNJOB_ACQUIRE, options => this._handleRequestAcquire(options));
    }

    /**
     * Handle show LayoutView.
     */
    _handleCommandShowLayoutView(options)
    {
        this._layoutView = options.layoutView;
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        this._layoutView.showItem(new ViewRunJob(options));
    }

    /**
     * Handle event collection selected.
     */
    _handleEventCollectionSelected(options)
    {
        this._collection = new RunJobCollection();
        this._collection.fetch({data: {project: options.project.id}});
        this.rodanChannel.request(Events.REQUEST__TIMER_SET_FUNCTION, {function: () => this._handleTimer()});
        this._layoutView = new LayoutViewModel();
        this.rodanChannel.request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: this._layoutView});
        var view = new ViewRunJobList({collection: this._collection,
                                       template: '#template-main_runjob_list',
                                       childView: ViewRunJobListItem});
        this._layoutView.showList(view);
    }

    /**
     * Handle timer.
     */
    _handleTimer(collection)
    {
        this._collection.syncList();
    }

    /**
     * Handle request acquire.
     */
    _handleRequestAcquire(options)
    {
        // Get lock if available. Else, if we already have the lock, simply open the interface.
        var user = this.rodanChannel.request(Events.REQUEST__AUTHENTICATION_USER);
        var runJobUrl = options.runjob.get('url');
        if (options.runjob.available())
        {
            var ajaxOptions = {
                url: options.runjob.get('interactive_acquire'),
                type: 'POST',
                dataType: 'json',
                success: (response) => this._handleSuccessAcquire(response, runJobUrl, options.runjob),
                error: () => this._removeRunJobLock(runJobUrl)
            };
            $.ajax(ajaxOptions);
        }
        else if (options.runjob.get('working_user') === user.get('url'))
        {
            var workingUrl = this._getWorkingUrl(runJobUrl);
            var newWindow = window.open(workingUrl, '_blank');
        }
    }

    /**
     * Handle success of interactive acquire.
     */
    _handleSuccessAcquire(response, runJobUrl, runJob)
    {
        this._registerRunJobForReacquire(response.working_url, runJobUrl, runJob.get('interactive_acquire'));
        this.rodanChannel.trigger(Event.EVENT__RUNJOB_ACQUIRED, {runjob: runJob});
        var newWindow = window.open(response.working_url, '_blank');
    }

    /**
     * Registers an interactive job to be relocked.
     */
    _registerRunJobForReacquire(runJobUrl, workingUrl, acquireUrl)
    {
        var date = new Date();
        this._runJobLocks[runJobUrl] = {date: date.getTime(), working_url: workingUrl, acquire_url: acquireUrl};
    }

    /**
     * Get working URL for acquired RunJob.
     */
    _getWorkingUrl(runJobUrl)
    {
        var object = this._runJobLocks[runJobUrl];
        if (object)
        {
            return object.url;
        }
        return null;
    }

    /**
     * Handle reacquire callback.
     */
    _reacquire()
    {
        var date = new Date();
        for (var runJobUrl in this._runJobLocks)
        {
            var data = this._runJobLocks[runJobUrl];
            if (data)
            {
                var timeElapsed = date.getTime() - data.date;
                if (timeElapsed < Configuration.RUNJOB_ACQUIRE_DURATION)
                {
                    $.ajax({url: data.acquire_url, type: 'POST', dataType: 'json', error: () => this._removeRunJobLock(runJobUrl)});
                }
                else
                {
                    this._removeRunJobLock(runJobUrl);
                }
            }
        }
    }

    /**
     * Remove RunJob lock.
     */
    _removeRunJobLock(runJobUrl)
    {
        this._runJobLocks[runJobUrl] = null;
    }
}

export default ControllerRunJob;
import BaseController from './BaseController';
import Events from '../Shared/Events';
import LayoutViewModel from '../Views/Master/Main/LayoutViewModel';
import ViewRunJob from '../Views/Master/Main/RunJob/Individual/ViewRunJob';
import ViewRunJobList from '../Views/Master/Main/RunJob/List/ViewRunJobList';
import ViewRunJobListItem from '../Views/Master/Main/RunJob/List/ViewRunJobListItem';
import RunJobCollection from '../Collections/RunJobCollection';

/**
 * Controller for RunJob views.
 */
class ControllerRunJob extends BaseController
{
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
   }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
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
}

export default ControllerRunJob;
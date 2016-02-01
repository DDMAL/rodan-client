import BaseController from '../../../../Controllers/BaseController';
import Events from '../../../../Shared/Events';
import LayoutViewRunJob from './LayoutViewRunJob';
import ViewRunJob from './Individual/ViewRunJob';
import ViewRunJobList from './List/ViewRunJobList';
import ViewRunJobListItem from './List/ViewRunJobListItem';

/**
 * Controller for RunJob views.
 */
class RunJobController extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        // Commands.
        this._rodanChannel.reply(Events.REQUEST__RUNJOB_SHOWLAYOUTVIEW, options => this._handleCommandShowLayoutView(options));

        // Requests.
        this._rodanChannel.on(Events.EVENT__RUNJOBS_SELECTED, options => this._handleEventListSelected(options));
        this._rodanChannel.on(Events.EVENT__RUNJOB_SELECTED, options => this._handleEventItemSelected(options));
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
     * Handle list selection.
     */
    _handleEventListSelected(options)
    {debugger;
        this._layoutView = new LayoutViewRunJob();
        this._rodanChannel.request(Events.REQUEST__NAVIGATION_LAYOUTVIEW_SHOW, this._layoutView);
        this._layoutView.showList(new ViewResourceList({query: {project: options.project.id},
                                                        template: '#template-main_runjob_list',
                                                        childView: ViewRunJobListItem}));
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        this._layoutView.showItem(new ViewRunJob(options));
    }
}

export default RunJobController;
import Radio from 'backbone.radio';

import Events from '../../../Shared/Events';
import NAV_EVENTS from './Events';
import ViewNavigationNode from './ViewNavigationNode';

/**
 * This class represents a navigation menu node for RunJobs.
 */
class ViewNavigationNodeRunJobs extends ViewNavigationNode
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
    {
        super.initialize(options);
        this.rodanChannel = Radio.channel('rodan');
        this.rodanChannel.on(Events.EVENT__RUNJOB_SELECTED_COLLECTION, options => this._handleEventCollectionSelected(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Send click events.
     */
    _sendClickEvents()
    {
        this.rodanChannel.request(Events.REQUEST__PROJECT_SET_ACTIVE, {project: this.model.get('project')});
        this.rodanChannel.trigger(Events.EVENT__RUNJOB_SELECTED_COLLECTION, {project: this.model.get('project')});
    }

    /**
     * Handle highlighting.
     */
    _handleEventCollectionSelected(options)
    {
        if (options.project === this.model.get('project'))
        {
            this.navChannel.trigger(NAV_EVENTS.EVENT__NAVIGATION_SELECTED_NODE, {node: this});
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewNavigationNodeRunJobs.prototype.template = '#template-navigation_runjobs';

export default ViewNavigationNodeRunJobs;
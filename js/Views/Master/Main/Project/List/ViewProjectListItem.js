import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * View for Project list item.
 */
class ViewProjectListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
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
        this._rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handles click.
     */
    _handleClick()
    {
        this._rodanChannel.trigger(Events.EVENT__PROJECT_SELECTED, {project: this.model});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewProjectListItem.prototype.template = '#template-main_project_list_item';
ViewProjectListItem.prototype.tagName = 'tr';
ViewProjectListItem.prototype.events = {
    'click': '_handleClick'
};
ViewProjectListItem.prototype.modelEvents = {
    'change': 'render'
};

export default ViewProjectListItem;
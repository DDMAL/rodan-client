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
     * Constructor.
     */
    constructor(aOptions)
    {
        this._initializeRadio();

        this.modelEvents = {
            'all': 'render'
        };
        this.template = '#template-main_project_list_item';
        this.tagName = 'tr';
        this.events = {
            'click': '_handleClick'
        };

        super(aOptions);
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

export default ViewProjectListItem;
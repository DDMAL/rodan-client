import _ from 'underscore';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';

/**
 * Resource list view.
 */
class ViewResourceList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(aOptions)
    {
        this._initializeRadio();
        this.collection = this._rodanChannel.request(Events.REQUEST__RESOURCE_COLLECTION);
        this._rodanChannel.request(Events.COMMAND__RESOURCES_LOAD, {query: {project: aOptions.project.id}});
        this._includeGeneratedResources = false;
    }

    /**
     * Filter override.
     */
    filter(child, index, collection)
    {
        if (!this._includeGeneratedResources)
        {
            return child.get('origin') === null;
        }
        return true;
    }

    /**
     * Setup table interface on render.
     */
    onRender()
    {
        this.ui.checkboxFilter[0].checked = this._includeGeneratedResources;
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
     * Handle checkbox for resource filtering.
     */
    _handleCheckboxFilter()
    {
        this._includeGeneratedResources = this.ui.checkboxFilter[0].checked;
        this.render();
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewResourceList.prototype.modelEvents = {
    'all': 'render'
};
ViewResourceList.prototype.collectionEvents = {
    'all': 'render'
};
ViewResourceList.prototype.ui = {
    'checkboxFilter': '#checkbox-filter'
};
ViewResourceList.prototype.events = {
    'change @ui.checkboxFilter': '_handleCheckboxFilter'
};
ViewResourceList.prototype.childViewContainer = 'tbody';

export default ViewResourceList;
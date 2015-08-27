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
    initialize(options)
    {
        this._initializeRadio();
        this.collection = this._rodanChannel.request(Events.REQUEST__RESOURCE_COLLECTION);
        this._rodanChannel.request(Events.COMMAND__RESOURCES_LOAD, {query: options.query});
        this._includeGeneratedResources = true;
        this._includeNoFileResources = false;
    }

    /**
     * Filter override.
     */
    filter(child, index, collection)
    {
        var showResource = true;
        if (!this._includeGeneratedResources)
        {
            showResource = child.get('creator') !== null && child.get('creator').last_name !== null;
        }

  /*      if (!this._includeNoFileResources)
        {
            showResource = child.get('compat_resource_file') !== null; 
        }*/
        return showResource;
    }

    /**
     * Setup table interface on render.
     */
    onRender()
    {
        if (this.ui.checkboxFilterOrigin.length > 0)
        {
            this.ui.checkboxFilterOrigin[0].checked = this._includeGeneratedResources;
        }
/*
        if (this.ui.checkboxFilterNoFile.length > 0)
        {
            this.ui.checkboxFilterNoFile[0].checked = this._includeNoFileResources;
        }*/
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
     * Handle checkbox for resource origin filtering.
     */
    _handleCheckboxFilterOrigin()
    {
        this._includeGeneratedResources = this.ui.checkboxFilterOrigin[0].checked;
        this.render();
    }

    /**
     * Handle checkbox for resource no-file filtering.
     */
    _handleCheckboxFilterNoFile()
    {
        this._includeNoFileResources = this.ui.checkboxFilterNoFile[0].checked;
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
    'checkboxFilterOrigin': '#checkbox-filter_origin',
    'checkboxFilterNoFile': '#checkbox-filter_nofile'
};
ViewResourceList.prototype.events = {
    'change @ui.checkboxFilterOrigin': '_handleCheckboxFilterOrigin',
    'change @ui.checkboxFilterNoFile': '_handleCheckboxFilterNoFile'
};
ViewResourceList.prototype.childViewContainer = 'tbody';

export default ViewResourceList;
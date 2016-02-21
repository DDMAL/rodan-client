import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../Shared/Events';

/**
 * This is a layout to help render a Collection and a single item.
 * We're using a LayoutView as opposed to a CompositeView because the single model
 * that would be associated with the CompositveView is not initially known, so it can't
 * rerend.
 */
class LayoutViewResource extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize(options)
    {
        this._initializeRadio();
        this.addRegions({
            regionList: '#region-main_resource_list',
            regionItem: '#region-main_resource_item'
        });
        this.rodanChannel.request(Events.REQUEST__SET_TIMED_REQUEST, {request: Events.REQUEST__RESOURCES_SYNC, 
                                                                       options: {}, 
                                                                       callback: null});
    }

    /**
     * Show view in Resource list region.
     */
    showList(view)
    {
        this.regionList.show(view);
    }

    /**
     * Show view in Resource item region.
     */
    showItem(view)
    {
        this.regionItem.show(view);
    }

    /**
     * Clear item view.
     */
    clearItemView()
    {
        this.regionItem.reset();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }

    /**
     * Handle add button.
     */
    _handleClickButtonFile()
    {
        var file = this.ui.fileInput[0].files[0];
        this.ui.fileInput.replaceWith(this.ui.fileInput = this.ui.fileInput.clone(true));
        this.rodanChannel.request(Events.REQUEST__RESOURCE_CREATE, {project: this.model, file: file});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewResource.prototype.template = '#template-main_resource';
LayoutViewResource.prototype.ui = {
    fileInput: '#file-main_resource_file'
};
LayoutViewResource.prototype.events = {
    'change @ui.fileInput': '_handleClickButtonFile'
};

export default LayoutViewResource;
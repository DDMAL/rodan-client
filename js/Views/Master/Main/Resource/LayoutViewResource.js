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
    initialize(aOptions)
    {
        this._initializeRadio();
        this.addRegions({
            regionList: '#region-main_resource_list',
            regionItem: '#region-main_resource_item'
        });
        this._project = aOptions.project;
    }

    /**
     * Show view in Resource list region.
     */
    showList(aView)
    {
        this.regionList.show(aView);
    }

    /**
     * Show view in Resource item region.
     */
    showItem(aView)
    {
        this.regionItem.show(aView);
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
     * Handle add button.
     */
    _handleClickButtonFile()
    {
        var file = this.ui.fileInput[0].files[0];
        this.ui.fileInput.replaceWith(this.ui.fileInput = this.ui.fileInput.clone(true));
        this._rodanChannel.request(Events.REQUEST__RESOURCE_ADD, {project: this._project, file: file});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
LayoutViewResource.prototype.ui = {
    fileInput: '#file-main_resource_file'
};
LayoutViewResource.prototype.events = {
    'change @ui.fileInput': '_handleClickButtonFile'
};
LayoutViewResource.prototype.template = '#template-main_resource';

export default LayoutViewResource;
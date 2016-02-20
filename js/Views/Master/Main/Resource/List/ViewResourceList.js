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
        this._project = options.project;
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
        this.rodanChannel.request(Events.REQUEST__RESOURCE_CREATE, {project: this._project, file: file});
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewResourceList.prototype.modelEvents = {
    'all': 'render'
};
ViewResourceList.prototype.ui = {
    fileInput: '#file-main_resource_file'
};
ViewResourceList.prototype.events = {
    'change @ui.fileInput': '_handleClickButtonFile'
};
ViewResourceList.prototype.childViewContainer = 'tbody';
ViewResourceList.prototype.behaviors = {Table: {'table': '#table-resources'}};

export default ViewResourceList;
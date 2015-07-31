import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import ViewResourceListItem from './ViewResourceListItem';

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
        this.modelEvents = {
            'all': 'render'
        };
        this.ui = {
            buttonAdd: '#button-main_resource_list_add',
            fileInput: '#file-main_resource_list_file'
        };
        this.events = {
            'click @ui.buttonAdd': '_handleClickButtonAdd'
        };
        this._project = aOptions.project;
        this.template = '#template-main_resource_list';
        this.childView = ViewResourceListItem;
        this.childViewContainer = 'tbody';
        this.collection = this._rodanChannel.request(Events.REQUEST__RESOURCE_COLLECTION);
        this._rodanChannel.command(Events.COMMAND__RESOURCES_LOAD, {project: this._project.id});
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
    _handleClickButtonAdd()
    {
        var file = this.ui.fileInput[0].files[0];
        if (file === undefined)
        {
            alert('TODO -error');
            return;
        }
        this._rodanChannel.command(Events.COMMAND__RESOURCE_ADD, {project: this._project, file: file});
    }
}

export default ViewResourceList;
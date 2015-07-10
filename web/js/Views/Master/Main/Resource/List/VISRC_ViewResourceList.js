import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import VISRC_Events from '../../../../../Shared/VISRC_Events';
import VISRC_Resource from '../../../../../Models/VISRC_Resource';
import VISRC_ViewResourceListItem from './VISRC_ViewResourceListItem';

/**
 * This class represents the view (and controller) for the resource list.
 */
class VISRC_ViewResourceList extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * TODO docs
     */
    initialize(aParameters)
    {
        this.modelEvents = {
            "all": "render"
        };
        this._initializeRadio();
        this.template = "#template-main_resource_list";
        this.childView = VISRC_ViewResourceListItem;
        this.childViewContainer = 'tbody';
        this.ui = {
            buttonAdd: '#button-main_resource_list_add',
            fileInput: '#file-main_resource_list_file'
        }
        this.events = {
            'click @ui.buttonAdd': '_handleClickButtonAdd'
        };
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel("rodan");
        this.rodanChannel.on(VISRC_Events.EVENT__RESOURCES_SELECTED, () => this._handleEventListSelected());
    }

    /**
     * Handle list selection.
     */
    _handleEventListSelected()
    {
        var project = this.rodanChannel.request(VISRC_Events.REQUEST__PROJECT_ACTIVE);
        this.collection = this.rodanChannel.request(VISRC_Events.REQUEST__COLLECTION_RESOURCE);
        this.rodanChannel.command(VISRC_Events.COMMAND__LOAD_RESOURCES, {project: project.id});
    }

    /**
     * Handle add button.
     */
    _handleClickButtonAdd()
    {
        var file = this.ui.fileInput[0].files[0];
        if (file === undefined)
        {
            alert("TODO -error");
            return;
        }
        var project = this.rodanChannel.request(VISRC_Events.REQUEST__PROJECT_ACTIVE);
        var resource = new VISRC_Resource({project: project.get("url")});
        resource.save({file: file});
        this.collection.add(resource);
    }
}

export default VISRC_ViewResourceList;
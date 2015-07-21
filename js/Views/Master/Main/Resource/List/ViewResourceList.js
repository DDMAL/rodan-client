import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from '../../../../../Shared/Events';
import Resource from '../../../../../Models/Resource';
import ViewResourceListItem from './ViewResourceListItem';

/**
 * This class represents the view (and controller) for the resource list.
 */
class ViewResourceList extends Marionette.CompositeView
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
        this._project = aParameters.project;
        this.template = "#template-main_resource_list";
        this.childView = ViewResourceListItem;
        this.childViewContainer = 'tbody';
        this.ui = {
            buttonAdd: '#button-main_resource_list_add',
            fileInput: '#file-main_resource_list_file'
        }
        this.events = {
            'click @ui.buttonAdd': '_handleClickButtonAdd'
        };
        this.collection = this.rodanChannel.request(Events.REQUEST__COLLECTION_RESOURCE);
        this.collection.reset();
        this.rodanChannel.command(Events.COMMAND__LOAD_RESOURCES, {project: this._project.id});
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
        var project = this.rodanChannel.request(Events.REQUEST__PROJECT_ACTIVE);
        var resource = new Resource({project: project.get("url")});
        resource.save({file: file});
        this.collection.add(resource);
    }
}

export default ViewResourceList;
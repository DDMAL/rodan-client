import $ from 'jquery';
import RODAN_EVENTS from 'js/Shared/RODAN_EVENTS';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import ViewResourceTypeCollectionItem from 'js/Views/Master/Main/ResourceType/ViewResourceTypeCollectionItem';

/**
 * Resource Multi-Select View
 */
export default class ViewResourceMulti extends Marionette.CollectionView
{
    constructor(options) {
        super(options);
        this._models = options.models;
    }
    /**
     * Initialize buttons after render.
     */
    onRender()
    {
        var disabledDelete = false;
        var disabledDownload = false;
        for (var model of this._models) {
            if (model.get('origin') !== null) {
                disabledDelete = true;
            }
            if (model.get('download') === null) {
                disabledDownload = true;
            }
        }
        $(this.ui.buttonDelete).attr('disabled', disabledDelete);
        $(this.ui.buttonDownload).attr('disabled', disabledDownload);

        // Disable all other buttons for now.
        $(this.ui.buttonSave).attr('disabled', true);
        $(this.ui.buttonView).attr('disabled', true);
    }

    templateContext() {
        return {
            count: this._models.size
        };
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle button delete.
     */
    _handleClickButtonDelete()
    {
        for (var model of this._models) {
            Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__RESOURCE_DELETE, {resource: model});
        }
    }

    _handleClickButtonDownload()
    {
        for (var model of this._models) {
            Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__RESOURCE_DOWNLOAD, {resource: model});
        }
    }
}
ViewResourceMulti.prototype.modelEvents = {
};
ViewResourceMulti.prototype.ui = {
    buttonSave: '#button-main_resource_individual_save',
    buttonDelete: '#button-main_resource_individual_delete',
    buttonDownload: '#button-main_resource_individual_download',
    buttonView: '#button-main_resource_individual_view'
};
ViewResourceMulti.prototype.events = {
    'click @ui.buttonDelete': '_handleClickButtonDelete',
    'click @ui.buttonDownload': '_handleClickButtonDownload'
};
ViewResourceMulti.prototype.template = '#template-main_resource_individual_multi';

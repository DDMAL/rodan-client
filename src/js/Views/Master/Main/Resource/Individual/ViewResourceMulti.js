import $ from 'jquery';
import _ from 'underscore';
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

        var rtUrl;
        this.isSame = true;

        for (let model of this._models) {
            let modelResourceTypeURL = model.get('resource_type');
            if (rtUrl === undefined) {
                rtUrl = modelResourceTypeURL;
            }
            else if (rtUrl !== modelResourceTypeURL) {
                this.isSame = false;
            }
        }

        this.collection = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_RESOURCETYPE_COLLECTION);
        this.collection.each(function(model) { model.unset('selected'); });
        var resourceType = this.collection.findWhere({url: rtUrl});
        resourceType.set('selected', 'selected');
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

        $(this.ui.buttonSave).attr('disabled', !this.isSame);
        $(this.ui.selectResourceType).attr('disabled', !this.isSame);

        // Disable all other buttons for now.
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

    _handleClickButtonSave()
    {
        for (var model of this._models) {
            Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__RESOURCE_SAVE, {resource: model,
                fields: {resource_type: this.ui.selectResourceType.find(':selected').val()}
            });
        }
    }
}
ViewResourceMulti.prototype.modelEvents = {
};
ViewResourceMulti.prototype.ui = {
    buttonSave: '#button-main_resource_individual_save',
    buttonDelete: '#button-main_resource_individual_delete',
    buttonDownload: '#button-main_resource_individual_download',
    buttonView: '#button-main_resource_individual_view',
    selectResourceType: '#select-resourcetype'
};
ViewResourceMulti.prototype.events = {
    'click @ui.buttonDelete': '_handleClickButtonDelete',
    'click @ui.buttonDownload': '_handleClickButtonDownload',
    'click @ui.buttonSave': '_handleClickButtonSave'
};
ViewResourceMulti.prototype.template = _.template($('#template-main_resource_individual_multi').text());
ViewResourceMulti.prototype.childView = ViewResourceTypeCollectionItem;
ViewResourceMulti.prototype.childViewContainer = '#select-resourcetype';

import _ from 'underscore';

import BaseCollection from '../Collections/BaseCollection';
import Events from '../Shared/Events';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * This class represents the table Behavior for views.
 */
class BehaviorTable extends Marionette.Behavior
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
        this._hasCheckedFiltering = false;
    }

    /**
     * When a view has rendered, we want to inject the pagination HTML.
     */
    onRender(view)
    {
        // Not really pretty, but works for now. Marionette calls 'delegateEvents'
        // bevore our custom 'initialize' on the view. However, at that point, the
        // collection is not yet set in the view, so binding doesn't work. This next
        // line is a work around.
        // TODO - fix/find better way
        this.view.delegateEvents();
        if (view.collection)
        {
            this._handleCollectionEventSync(view.collection);
        }
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
     * Handle pagination previous.
     */
    _handlePaginationPrevious()
    {
        var pagination = this.view.collection.getPagination();
        var data = this._getURLQueryParameters(pagination.get('previous'));
        this.view.collection.fetch({data: data, reset: true});
    }

    /**
     * Handle pagination next.
     */
    _handlePaginationNext()
    {
        var pagination = this.view.collection.getPagination();
        var data = this._getURLQueryParameters(pagination.get('next'));
        this.view.collection.fetch({data: data, reset: true});
    }

    /**
     * Handles collection event.
     */
    _handleCollectionEventSync(returnObject)
    {
        if (returnObject instanceof BaseCollection)
        {
            // Get options. If they exist, apply filtering and ordering to the template.
            if (returnObject.route)
            {
                var options = this.rodanChannel.request(Events.REQUEST__SERVER_ROUTE_OPTIONS, returnObject.route);
                if (options)
                {
                    this._injectFiltering(options.filter_fields);
                }
            }

            // Handle pagination.
            var pagination = returnObject.getPagination();
            if (pagination !== null/* && pagination.get('total') > 1*/)
            {
                this._injectPagination(pagination);
            }
            else
            {
                this._removePagination();
            }
        }
    }

    /**
     * Injects pagination functionality into view/template.
     */
    _injectPagination(pagination)
    {
        if ($(this.el).find('#pagination').length === 0)
        {
            $(this.el).find(this.options.table).before($(this.options.templatePagination).html());
        }

        // Set buttons.
        $(this.el).find('#pagination #pagination-previous').hide();
        $(this.el).find('#pagination #pagination-next').hide();
        if (pagination.get('current') < pagination.get('total'))
        {
            $(this.el).find('#pagination #pagination-next').show();
        }
        if (pagination.get('current') > 1)
        {
            $(this.el).find('#pagination #pagination-previous').show();
        }
    }

    /**
     * Injects filtering functionality into template.
     *
     * - icontains: have a text box for searching; should be automatically created
     * - if the template has a column marked as 'data-enum', this should tell the app
     * that values corresponding to that field can be enumerated
     */
    _injectFiltering(filterFields)
    {
        if (!this._hasCheckedFiltering)
        {
            var filtersInserted = false;
            this._hasCheckedFiltering = true;

            // Insert parent div. Also bind the form to a dummy function.
            $(this.el).find(this.options.table).before($(this.options.templateFilter).html());
            $(this.el).find('form#form-filter').bind('submit', function() {return false;});

            // Get those columns with data names.
            var columns = $(this.el).find(this.options.table + ' thead th').filter(function() { return $(this).attr('data-name'); });
            for (var i = 0; i < columns.length; i++)
            {
                var column = $(columns[i]);
                var field = column.attr('data-name');
                if (filterFields[field])
                {
                    for (var j = 0; j < filterFields[field].length; j++)
                    {
                        var filter = filterFields[field][j];
                        switch (filter)
                        {
                            case 'icontains':
                            {
                                filtersInserted = true;
                                this._injectFilterText(column.text(), field);
                                break;
                            }

                            case 'gt':
                            {
                            //    this._injectFilterDatetimeGt(column.text(), field);
                                break;
                            }

                            case 'lt':
                            {
                            //    this._injectFilterDatetimeLt(column.text(), field);
                                break;
                            }

                            default:
                            {
                                break;
                            }
                        }
                    }
                }
            }

            // Finally, inject enumeration.
            var enumerations = this.view.collection.getEnumerations();
            for (var i in enumerations)
            {
                filtersInserted = true;
                var enumeration = enumerations[i];
                var template = _.template($(this.options.templateFilterEnum).html());
                $(this.el).find('div#filter').append(template({label: enumeration.label, field: enumeration.field, values: enumeration.values}));
            }

            // If nothing was inserted, remove the filter stuff.
            if (!filtersInserted)
            {
                $(this.el).remove('div#filter');
            }
        }
    }

    /**
     * Inject text filter.
     */
    _injectFilterText(label, field)
    {
        var template = _.template($(this.options.templateFilterText).html());
        $(this.el).find('div#filter').append(template({label: label, field: field}));
    }

    /**
     * Inject lt datetime filter.
     */
    _injectFilterDatetimeLt(label, field)
    {
        this._injectFilterDatetime(label, field);
        var template = _.template($(this.options.templateFilterDatetimeLt).html());
        $(this.el).find('div#filter_datetime_' + field).append(template({label: label, field: field}));  
    }

    /**
     * Inject gt datetime filter.
     */
    _injectFilterDatetimeGt(label, field)
    {
        this._injectFilterDatetime(label, field);
        var template = _.template($(this.options.templateFilterDatetimeGt).html());
        $(this.el).find('div#filter_datetime_' + field).append(template({label: label, field: field}));  
    }

    /**
     * Inject master datetime filter template.
     */
    _injectFilterDatetime(label, field)
    {
        if ($(this.el).find('div#filter_datetime_' + field).length === 0)
        {
            var template = _.template($(this.options.templateFilterDatetime).html());
            $(this.el).find('div#filter').append(template({label: label, field: field}));  
        }
    }

    /**
     * Removes pagination.
     */
    _removePagination()
    {
        $(this.el).remove('#pagination');
    }

    /**
     * Returns query parameters from passed URL string.
     *
     * TODO: move this out of here...
     */
    _getURLQueryParameters(string)
    {
        var queryString = string.substr(string.indexOf('?') + 1),
            match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };

        var urlParams = {};
        while (match = search.exec(queryString))
            urlParams[decode(match[1])] = decode(match[2]);
        return urlParams;
    }

    /**
     * Handles sort request.
     *
     * Defaults to ascending. Only goes descending if the associated ascending
     * CSS style is currently attached to the target th.
     */
    _handleSort(event)
    {
        // Only use this if the collection has a route.
        if (!this.view.collection.route)
        {
            return;
        }

        var sortField = $(event.currentTarget).attr('data-name');
        if (sortField)
        {
            // Check for sort arrow "up" already there. If so, we want down (else, up).
            var ascending = true;
            if ($(event.currentTarget).find('span.glyphicon-arrow-up').length > 0)
            {
                ascending = false;
            }

            // Do the sort.
            this.view.collection.fetchSort(ascending, sortField);

            // Set the sort arrows properly.
            $(event.currentTarget).parent().find('th span.glyphicon').remove();
            if (ascending)
            {
                $(event.currentTarget).append('<span class="glyphicon glyphicon-arrow-up"></span>');
            }
            else
            {
                $(event.currentTarget).append('<span class="glyphicon glyphicon-arrow-down"></span>');
            }
        }
    }

    /**
     * Handle search.
     */
    _handleSearch(event)
    {
        // Only use this if the collection has a URL.
        if (!this.view.collection.route)
        {
            return;
        }

        var values = $(this.el).find('#form-filter').serializeArray();
        var filters = {};
        for (var index in values)
        {
            var name = values[index].name;
            var value = values[index].value;
            filters[name] = value;
        }
        this.view.collection.fetchFilter(filters);
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
BehaviorTable.prototype.ui = {
    paginationPrevious: '#pagination-previous',
    paginationNext: '#pagination-next',
    buttonSearch: '#button-search',
};
BehaviorTable.prototype.events = {
    'click @ui.paginationPrevious': '_handlePaginationPrevious',
    'click @ui.paginationNext': '_handlePaginationNext',
    'click th': '_handleSort',
    'click @ui.buttonSearch': '_handleSearch',
};
BehaviorTable.prototype.defaults = {
    'templatePagination': '#template-pagination',
    'templateFilter': '#template-filter',
    'templateFilterText': '#template-filter_text',
    'templateFilterEnum': '#template-filter_enumeration',
    'templateFilterDatetime': '#template-filter_datetime',
    'templateFilterDatetimeLt': '#template-filter_datetime_lt',
    'templateFilterDatetimeGt': '#template-filter_datetime_gt',
    'table': 'table'
};
BehaviorTable.prototype.collectionEvents = {
    'sync': '_handleCollectionEventSync'
}

export default BehaviorTable;
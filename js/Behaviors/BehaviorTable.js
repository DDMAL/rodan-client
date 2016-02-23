import _ from 'underscore';
import datetimepicker from 'datetimepicker';

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
        this._filtersInjected = false;
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

        // Inject control.
        this._injectControl();

        // Inject the controls.
        if (view.collection)
        {
            this._handleCollectionEventSync(view.collection);
        }
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - initialization
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        this.rodanChannel = Radio.channel('rodan');
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - injectors
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Inject control.
     */
    _injectControl()
    {
        if (this.$el.find('.table-control').length === 0)
        {
            this.$el.find('div.table-responsive').before($(this.options.templateControl).html());
        }
    }

    /**
     * Injects filtering functionality into template.
     */
    _injectFiltering(filterFields)
    {
        if ($(this.el).find('form#form-filter').length > 0)
        {
            return;
        }
        
        // Insert parent div. Also bind the form to a dummy function.
        $(this.el).find('#filter').prepend($(this.options.templateFilter).html());
        $(this.el).find('form#form-filter').bind('submit', function() {return false;});

        // Get those columns with data names.
        var filters = [];
        var datetimepickerElements = [];
        var columns = $(this.el).find(this.options.table + ' thead th').filter(function() { return $(this).attr('data-name'); });
        for (var i = 0; i < columns.length; i++)
        {
            var column = $(columns[i]);
            var field = column.attr('data-name');
            var datetimeLtFilter = null;
            var datetimeGtFilter = null;
            if (filterFields[field])
            {
                for (var j = 0; j < filterFields[field].length; j++)
                {
                    var filter = filterFields[field][j];
                    switch (filter)
                    {
                        case 'icontains':
                        {
                            filters.push(this._getFilterText(column.text(), field));
                            break;
                        }

                        case 'gt':
                        {
                            datetimeGtFilter = this._getFilterDatetimeGt(column.text(), field);
                            break;
                        }

                        case 'lt':
                        {
                            datetimeLtFilter = this._getFilterDatetimeLt(column.text(), field);
                            break;
                        }

                        default:
                        {
                            break;
                        }
                    }
                }

                // Check for datetime filters.
                if (datetimeGtFilter || datetimeLtFilter)
                {
                    var $datetimeFilter = $(this._getFilterDatetime(column.text(), field));
                    var needTo = false;
                    if (datetimeGtFilter)
                    {
                        needTo = true;
                        $datetimeFilter.append(datetimeGtFilter);
                        var elementId = '#' + field + '__gt';
                        datetimepickerElements.push(elementId);
                    }
                    if (datetimeLtFilter)
                    {
                        $datetimeFilter.append('to');
                        $datetimeFilter.append(datetimeLtFilter);
                        var elementId = '#' + field + '__lt';
                        datetimepickerElements.push(elementId);
                    }
                    filters.push($datetimeFilter.html());
                }
            }
        }

        // Finally, get enumerations.
        var enumerations = this.view.collection.getEnumerations();
        for (var i in enumerations)
        {
            var enumeration = enumerations[i];
            var template = _.template($(this.options.templateFilterEnum).html());
            filters.push(template({label: enumeration.label, field: enumeration.field, values: enumeration.values}));
        }

        // Inject.
        if (filters.length > 0)
        {
            // Inject filters.
            for (var index in filters)
            {
                $(this.el).find('form#form-filter').prepend(filters[index]);
            }

            // Setup datetimepickers.
            for (var index in datetimepickerElements)
            {
                var elementId = datetimepickerElements[index];
                $(elementId).datetimepicker();
            }
        }
        else
        {
            $(this.el).find('form#form-filter').hide();
        }
    }

    /**
     * Get text filter.
     */
    _getFilterText(label, field)
    {
        var template = _.template($(this.options.templateFilterText).html());
        return template({label: label, field: field});
    }

    /**
     * Get lt datetime filter.
     */
    _getFilterDatetimeLt(label, field)
    {
        var template = _.template($(this.options.templateFilterDatetimeLt).html());
        var elementId = '#' + field + '__lt';
        return template({label: label, field: field});
    }

    /**
     * Get gt datetime filter.
     */
    _getFilterDatetimeGt(label, field)
    {
        var template = _.template($(this.options.templateFilterDatetimeGt).html());
        var elementId = '#' + field + '__gt';
        return template({label: label, field: field});
    }

    /**
     * Get master datetime filter template.
     */
    _getFilterDatetime(label, field)
    {
        var template = _.template($(this.options.templateFilterDatetime).html());
        return template({label: label, field: field});  
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Event handlers
///////////////////////////////////////////////////////////////////////////////////////
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
     * Handle pagination previous.
     */
    _handlePaginationPrevious()
    {
        var pagination = this.view.collection.getPagination();
        var data = this._getURLQueryParameters(pagination.get('previous'));
        if (data.page)
        {
            this.view.collection.fetchPage({page: data.page});
        }
        else
        {
            this.view.collection.fetchPage({}); 
        }
    }

    /**
     * Handle pagination next.
     */
    _handlePaginationNext()
    {
        var pagination = this.view.collection.getPagination();
        var data = this._getURLQueryParameters(pagination.get('next'));
        this.view.collection.fetchPage({page: data.page});
    }

    /**
     * Handles collection event.
     */
    _handleCollectionEventSync(returnObject)
    {
        if (returnObject instanceof BaseCollection)
        {
            // Get options. If they exist and filters haven't been injected, inject.
            if (returnObject.route && !this._filtersInjected)
            {
                var options = this.rodanChannel.request(Events.REQUEST__SERVER_ROUTE_OPTIONS, returnObject.route);
                if (options)
                {
                    this._filtersInjected = true;
                    this._injectFiltering(options.filter_fields);
                }
            }

            // Handle pagination.
            var pagination = returnObject.getPagination();
            $(this.el).find('.table-control #pagination-previous').hide();
            $(this.el).find('.table-control #pagination-next').hide();
            if (pagination !== null/* && pagination.get('total') > 1*/)
            {
                if (pagination.get('current') < pagination.get('total'))
                {
                    $(this.el).find('.table-control #pagination-next').show();
                }
                if (pagination.get('current') > 1)
                {
                    $(this.el).find('.table-control #pagination-previous').show();
                }
            }
        }
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
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
    'templateControl': '#template-table_control',
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
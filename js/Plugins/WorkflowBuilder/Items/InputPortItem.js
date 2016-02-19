import BaseItem from './BaseItem';
import Configuration from '../../../Configuration';
import Events from '../../../Shared/Events';

/**
 * InputPort item.
 */
class InputPortItem extends BaseItem
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC STATIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Returns context menu data for multiple items of this class.
     * Takes in URLs of multiple selections.
     *
     * The menu data is simply an array of objects. Objects should be:
     *
     * {
     *      label: [string] // The text that should appear
     *      radiorequest: Events.?  // The Request to make. NOT A RADIO EVENT, rather a REQUEST.
     *      options: Object holding any options for Event
     * }
     */
    static getContextMenuDataMultiple()
    {
        return [{label: 'Create Resource Distributor', radiorequest: Events.REQUEST__WORKFLOWBUILDER_GUI_ADD_RESOURCEDISTRIBUTOR},
                {label: 'Cancel', radiorequest: Events.REQUEST__WORKFLOWBUILDER_GUI_HIDE_CONTEXTMENU}];
    }

///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(options)
    {
        super(options);
        this.getModelEvent = Events.REQUEST__WORKFLOWBUILDER_GET_INPUTPORT;
        this._connectionItem = null;
        this._workflowJobItem = options.workflowjobitem;
        this.onDoubleClick = event => this._handleDoubleClick(event);
    }

    /**
     * Return true iff this item can be moved by itself.
     */
    isMoveable()
    {
        return false;
    }

    /**
     * Sets associated connection item.
     */
    setConnectionItem(item)
    {
        this._connectionItem = item;
    }

    /**
     * Return true iff has connection item.
     */
    hasConnectionItem()
    {
        return this._connectionItem !== null;
    }

    /**
     * Return true iff satisfied.
     */
    isSatisfied()
    {
        var resourceAssignments = this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_GET_RESOURCEASSIGNMENTS, {url: this.getModelURL()});
        return this.hasConnectionItem() || resourceAssignments.length > 0;
    }

    /**
     * Update.
     */
    update()
    {
        this.fillColor = this.isSatisfied() ? Configuration.WORKFLOWBUILDER.INPUTPORT_COLOR_SATISFIED : 
                                              Configuration.WORKFLOWBUILDER.INPUTPORT_COLOR_UNSATISFIED;
        if (this._connectionItem !== null)
        {
            this._connectionItem.setVisible(this.visible);
        }
    }

    /**
     * Disassociate self with WorkflowJobItem.
     */
    disassociate()
    {
        this._workflowJobItem.deleteInputPortItem(this);
    }

    /**
     * Reassociates itself with WorkflowJobItem.
     */
    reassociate()
    {
        this._workflowJobItem.addInputPortItem(this);
    }

    /**
     * Destroy cleanup.
     */
    destroy()
    {
        if (this.hasConnectionItem())
        {
            this._connectionItem.destroy();
            this._connectionItem = null;
        }
        super.destroy();
    }

    /**
     * Returns context menu data for single item of this class.
     * We override as some things should not be visible.
     */
    getContextMenuDataSingle()
    {
        var menuItems = [];
        if (!this.hasConnectionItem())
        {
            menuItems.push({label: 'Assign Resources', radiorequest: Events.REQUEST__WORKFLOWBUILDER_SHOW_RESOURCEASSIGNMENT_VIEW, options: {url: this.getModelURL()}});
        }
        return menuItems;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle double click.
     */
    _handleDoubleClick(mouseEvent)
    {
        if (!this.hasConnectionItem())
        {
            this.rodanChannel.request(Events.REQUEST__WORKFLOWBUILDER_SHOW_RESOURCEASSIGNMENT_VIEW, {url: this.getModelURL()});
        }
    }
}

export default InputPortItem;
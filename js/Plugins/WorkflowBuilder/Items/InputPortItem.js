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

        // Get getter Event.
        this.getModelEvent = Events.REQUEST__WORKFLOWBUILDER_GET_INPUTPORT;

        this._connectionItem = null;
        this._workflowJobItem = options.workflowjobitem;
        this.update();
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
    setConnectionItem(aItem)
    {
        this._connectionItem = aItem;
        this.update();
    }

    /**
     * Return true iff has connection item.
     */
    hasConnectionItem()
    {
        return this._connectionItem !== null;
    }

    /**
     * Update.
     */
    update()
    {
        this.fillColor = this.hasConnectionItem() ? Configuration.WORKFLOWBUILDER.INPUTPORT_COLOR_SATISFIED : 
                                                    Configuration.WORKFLOWBUILDER.INPUTPORT_COLOR_UNSATISFIED;
        if (this._connectionItem !== null)
        {
            this._connectionItem.setVisible(this.visible);
            if (this.visible)
            {
                this._connectionItem.update();
            }
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

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
}

export default InputPortItem;
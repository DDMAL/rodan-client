import BaseItem from './BaseItem';
import Configuration from '../../../Configuration';
import Events from '../../../Shared/Events';

/**
 * InputPort item.
 */
class InputPortItem extends BaseItem
{
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
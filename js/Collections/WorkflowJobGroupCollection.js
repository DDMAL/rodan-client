import BaseCollection from './BaseCollection';
import WorkflowJobGroup from '../Models/WorkflowJobGroup';

/**
 * Collection of WorkflowJobGroup models.
 */
class WorkflowJobGroupCollection extends BaseCollection
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this.model = WorkflowJobGroup;
        this.route = 'workflowjobgroups';

        // TODO - doing a fetch on a collection isn't firing events, so I need to do this.
        this.on('sync', (collection, response, options) => this._onSync(collection, response, options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Every sync, just save each model.
	 */
	_onSync(collection, response, options)
	{
		for (var i = 0; i < collection.length; i++)
		{
			var model = collection.at(i);
			model.save();
		}
	}
}

export default WorkflowJobGroupCollection;
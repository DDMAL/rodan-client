import Radio from 'backbone.radio';
import RODAN_EVENTS from './RODAN_EVENTS';

export default class AbstractUpdater
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Sets the collections that are to be updated.
	 */
	setCollections(collections)
	{
		this.clear();
		this._collections = collections;
	}

	/**
	 * Updates registered collections.
	 */
	update()
	{
		if (this._collections)
		{
			for (var i = 0; i < this._collections.length; i++)
			{
				this._collections[i].syncList();
			}
		}
	}
    
    clear()
    {
    	this._collection = null;
    }
}
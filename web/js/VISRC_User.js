import Backbone from 'backbone';
import Radio from 'backbone.radio';

class VISRC_User extends Backbone.Model
{
    constructor(data)
    {
        this.idAttribute = 'url';
        super(data);
        this.rodanChannel = Radio.channel('rodan');
    }
}

export default VISRC_User;
import _ from 'underscore';

function mapFromJsonObject(JsonObject)
{
    var keyvals = _.pairs(JsonObject);
    var map = new Map(keyvals);
    return map;
}

export { mapFromJsonObject };

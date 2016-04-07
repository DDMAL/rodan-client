/**
 * Holds client information (not configuration).
 */
var Info = {};

///////////////////////////////////////////////////////////////////////////////////////
// Loader methods
///////////////////////////////////////////////////////////////////////////////////////
/**
 * Requests 'info.json' from the client host.
 * A callback may be provided.
 */
Info.load = function(callback)
{
    var request = new XMLHttpRequest();
    request.open('GET', 'info.json', true);
    request.onreadystatechange = (event) => this._handleStateChange(event, callback);
    request.send();
}

/**
 * Handle state change of request.
 */
Info._handleStateChange = function(event, callback)
{
    var request = event.currentTarget;
    switch (request.readyState)
    {
        case 0: //UNSENT
        {
            break;
        }

        case 1: //OPENED
        {
            break;
        }

        case 2: //HEADERS_RECEIVED
        {
            break;
        }

        case 3: //LOADING
        {
            break;
        }

        case 4:
        {
            var info = JSON.parse(request.response);
            $.extend(this, info);
            if (callback)
            {
                callback();
            }
            break;
        }

        default:
        {
            // TODO error
            console.error('failed to load info.json');
            break;
        }
    }
}

export default Info;
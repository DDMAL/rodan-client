/*
 * ES6 Port of the Cappuccino CPCookie Class.
 **/
class Cookie
{
    static saveCookie(name, value, days)
    {
        var date = new Date();
        date.setTime(date.getTime() + (days * 86400000));
        var expires = 'expires=' + date.toUTCString();
        document.cookie = name + '=' + value + '; ' + expires;
    }

    constructor(name)
    {
        this._cookieName = name;
        this._cookieValue = this._readCookieValue();
        this._expires = null;
    }

    get name()
    {
        return this._cookieName;
    }

    get value()
    {
        return this._cookieValue;
    }

    get expires()
    {
        return this._expires;
    }

    _readCookieValue()
    {
        var name = this._cookieName + '=',
            ca = document.cookie.split(';');

        for (var i = 0, len = ca.length; i < len; i++)
        {
            var c = ca[i];
            while (c.charAt(0) === ' ')
            {
                c = c.substring(1, c.length);
            }

            if (c.indexOf(name) === 0)
            {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }
}

export default Cookie;
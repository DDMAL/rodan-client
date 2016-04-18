
let _os = null;
let _keyMultipleSelection = null;

/**
 * Global environment constants.
 */
export default class Environment
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS - Static
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Returns string denoting detected operating system.
     *
     * @return {string} 'Windows', 'MacOS', 'UNIX', 'Linux', or 'Unknown OS'
     */
    static getOS()
    {
        if (_os === null)
        {
            _os="Unknown OS";
            if (navigator.appVersion.indexOf("Win")!=-1) _os="Windows";
            if (navigator.appVersion.indexOf("Mac")!=-1) _os="MacOS";
            if (navigator.appVersion.indexOf("X11")!=-1) _os="UNIX";
            if (navigator.appVersion.indexOf("Linux")!=-1) _os="Linux";
        }
        return _os;
        //Configuration.OS = OSName;
    }

    /**
     * Get multiple selection key.
     *
     * @return {string} returns 'contol' or 'command', depending on OS
     */
    static getMultipleSelectionKey()
    {
        if (_keyMultipleSelection === null)
        {
            switch (Environment.getOS())
            {
                case "Windows":
                {
                    _keyMultipleSelection = "control";
                    break;
                }

                case "MacOS":
                {
                    _keyMultipleSelection = "command";
                    break;
                }

                case "Linux":
                {
                    _keyMultipleSelection = "control";
                    break;
                }

                case "UNIX":
                {
                    _keyMultipleSelection = "control";
                    break;
                }

                default:
                {
                    _keyMultipleSelection = "control";
                    break;
                }
            }
        }
        return _keyMultipleSelection;
    }
}
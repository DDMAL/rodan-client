/**
 * Script to maintain version of app.
 */

//////////////////////////////////////////////////////////////////////////////////////
// MAIN
//////////////////////////////////////////////////////////////////////////////////////
process.stdin.setEncoding('utf8');
if (!handleGitStatus())
{
    process.exit();
}

// Get next version.
var json = require('../package.json');
var nextVersion = getNextVersion(json);
if (!nextVersion)
{
    process.exit();
}
console.log('Next version is ' + nextVersion);
json.version = nextVersion;

// Update and commit.
updateVersion(json);
gitCommit(nextVersion);
console.log('Remember to do "git push && git push --tags"');

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
//////////////////////////////////////////////////////////////////////////////////////
/**
 * Handles git status execution.
 */
function handleGitStatus()
{
    var child_process = require('child_process');
    var result = child_process.execSync('git status --porcelain -b').toString();
    var lineCount = result.split('\n').length;
    var firstLine = result.split('\n')[0];
    if (firstLine !== '## master...origin/master' || lineCount != 2)
    {
        console.log("Must be on master branch with no changes to update version.");
        return false;
    }
    return true;
}

/**
 * Gets the next version.
 */
function getNextVersion(json)
{
    var prompt = require('prompt-sync')();
    var currentVersion = json.version;
    var versionInfo = currentVersion.split('.').map(function(x) { return parseInt(x, 10); });
    console.log('Current version: ' + currentVersion);
    var input = prompt('Next version increment is (m)ajor, m(i)nor, (f)ix: ', 'f');
    input = input.substring(1, input.length - 3);
    switch(input)
    {
        case 'M':
        case 'm':
        {
            versionInfo[0]++;
            versionInfo[1] = 0;
            versionInfo[2] = 0;
            break;
        }

        case 'I':
        case 'i':
        {
            versionInfo[1]++;
            versionInfo[2] = 0;
            break;
        }

        case 'F':
        case 'f':
        {
            versionInfo[2]++;
            break;
        }

        default:
        {
            console.log('Input must be m, i, or f.')
            return false;
        }
    }
    return versionInfo.join('.');
}

/**
 * Updates version in package.json.
 */
function updateVersion(json)
{
    var data = JSON.stringify(json, null, 4);
    require('fs').writeFileSync('package.json', data);
}

/**
 * Does commit.
 */
function gitCommit(nextVersion)
{
    var child_process = require('child_process');
    var cmd = 'git commit -a -m "Release ' + nextVersion + '"; git tag v' + nextVersion;
    child_process.execSync(cmd).toString();
}
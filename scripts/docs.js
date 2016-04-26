/**
 * Script to create and commit docs.
 */

//////////////////////////////////////////////////////////////////////////////////////
// MAIN
//////////////////////////////////////////////////////////////////////////////////////
process.stdin.setEncoding('utf8');
if (!handleGitStatus())
{
    process.exit();
}

// Get version.
var json = require('../package.json');
var version = json.version;
var destination = 'docs/' + version;
var tempDestination = 'tmp/' + version;
console.log('API will be written to "' + destination + '"');

// Remove current temp destination.
var fs = require('fs');
try
{
    fs.rmdirSync(tempDestination);
}
catch (exception)
{}

// Make the docs.
var esdoc = require('../node_modules/esdoc/out/src/ESDoc.js');
var publisher = require('../node_modules/esdoc/out/src/Publisher/publish.js');
var config = {source: './js', destination: tempDestination};
esdoc.generate(config, publisher);

// Checkout GitHub pages.
var child_process = require('child_process');
var cmd = 'git checkout gh-pages';
child_process.execSync(cmd);

// Copy. Will overwrite whatever exists. 
try
{
    fs.rmdirSync(destination);
}
catch (exception)
{}
child_process.execSync('cp -Rf ' + tempDestination + ' ' + destination);

// Add and commit.
child_process.execSync('git add docs/*');
child_process.execSync('git commit -m "Docs v' + version + '"');
console.log('Don\'t forget "git push".');

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
        console.log("Must be on master branch with no changes.");
        return false;
    }
    return true;
}

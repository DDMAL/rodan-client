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


// Remove current temp destination.
var fs = require('fs');
var temp_path = '/tmp/rodan' + Date.now();
try
{
    fs.rmdirSync(temp_path);
}
catch (e) {}

// Build the website.
var cmd = 'jekyll build --source website --destination ' + temp_path;
var child_process = require('child_process');
child_process.execSync(cmd);

// Generate the API in the website.
var esdoc = require('../node_modules/esdoc/out/src/ESDoc.js');
var publisher = require('../node_modules/esdoc/out/src/Publisher/publish.js');
var config = {source: './js', destination: temp_path + '/development_manual/api'};
esdoc.generate(config, publisher);

// Checkout GitHub pages.
child_process = require('child_process');
cmd = 'git checkout gh-pages';
child_process.execSync(cmd);

// Copy. Will overwrite whatever exists. 
child_process.execSync('cp -Rf ' + temp_path + '/* .');

// Remove temp path.
try
{
    fs.rmdirSync(temp_path);
}
catch (e) {}


// Add and commit.
child_process.execSync('git add .'); 
child_process.execSync('git commit -m "MAINTENANCE: website"');
console.log();
console.log('Remember to do "git push".');
console.log('After that, remember to switch back to a code branch.');
console.log();

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
    if (firstLine !== '## master...origin/master')
    {
        console.log("Must be on master branch.");
        return false;
    }
    return true;
}

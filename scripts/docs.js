/**
 * Script to create and commit docs.
 */

//////////////////////////////////////////////////////////////////////////////////////
// MAIN
//////////////////////////////////////////////////////////////////////////////////////
process.stdin.setEncoding('utf8');
if (!handleGitStatus())
{
//    process.exit();
}


// Remove current temp destination.
var fs = require('fs');
try
{
    fs.rmdirSync(tempDestination);
}
catch (exception)
{}

// Ready the directory variables.
var api = 'website/src/_development_manual/api';

// Make the docs.
var esdoc = require('../node_modules/esdoc/out/src/ESDoc.js');
var publisher = require('../node_modules/esdoc/out/src/Publisher/publish.js');
var config = {source: './js', destination: api};
esdoc.generate(config, publisher);

// Next, build the website.
var cmd = 'jekyll build --source website --destination /tmp/website';
var child_process = require('child_process');
child_process.execSync(cmd);

// Checkout GitHub pages.
child_process = require('child_process');
cmd = 'git checkout gh-pages';
child_process.execSync(cmd);

// Copy. Will overwrite whatever exists. 
child_process.execSync('rm -R .');
child_process.execSync('cp -Rf /tmp/website/* .');

process.exit();


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
    if (firstLine !== '## master...origin/master' || lineCount != 2)
    {
        console.log("Must be on master branch with no changes.");
        return false;
    }
    return true;
}

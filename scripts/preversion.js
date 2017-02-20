/**
 * We have to be in master to do version.
 */
var child_process = require('child_process');
var result = child_process.execSync('git status --porcelain -b').toString();
var lineCount = result.split('\n').length;
var firstLine = result.split('\n')[0];
if (firstLine !== '## master...origin/master' || lineCount != 2)
{
    console.log("Must be on master branch with no changes to update version.");
    process.exit(1);
}
process.exit();
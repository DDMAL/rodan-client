/*******************************************************************************
 * POSTVERSION
 *
 * We check credential helper for git. If exists, try git push. Else, don't.
 ******************************************************************************/
const path = require('path');
const projectPath = path.resolve(__dirname, '../');
const git = require('simple-git')(projectPath);

git.status(function(error, data)
{
	if (data.current !== 'master')
	{
		console.log('NOT ON MASTER');
		process.exit(1);
	}

	git.raw(['config', 'credential.helper'], function(error, data)
	{
		console.log(data);
	});
});


/*
var child_process = require('child_process');
var result = child_process.execSync('git config credential.helper').toString();
var lineCount = result.split('\n').length;
var firstLine = result.split('\n')[0];
if (!firstLine || lineCount < 2)
{
    console.log('No git credential.helper detected. You will have to push by yourself. :)');
    console.log('Run: git push && git push --tags');
    process.exit(1);
}
result = child_process.execSync('git push && git push --tags').toString();
console.log(result);
process.exit();*/
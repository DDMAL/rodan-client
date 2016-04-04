process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

var exec = require('child_process').exec;
var cmd = 'git status --porcelain -b';
exec(cmd, function(error, stdout, stderr) 
{
    var lineCount = stdout.split('\n').length;
    var firstLine = stdout.split('\n')[0];
    if (firstLine !== '## master...origin/master' || lineCount != 2)
    {
        process.stdout.write("Must be on master branch with no changes to update version.\n");
        process.exit();
    }
    else
    {
        updateVersion();
    }
});


function updateVersion()
{
    var json = require('../package.json');
    var currentVersion = json.version;
    var versionInfo = currentVersion.split('.').map(function(x) { return parseInt(x, 10); });
    var nextVersion = null;

    process.stdout.write("Current version: " + currentVersion + '\n');
    process.stdout.write("Next version increment is (m)ajor, m(i)nor, (f)ix: ");
    process.stdin.on('data', function (text)
    {
        var input = util.inspect(text);
        input = input.substring(1, input.length - 3);
        switch(input)
        {
            case 'M':
            case 'm':
            {
                versionInfo[0]++;
                break;
            }

            case 'I':
            case 'i':
            {
                versionInfo[1]++;
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
                console.error('Input must be m, i, or f. Exiting.')
                process.exit();
            }
        }
        nextVersion = versionInfo.join('.');
        process.stdout.write("Setting version " + nextVersion + '...');
        json.version = nextVersion;
        var fs = require('fs');
        var data = JSON.stringify(json, null, 4);
        fs.writeFile('package.json', data, function(error)
        {
            if (error)
            {
                return console.error(error);
            }
            process.stdout.write("done.\n");
            process.stdout.write("Commit and tag...");
            cmd = 'git commit -a -m "Release ' + nextVersion + '"; git tag v' + nextVersion;
            exec(cmd, function(error, stdout, stderr) 
            {
                if (error)
                {
                    process.stdout.write('\n');
                    console.log(stderr);
                }
                else
                {
                    process.stdout.write('done\n');
                }
            });
            process.stdout.write("\n");
            process.exit();
        });
    });
}
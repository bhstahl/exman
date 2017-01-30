var os = require('os');
var path = require('path');
var spawn = require('child_process').spawn;

var EXECUTABLES = {
    ['darwin']: path.join(__dirname, '..', 'bin/ExManCmd_mac/Contents/MacOS/ExManCmd'),
    ['win32']: path.join(__dirname, '..', 'bin/ExManCmd_win/ExManCmd.exe'),
    ['win64']: path.join(__dirname, '..', 'bin/ExManCmd_win/ExManCmd.exe'),
};

var COMMAND_PREFIXES = {
    ['darwin']: '--',
    ['win32']: '/',
    ['win64']: '/',
};

var ARGUMENT_HELP = {
    install: 'the .zxp file path.',
    remove: 'the extension name.',
    disable: 'the extension name.',
    enable: 'the extension name.',
    update: 'the extension name.',
};

/**
 * Create a function that invokes the ExManCmd commands. See the docs:
 * https://helpx.adobe.com/extension-manager/using/command-line.html
 *
 * @param  {String} command     Command name
 * @return {Function}           Function to execute that command
 */
var exManCommand = function(command) {
    return function(argument) {
        return new Promise(function(resolve, reject) {
            var platform = os.platform();

            if (!(platform in EXECUTABLES)) {
                return reject('Your current platform is unsupported: ' + platform);
            }

            if (!argument) {
                return reject('The "' + command + '" command requires the first argument to be ' + ARGUMENT_HELP[command]);
            }

            var commandProcess = spawn(EXECUTABLES[platform], [COMMAND_PREFIXES[platform] + command, argument]);

            commandProcess.stdout.on('data', reject);
            commandProcess.stderr.on('data', reject);

            commandProcess.on('exit', function(code) {
                // code 0 => success
                if (code !== 0) {
                    return reject('Error: ExManCmd process exited with code: ' + code);
                }

                resolve(code);
            });
        });
    };
};

module.exports = {
    disable: exManCommand('disable'),
    enable: exManCommand('enable'),
    install: exManCommand('install'),
    remove: exManCommand('remove'),
    update: exManCommand('update'),
};

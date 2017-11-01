var path = require('path');
var spawn = require('child_process').spawn;

var PLATFORM = require('os').platform();
var IS_WINDOWS = /^win[0-9]{2}$/.test(PLATFORM);

var EXECUTABLES = {
    darwin: path.join(__dirname, '..', 'bin/ExManCmd_mac/Contents/MacOS/ExManCmd'),
    win32: path.join(__dirname, '..', 'bin/ExManCmd_win/ExManCmd.exe'),
    win64: path.join(__dirname, '..', 'bin/ExManCmd_win/ExManCmd.exe'),
};

var COMMAND_PREFIXES = {
    darwin: '--',
    win32: '/',
    win64: '/',
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

            if (!(PLATFORM in EXECUTABLES)) {
                return reject('Your current platform is unsupported: ' + PLATFORM);
            }

            if (!argument) {
                return reject('The "' + command + '" command requires the first argument to be ' + ARGUMENT_HELP[command]);
            }

            var executable = EXECUTABLES[PLATFORM];
            if (IS_WINDOWS) {
                // Windows can't navigate the electon asar binary, use the unpacked files
                executable = executable.replace('app.asar', 'app.asar.unpacked');
            }

            var args = [COMMAND_PREFIXES[PLATFORM] + command, argument];

            var commandProcess = spawn(executable, args);

            commandProcess.stderr.on('data', reject);

            commandProcess.on('exit', function(code) {
                // code 0 => success
                if (code !== 0) {
                    return reject('Error: ExManCmd process exited with code: ' + code);
                }

                resolve(code);
            });

            commandProcess.on('error', reject);
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

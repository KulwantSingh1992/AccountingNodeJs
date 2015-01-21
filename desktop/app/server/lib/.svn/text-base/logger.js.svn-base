var Log = require('log'),
    fs = require('fs'),
    appFolder = process.env.APPDATA + "\\Paxcom",
    logFile = appFolder + '\\file.log',
    exists = fs.existsSync(logFile);

if (!exists) {
    fs.openSync(logFile, 'w');
}
var stream = fs.createWriteStream(logFile);

var log = exports = module.exports = new Log('debug', stream);

log.on('line', function (line) {
    console.log(line);
});
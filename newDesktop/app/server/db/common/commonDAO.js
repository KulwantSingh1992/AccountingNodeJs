var db = require('../db-config').db;

exports.updateSync = function (channelName, serviceName, syncTime) {
    db.run("INSERT OR REPLACE INTO sync(channel_name, service_name, sync_val) values (?,?,?)", [channelName, serviceName, syncTime], function (err) {
        if (err) {
            console.log(err);
        }
    });
};

exports.getLastSync = function (channelName, serviceName, cb) {
   db.get('Select sync_val from sync where channel_name = ? AND service_name = ?', [channelName, serviceName], function(err, rows){
        if (rows) {
                getChannelCredentials(rows.sync_val, channelName, cb);
            }else{
                getChannelCredentials(0, channelName, cb);
        }
   });
}

function getChannelCredentials (syncTime, channelName, cb) {
    db.get('Select setting_details, extra from setting_conf where setting_channel = ?', [channelName], function(err, rows){
        if (rows) {
                cb(JSON.parse(rows.setting_details), JSON.parse(rows.extra), syncTime);
            }else{
                cb({}, {}, syncTime);
        }
   });
}
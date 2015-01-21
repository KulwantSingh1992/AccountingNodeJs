var db = require('../db-config').db;
var logger = require('../../lib/logger');

var insertSettingQuery = "INSERT INTO setting_conf(setting_channel , setting_details , is_active, setting_conf_last_updated_timestamp ,setting_conf_created_timestamp ) VALUES (?,?,?,?,?)";
var updateSettingQuedry = "UPDATE setting_conf set setting_details=?, is_active=?, setting_conf_last_updated_timestamp=? where setting_channel=?";
var getSettingQuery = "SELECT * FROM setting_conf";

exports.setConfiguration = function (channel, setting, active, dt) {
    db.run(insertSettingQuery, [channel, setting, active, dt, dt]);
};

exports.updateConfiguration = function(channel, setting, active, dt) {
    db.run(updateSettingQuedry, [setting, active, dt, channel]);
};

var getConfiguration = exports.getConfiguration = function(cb) {
	db.all(getSettingQuery, function(err, rows) {
		cb(rows);
	});
};



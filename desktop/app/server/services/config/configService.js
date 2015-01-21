var configDAO = require('../../db/config/configDAO');
var logger = require('../../lib/logger');

var configData;

exports.getConfiguration = function (cb) {
    if (!configData) {
        configDAO.getConfiguration(function (result) {
            configData = result;
            getConfiguration(cb);
        });
    } else {
        getConfiguration(cb);
    }
};

exports.setConfiguration = function (params, cb, err) {
    logger.debug('----------------Config Data----------------');
    logger.debug(params);
    var configuration = params.data;
    var active = params.active;
    
	var dt = new Date().getTime();
	var keys = Object.keys(configuration);
	keys.map(function(channel) {
		var setting = configuration[channel];
        var isNew = false;
        if(configData) {
            configData.map(function(config) {
                if(config.setting_channel == channel) {
                    isNew = true;
                }
            });
        }
        if(isNew) {
            configDAO.updateConfiguration(channel, setting, active, dt);
        } else {
            configDAO.setConfiguration(channel, setting, active, dt);
        }
    });
    configDAO.getConfiguration(function (result) {
        configData = result;
        getConfiguration(cb);
    });
};

function getConfiguration(cb) {
    var result = false;
    if(configData.length) {
        result = true;
    }
    cb({result: result, configData: configData});
}

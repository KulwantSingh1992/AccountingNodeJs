'use strict';

/**
 * @ngdoc service
 * @name paxcomTerminalApp.sessionService
 * @description
 * # sessionService
 * Service in the paxcomTerminalApp.
 */
angular.module('paxcomTerminalApp').service('configService', function ($http) {


    var settingConfig = {
        amazon: {
            SellerID: "A163RWDI7TY0BM",
            MarketplaceID: "A21TJRUUN4KGV",
            AWSAccessKeyID: "AKIAJGGA5POSZNFVAZJA",
            SecretKey: "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"
        },
        tally : {
            URL: "54.174.0.27:9000",
            CompanyName: "Demo"
        }
    };
    var activeChannels = [];
    this.getConfig = function() {
        return settingConfig;
    };
    this.setConfig = function(value) {
		setConfig(value);
    };
    this.submitSetting = function(data, active, callback, errorCallback) {
        var req = {data: data, active: active};
        $http.post('/setting', req).success(function (response) {
            console.log(response);
            callback();
            setConfig(response.configData);
            //$http.get('/initializeAmazon');
        }).error(function(data, status, headers, config) {
            console.error(data);
            errorCallback();
        });
    };
    this.getActiveChannels = function() {
        return activeChannels;
    };
    function setConfig(value) {
        var localSettingConfig = {};
        activeChannels = [];
        value.map(function(config) {
            localSettingConfig[config.setting_channel] = JSON.parse(config.setting_details);
            localSettingConfig[config.setting_channel].id = config.serial_id;
            if(config.is_active) {
                activeChannels.push(config.setting_channel);
            }
        });
        settingConfig = localSettingConfig;
    }
    
});
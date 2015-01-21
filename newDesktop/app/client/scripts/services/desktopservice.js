'use strict';

/**
 * @ngdoc service
 * @name paxcomTerminalApp.sessionService
 * @description
 * # sessionService
 * Service in the paxcomTerminalApp.
 */
angular.module('paxcomTerminalApp').service('desktopService', function (DesktopApi, NotSoldProducts, $http) {
    var dashboardSyncService;
    var desktopObject = {};
    this.getObject = function () {
        return desktopObject;
    };
    this.startDashboardSync = function () {
        startDashboardSync();
        dashboardSyncService = setInterval(function () {
            startDashboardSync();
        }, 20000);
    };
    this.stopDashboardSync = function() {
        clearInterval(dashboardSyncService);
    };
    this.initializeAmazon = function() {
        $http.get('/initializeAmazon');
    };
	this.notSoldProducts = function() {
		return NotSoldProducts.query();
    };
	function startDashboardSync() {
        DesktopApi.query().$promise.then(function(result) {
            desktopObject.dashboaddetails = result.dashboaddetails;
            console.log(desktopObject);
        });
    }
});

angular.module('paxcomTerminalApp').provider('DesktopApi', function () {
    this.$get = ['$resource', function ($resource) {
        var api = $resource(configuration.url + '/dashboard/detail', {}, {
            query : {
                method: 'GET',
                isArray: false
            }
        });
        return api;
    }];
});

angular.module('paxcomTerminalApp').provider('NotSoldProducts', function () {
    this.$get = ['$resource', function ($resource) {
        var api = $resource(configuration.url + '/notSoldProducts', {}, {
		});
        return api;
	}];
});
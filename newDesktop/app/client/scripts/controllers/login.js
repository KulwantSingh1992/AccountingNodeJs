'use strict';

/**
 * @ngdoc function
 * @name paxcomTerminalApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the paxcomTerminalApp
 */
angular.module('paxcomTerminalApp').controller('LoginCtrl', function ($scope, $http, sessionService, desktopService, configService) {
    $scope.credentials = {username: 'demo', password: 'demo'};
    $scope.login = function() {
        if($scope.credentials.username == 'demo' && $scope.credentials.password == 'demo') {
            sessionService.setUserAuthenticated(true);
            desktopService.startDashboardSync();
            $http.get(configuration.url + '/setting').success(function(response) {
            	if(response.result) {
            		sessionService.setMain('dashboard');
                    configService.setConfig(response.configData);
                    desktopService.initializeAmazon();
            	} else {
            		sessionService.setMain('wizard');
            	}
            });

        }
    }
});

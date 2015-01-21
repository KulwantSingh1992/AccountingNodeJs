'use strict';

/**
 * @ngdoc function
 * @name paxcomTerminalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the paxcomTerminalApp
 */
angular.module('paxcomTerminalApp').controller('SellDetailsCtrl', function ($scope, $http, inventoryService, configService) {
    $scope.values = [];
    $scope.productFilterForm = {};
    $scope.productsFilterFormForMapping = {};
    $scope.productsForMapping = [];
    $scope.activeChannelsConfigs = getActiveChannelConfig();

    $scope.openSellDataModal = function (val) {
        $scope.productsForMapping = angular.copy([val]);
        $('#map-product-form')[0].reset();
    }

    $scope.getResult = function () {
        inventoryService.getAllProducts().$promise.then(function (products) {
            console.log(products);
            products.map(function (product) {
                //if()
            });
            $scope.values = products;
        });
    }

    $scope.submitMapProductForm = function () {
        $scope.productsForMapping.map(function (prod) {
            inventoryService.updateProduct(prod);
        });
        $scope.getResult();
        $('#selldatamodal').find('input[type="text"]').each(function () {
            if (this.defaultValue != '' || this.value != this.defaultValue) {
                this.value = this.defaultValue;
            } else {
                this.value = '';
            }
        });
    }

    $scope.searchProductByName = function () {
        var productName = $scope.productFilterForm.productName;
        $http.get('/product/' + productName).success(function (products) {
            $scope.values = products;
        });
    }

    $scope.searchProductByNameForMapping = function () {
        var productName = $scope.productsFilterFormForMapping.productName;
        $http.get('/product/' + productName).success(function (products) {
            $scope.productsForMapping = products;
        });
    }
    
    $scope.listSellData = function(value, marketplaceID) {
        var prod = value;
        prod.marketplaceID = marketplaceID;
        inventoryService.updateProduct(prod);
    };

    function getActiveChannelConfig() {
        var channelConfigs = angular.copy(marketPlaceChannelConfigs);
        var activeChannels = configService.getActiveChannels();
        var activeChannelsConfigs = [];

        channelConfigs.map(function (channelConfig) {
            var result = activeChannels.filter(function (channel) {
                return channelConfig.name == channel;
            });
            if (!$.isEmptyObject(result)) {
                channelConfig.marketplaceID = "product_" + channelConfig.name.toLowerCase() + "_id";
                activeChannelsConfigs.push(channelConfig);
            }
        });
        return activeChannelsConfigs;
    }
});
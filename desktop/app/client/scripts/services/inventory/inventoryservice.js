'use strict';

/**
 * @ngdoc service
 * @name paxcomTerminalApp.inventory/inventoryService
 * @description
 * # inventory/inventoryService
 * Service in the paxcomTerminalApp.
 */
angular.module('paxcomTerminalApp').service('inventoryService', function (InventoryApi) {
	this.getProductDetailsByName = function(name) {
		
    };
    this.getProductDetailsById = function(id) {
		
    };
    this.getAllProducts = function() {
		return InventoryApi.query();
    };
	this.updateProduct = function(prod) {
		InventoryApi.update(prod);
    };
    this.getProductWithInventoryLessThan = function(n) {
		
    };
	this.getProductWithInventoryGreaterThan = function(n) {
		
    };
});

angular.module('paxcomTerminalApp').provider('InventoryApi', function () {
    this.$get = ['$resource', function ($resource) {
        var api = $resource(configuration.url + '/product/:marketplaceID/:params', {marketplaceID:'@marketplaceID'}, {
			query : {
				method: 'GET',
				isArray: true
			},
			update: {
				method: 'POST'
			}
		});
        return api;
	}];
});
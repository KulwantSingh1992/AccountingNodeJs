'use strict';

/**
 * @ngdoc function
 * @name paxcomTerminalApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the paxcomTerminalApp
 */
angular.module('paxcomTerminalApp').controller('HeaderCtrl', function ($scope) {
    var body = document.body,
        mask = document.createElement("div"),
        items = $('.menu.slide-menu-left li'),
        activeNav;
    mask.className = "mask";

    /* slide menu left */
    $scope.toggleSlideLeft = function () {
        $('body').addClass("sml-open");
        document.body.appendChild(mask);
        activeNav = "sml-open";
    };

    /* hide active menu if mask is clicked */
    mask.addEventListener("mouseover", function () {
        hideSlideMenu();
    });

    /* hide active menu if mask is clicked */
    mask.addEventListener("mouseover", function () {
        hideSlideMenu();
    });
    
    function hideSlideMenu() {
        $('body').removeClass(activeNav);
        activeNav = "";
        body.removeChild(mask);        
    }

})
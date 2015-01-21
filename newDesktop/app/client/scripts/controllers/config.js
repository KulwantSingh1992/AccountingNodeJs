'use strict';

/**
 * @ngdoc function
 * @name paxcomTerminalApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the paxcomTerminalApp
 */
angular.module('paxcomTerminalApp').controller('ConfigCtrl', function ($scope, $http,growl,sessionService,configService) {
    $scope.main = {};
    $scope.settingDetail = {};
    $scope.wForm = {};
    $scope.wForm.index = 1;

    init();

    function init() {
        $scope.main = sessionService.getMain();
        $scope.settingDetail = configService.getConfig();
    };

    $scope.deactivateSetting = function (formName) {
        var channel = formName.substring(0, formName.indexOf('-')).toUpperCase();
        var data = {};
        data[channel] = JSON.stringify($scope.settingDetail[channel]);
        var active = false;
        configService.submitSetting(data, active);
    }
    
    $scope.submitSetting = function (formName) {
        var valid;
        /*var loginMsg = "Login Successfull"*/
        isValidateSettingForm(formName, function (isValid, forms) {
            valid = isValid;
            if (isValid) {
                var data = {};
                var active = true;
                forms.map(function (index, form) {
                    var formId = $(form).attr('id');
                    var channel = formId.substring(0, formId.indexOf('-'));
                    var formData = $(form).serializeArray();
                    var setting = {};
                    formData.map(function (config) {
                        setting[config.name] = config.value;
                    });
                    data[marketPlaceChannelNames[channel]||channel] = JSON.stringify(setting);
                });
                console.log(data);
                var msgConfig = {};
                msgConfig.ttl = 6000;
                configService.submitSetting(data, active, function() {
                    growl.addSuccessMessage('Form submitted successfully', msgConfig);
                }, function(err, errMsg) {
                    console.error(err);
                    growl.addErrorMessage('Error to submit form', msgConfig);

                });
                
            }    
        });
        return valid;
    };

    $scope.submitAndNext = function () {
        var valid = $scope.submitSetting('wizard');
        if (valid) {
            $scope.wForm.index = $scope.wForm.index + 1
        }
    }

    $scope.submitSettingAndFinish = function () {
        var isValid = $scope.submitSetting('wizard');
        if (isValid) {
            $scope.main.dashboard = 'dashboard';
        }
    }

    var isValidateSettingForm = function (formName, cb) {
        var isValid = false;

        if (formName === 'wizard') {
            formName = $('form').attr('id');
        }
        if (formName == 'fk-setting-form') {
            isValid = flipkartFormValidate();
        }
        if (formName == 'amazon-setting-form') {
            isValid = amazonFormValidate();
        }
        if (formName == 'tally-setting-form') {
            isValid = tallyFormValidate();
        }
        if (formName == 'other-setting-form') {
            isValid = otherPageValidate();
        }
        if (formName == 'SD-setting-form') {
            isValid = sdPageValidate();
        }
        if (formName == 'PTM-setting-form') {
            isValid = ptmPageValidate();
        }
        var forms = $('#' + formName);
        cb(isValid, forms);
    }

    var flipkartFormValidate = function () {
        var valid = true;
        if (!$('#UserName').val()) {
            valid = false;
            $('#UserName').css({
                'border': '1px solid red'
            });
        } else {
            $("#UserName").css("border-color", "#ccc");
        }
        var p1 = $('#p1').val(),
            p2 = $('#p2').val();

        if (p1 != p2 || p1 == '' || p2 == '') {
            valid = false;
            $('#p1').css({
                'border': '1px solid red'
            });
            $('#p2').css({
                'border': '1px solid red'
            });
        } else {
            $('#p1').css("border-color", "#ccc");
            $('#p2').css("border-color", "#ccc");
        }

        if (valid) {
            $('input').css("border-color", "#ccc");
        }
        return valid;
    }

    var amazonFormValidate = function () {
        var valid = true;

        if (!$('#SellerIDAmaz').val()) {
            valid = false;
            $('#SellerIDAmaz').css({
                'border': '1px solid red'
            });
        } else {
            $("#SellerIDAmaz").css("border-color", "#ccc");
        }
        if (!$('#MarketplaceID').val()) {
            valid = false;
            $('#MarketplaceID').css({
                'border': '1px solid red'
            });
        } else {
            $("#MarketplaceID").css("border-color", "#ccc");
        }
        if (!$('#AWSAccessKeyID').val()) {
            valid = false;
            $('#AWSAccessKeyID').css({
                'border': '1px solid red'
            });
        } else {
            $("#AWSAccessKeyID").css("border-color", "#ccc");
        }
        if (!$('#SecretKey').val()) {
            valid = false;
            $('#SecretKey').css({
                'border': '1px solid red'
            });
        } else {
            $("#SecretKey").css("border-color", "#ccc");
        }

        if (valid) {
            $('input').addClass('valid-input');
        }
        return valid;
    }

    var tallyFormValidate = function () {
        var valid = true;

        if (!$('#URL').val()) {
            valid = false;
            $('#URL').css({
                'border': '1px solid red'
            });
        } else {
            $("#URL").css("border-color", "#ccc");
        }
        if (!$('#CompanyName').val()) {
            valid = false;
            $('#CompanyName').css({
                'border': '1px solid red'
            });
        } else {
            $("#CompanyName").css("border-color", "#ccc");
        }
        if (valid) {
            $('input').addClass('valid-input');
        }
        return valid;
    }

    var otherPageValidate = function () {
        var valid = true;

        if (!$('#fname').val()) {
            valid = false;
            $('#fname').css({
                'border': '1px solid red'
            });
        } else {
            $("#fname").css("border-color", "#ccc");
        }
        if (!$('#lname').val()) {
            valid = false;
            $('#lname').css({
                'border': '1px solid red'
            });
        } else {
            $("#lname").css("border-color", "#ccc");
        }
        if (!$('#email').val()) {
            valid = false;
            $('#email').css({
                'border': '1px solid red'
            });
        } else {
            $("#email").css("border-color", "#ccc");
        }

        if (valid) {
            $('input').addClass('valid-input');
        }
        return valid;
    }

    var validateSettingPage = function () {
        var valid = true;

        if (!$('#fname').val()) {
            valid = false;
            $('#fname').css({
                'border': '1px solid red'
            });
        } else {
            $("#fname").css("border-color", "#ccc");
        }
        if (!$('#lname').val()) {
            valid = false;
            $('#lname').css({
                'border': '1px solid red'
            });
        } else {
            $("#lname").css("border-color", "#ccc");
        }
        if (!$('#email').val()) {
            valid = false;
            $('#email').css({
                'border': '1px solid red'
            });
        } else {
            $("#email").css("border-color", "#ccc");
        }
        if (!valid) {
            return false;
        } else {
            $('#fname').css({
                'border': '1px solid #ccc'
            });
            $('#lname').css({
                'border': '1px solid #ccc'
            });
            $('#email').css({
                'border': '1px solid #ccc'
            });
            $scope.submitSetting('all');
        }
    }

    var sdPageValidate = function () {
        var valid = true;

        if (!$('#sduserName').val()) {
            valid = false;
            $('#sduserName').css({
                'border': '1px solid red'
            });
        } else {
            $("#sduserName").css("border-color", "#ccc");
        }
        if (!$('#password').val()) {
            valid = false;
            $('#password').css({
                'border': '1px solid red'
            });
        } else {
            $("#password").css("border-color", "#ccc");
        }
        if (valid) {
            $('input').addClass('valid-input');
        }
        return valid;
    }

    var ptmPageValidate = function () {
        var valid = true;

        if (!$('#ptmmerchantId').val()) {
            valid = false;
            $('#ptmmerchantId').css({'border': '1px solid red'     
            });
        } else {
            $("#ptmmerchantId").css("border-color", "#ccc");
        }
        if (!$('#ptmClientId').val()) {
            valid = false;
            $('#ptmClientId').css({
                'border': '1px solid red'
            });
        } else {
            $("#ptmClientId").css("border-color", "#ccc");
        }
        if (!$('#ptmclientSecret').val()) {
            valid = false;
            $('#ptmclientSecret').css({
                'border': '1px solid red'
            });
        } else {
            $("#ptmclientSecret").css("border-color", "#ccc");
        }
        if (!$('#ptmusername').val()) {
            valid = false;
            $('#ptmusername').css({
                'border': '1px solid red'
            });
        } else {
            $("#ptmusername").css("border-color", "#ccc");
        }
        if (!$('#ptmPassword').val()) {
            valid = false;
            $('#ptmPassword').css({
                'border': '1px solid red'
            });
        } else {
            $("#ptmPassword").css("border-color", "#ccc");
        }

        if (valid) {
            $('input').addClass('valid-input');
        }
        return valid;

    }
});
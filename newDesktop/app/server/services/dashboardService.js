var logger = require('../lib/logger');

var dashboardOrderData;

var dashboardAccountData;

var dashboardProductData = {
    'ofs': 0,
    'bt': 0,
    'agp': 0,
    'tl': {AMAZON:0, FK:0, TOTAL:0},
    'al': {AMAZON:0, FK:0, TOTAL:0},
    'ial': {AMAZON:0,FK:0, TOTAL:0}
};


var defaultUninitializedDataMessage = {
    'STATUS': 'NOT_INIT',
    'MSG': 'Data not loaded yet'
};

exports.getOrderDetails = function () {
    if (!dashboardOrderData) {
        return defaultUninitializedDataMessage;
    }
    return dashboardOrderData;
};


exports.getAccountingDetails = function () {
    if (!dashboardAccountData) {
        return defaultUninitializedDataMessage;
    }
    return dashboardAccountData;
};

exports.getProductDashboardDetails = function () {
    if (!dashboardProductData) {
        return defaultUninitializedDataMessage;
    }
    return dashboardProductData;
};



exports.getDashboardDetails = function () {
    var dashboaddetails = {};
    dashboaddetails['order'] = this.getOrderDetails();
    dashboaddetails['account'] = this.getAccountingDetails();
    dashboaddetails['product'] = this.getProductDashboardDetails();
    return dashboaddetails;
};

// cron
var updateDashboardOrderData = exports.updateDashboardOrderData = function (result) {
    console.log(result);
    dashboardOrderData = {
        sla: result[4].sla,
        cancelled: result[0].cancelled,
        pending: result[1].pending,
        dueToday: result[3].dueToday,
        ordersToday: result[2].ordersToday,
        lastUpdatedTime: Date.now()
    };
};


exports.updateDashboardAccountData = function (res) {
    if (res != null) {
        dashboardAccountData = res;
    }
};


exports.updateDashboardProductData = function (res) {
    if (res != null) {
        dashboardProductData = res;
    }
};
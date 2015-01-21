var configuration = {
    version: 1.0,
    url: 'http://localhost:3000',
};

//key of marketPlaceChannelNames is mapped with setting pages form-id
var marketPlaceChannelNames = {
    fk: "FK",
    amazon: "AMAZON",
    paytm: "PTM",
    tally: "TALLY"
};
var inputType = {
    text: "text",
    number: "number"
};
var flipkartChannelConfigs = [
    {name: "id", inputType: inputType.text},
    {name: "listed_price", inputType: inputType.number},
    {name: "quantity", inputType: inputType.number},
    {name: "sku", inputType: inputType.text},
    {name: "listing_status", inputType: inputType.text},
    {name: "local_shipping_charge", inputType: inputType.number},
    {name: "national_shipping_charge", inputType: inputType.number},
    {name: "procurement_sla", inputType: inputType.number},
    {name: "zonal_shipping_charge", inputType: inputType.number},
    {name: "price_error_check", inputType: inputType.text}
];
var amazonChannelConfigs = [
    {name: "id", inputType: inputType.text},
    {name: "listed_price", inputType: inputType.number},
    {name: "quantity", inputType: inputType.number},
    {name: "sku", inputType: inputType.text},
    {name: "leadtime-to-ship", inputType: inputType.text}
];

var marketPlaceChannelConfigs = [{
    name: marketPlaceChannelNames.fk, config: flipkartChannelConfigs
}, {
    name: marketPlaceChannelNames.amazon, config: amazonChannelConfigs
}];
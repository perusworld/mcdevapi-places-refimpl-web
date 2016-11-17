var fs = require('fs')
var places = require('mastercard-places');
var MasterCardAPI = places.MasterCardAPI;

var config = {
    p12file: process.env.KEY_FILE || null,
    p12pwd: process.env.KEY_FILE_PWD || 'keystorepassword',
    p12alias: process.env.KEY_FILE_ALIAS || 'keyalias',
    apiKey: process.env.API_KEY || null,
    sandbox: process.env.SANDBOX || 'true',
}

var authentication = new MasterCardAPI.OAuth(config.apiKey, config.p12file, config.p12alias, config.p12pwd);
MasterCardAPI.init({
    sandbox: 'true' === config.sandbox,
    authentication: authentication
});

var writeFile = true;

function writeObj(obj, file, callback) {
    if (writeFile) {
        fs.writeFile("www/data/" + file, JSON.stringify(obj), function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
            callback();
        });
    } else {
        console.log("skipping file save!");
        callback();
    }
}

function dumpMCC() {
    var requestData = {
        "Mcc_Codes": "true"
    };
    places.MerchantCategoryCodes.query(requestData,
        function(error, data) {
            if (error) {
                console.error("An error occurred");
                console.error(error);
            }
            else {
                console.dir(data, { depth: null });
                writeObj(data, "mcc.json", function() {
                    console.log('done');
                });
            }
        });
}

function dumpIndustries() {
    var requestData = {
        "Ind_Codes": "true"
    };

    places.MerchantIndustries.query(requestData,
        function(error, data) {
            if (error) {
                console.error("An error occurred");
                console.error(error);
            }
            else {
                console.dir(data, { depth: null });
                writeObj(data, "industries.json", function() {
                    console.log('done');
                });
            }
        });
}

function dumpPOI() {
    var requestData = {
        "radiusSearch": "false",
        "unit": "m",
        "pageLength": "100",
        "distance": "15",
        "pageOffset": "0",
        "place": {
            "stateProvidenceCode": "AZ",
            "countryCode": "USA"
        }
    };
    places.MerchantPointOfInterest.create(requestData,
        function(error, data) {
            if (error) {
                console.error("An error occurred");
                console.error(error);
            }
            else {
                console.dir(data, { depth: null });
                writeObj(data, "poi.json", function() {
                    console.log('done');
                });

            }
        });
}

function dumpGEO() {
    var requestData = {
        "cityName": "O FALLON",
        "countryCode": "USA",
        "postalCode": "63368",
        "addressLine1": "2254 HIGHWAY K"
    };

    places.GeocodeLocation.query(requestData,
        function(error, data) {
            if (error) {
                console.error("An error occurred");
                console.error(error);
            }
            else {
                console.dir(data, { depth: null });
                writeObj(data, "geo.json", function() {
                    console.log('done');
                });

            }
        });
}

//writeFile = false;
dumpMCC();
dumpIndustries();
dumpPOI();
dumpGEO();
var express = require('express');
var bodyParser = require('body-parser');

var fs = require('fs')
var app = express();
var places = require('mastercard-places');
var MasterCardAPI = places.MasterCardAPI;

var dummyData = [];
var dummyDataFiles = ['www/data/mcc.json', 'www/data/industries.json', 'www/data/poi.json', 'www/data/geo.json'];
dummyDataFiles.forEach(function (file) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        dummyData[file] = JSON.parse(data);
    });
});

var config = {
    p12file: process.env.KEY_FILE || null,
    p12pwd: process.env.KEY_FILE_PWD || 'keystorepassword',
    p12alias: process.env.KEY_FILE_ALIAS || 'keyalias',
    apiKey: process.env.API_KEY || null,
    sandbox: process.env.SANDBOX || 'true',
}

var useDummyData = null == config.p12file;
if (useDummyData) {
    console.log('p12 file info missing, using dummy data')
} else {
    console.log('has p12 file info, using MasterCardAPI')
    var authentication = new MasterCardAPI.OAuth(config.apiKey, config.p12file, config.p12alias, config.p12pwd);
    MasterCardAPI.init({
        sandbox: 'true' === config.sandbox,
        authentication: authentication
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('www'));

app.post('/mcc', function (req, res) {
    if (useDummyData) {
        res.json(dummyData[dummyDataFiles[0]]);
    } else {
        var requestData = {
            "Mcc_Codes": req.body.isMCC
        };
        places.MerchantCategoryCodes.query(requestData, function (error, data) {
            if (error) {
                console.error("An error occurred");
                console.dir(error, { depth: null });
                res.json({
                    MerchantCategoryCodeList: {
                        MerchantCategoryCodeArray: {
                            MerchantCategoryCode: []
                        }
                    }
                });
            }
            else {
                res.json(data);
            }
        });

    }
});

app.post('/industries', function (req, res) {
    if (useDummyData) {
        res.json(dummyData[dummyDataFiles[1]]);
    } else {
        var requestData = {
            "Ind_Codes": req.body.isInd
        };
        places.MerchantIndustries.query(requestData, function (error, data) {
            if (error) {
                console.error("An error occurred");
                console.dir(error, { depth: null });
                res.json({
                    MerchantIndustryList: {
                        MerchantIndustryArray: {
                            MerchantIndustry: []
                        }
                    }
                });
            }
            else {
                res.json(data);
            }
        });

    }
});

app.post('/poi', function (req, res) {
    if (useDummyData) {
        res.json(dummyData[dummyDataFiles[2]]);
    } else {
        var requestData = {
            "radiusSearch": req.body.radiusSearch,
            "unit": req.body.unit,
            "pageLength": req.body.pageLength,
            "distance": req.body.distance,
            "pageOffset": req.body.pageOffset,
            "place": {
                "stateProvidenceCode": req.body.stateProvidenceCode,
                "countryCode": req.body.countryCode
            }
        };
        places.MerchantPointOfInterest.create(requestData, function (error, data) {
            if (error) {
                console.error("An error occurred");
                console.dir(error, { depth: null });
                res.json({
                    MerchantPOIResponse: {
                        pageOffset: "0",
                        totalCount: "0",
                        places: {
                            place: []
                        }
                    }
                });
            }
            else {
                res.json(data);
            }
        });

    }
});

app.post('/geo', function (req, res) {
    if (useDummyData) {
        res.json(dummyData[dummyDataFiles[3]]);
    } else {
        var requestData = {
            "cityName": req.body.cityName,
            "countryCode": req.body.countryCode,
            "postalCode": req.body.postalCode,
            "addressLine1": req.body.addressLine1
        };
        places.GeocodeLocation.query(requestData, function (error, data) {
            if (error) {
                console.error("An error occurred");
                console.dir(error, { depth: null });
                res.json({
                    geoCodeLocation: {
                    }
                });
            }
            else {
                res.json(data);
            }
        });

    }
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

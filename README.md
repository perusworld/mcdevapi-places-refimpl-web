# Mastercard Developer API - Places - Reference Implementation - Angular/Express #

## [Demo](https://perusworld.github.io/mcdevapi-places-refimpl-web/) ##

## Setup ##

1.Checkout the code
```bash
git clone https://github.com/perusworld/mcdevapi-places-refimpl-web.git
```
2.Run bower install
```bash
bower install
```
3.Run npm install
```bash
npm install
```

## Running using dummy data ##
1.Start the app
```bash
node index.js
```
2.Open browser and goto [http://localhost:3000](http://localhost:3000)

## Running using MasterCard API ##
Make sure you have registered and obtained the API keys and p12 files from [https://developer.mastercard.com/](https://developer.mastercard.com/)

1.Start the app
```bash
export KEY_FILE=<your p12 file location>
export API_KEY=<your api key>
node index.js
```
2.Open browser and goto [http://localhost:3000](http://localhost:3000)

#### Some of the other options ####
```bash
export KEY_FILE_PWD=<p12 key password defaults to keystorepassword>
export KEY_FILE_ALIAS=<p12 key alias defaults to keyalias>
export SANDBOX=<sandbox or not defaults to true>
```
## Code ##
### Backend API Initialization ###
```javascript
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
```
### Backend API Call (query detailed information on merchants using distance/state/country sent as part of JSON post) ###
```javascript
app.post('/poi', function (req, res) {
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
});
```
### Backend API Call (query Merchant Category Codes) ###
```javascript
app.post('/mcc', function (req, res) {
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
});
```
### Backend API Call (query Merchant Industries) ###
```javascript
app.post('/industries', function (req, res) {
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
});
```
### Backend API Call (query a geo-coordinate, latitude and longitude, point for a specified address location) ###
```javascript
app.post('/geo', function (req, res) {
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
});
```
### Angular Service to Places ###
```javascript
angular.module('places.api', [])


    .service('PlacesApi', ['$http', function ($http) {
        var ret = {
            mcc: function (req, callback) {
                var data = {
                    isMCC: req.isMCC
                }
                $http.post('/mcc', data).then(function successCallback(response) {
                    callback(response.data)
                });
            },
            poi: function (req, callback) {
                var data = {
                    pageLength: req.pageLength,
                    countryCode: req.countryCode,
                    stateProvidenceCode: req.stateProvidenceCode,
                    pageOffset: req.pageOffset,
                    radiusSearch: req.radiusSearch,
                    unit: req.unit,
                    distance: req.distance
                }
                $http.post('/poi', data).then(function successCallback(response) {
                    callback(response.data)
                });
            },
            geo: function (req, callback) {
                var data = {
                    cityName: req.cityName,
                    countryCode: req.countryCode,
                    postalCode: req.postalCode,
                    addressLine1: req.addressLine1
                }
                $http.post('/geo', data).then(function successCallback(response) {
                    callback(response.data)
                });
            },
            industries: function (req, callback) {
                var data = {
                    isInd: req.isInd
                }
                $http.post('/industries', data).then(function successCallback(response) {
                    callback(response.data)
                });
            }
        };
        return ret;

    }])

    .factory('PlacesService', function (PlacesApi) {
        var ret = {
            mcc: function (req, callback) {
                PlacesApi.mcc(req, function (data) {
                    if (null != data) {
                        callback(data.MerchantCategoryCodeList.MerchantCategoryCodeArray.MerchantCategoryCode);
                    }
                });
            },
            poi: function (req, cached, callback) {
                PlacesApi.poi(req, function (data) {
                    if (null != data) {
                        callback(data.MerchantPOIResponse.places.place);
                    }
                });
            },
            poiAt: function (req, cached, index, callback) {
                ret.poi(req, cached, function (data) {
                    callback(null == data ? {}: data[index]);
                });
            },
            geo: function (req, callback) {
                PlacesApi.geo(req, function (data) {
                    if (null != data) {
                        callback(data.geoCodeLocation);
                    }
                });
            },
            industries: function (req, callback) {
                PlacesApi.industries(req, function (data) {
                    if (null != data) {
                        callback(data.MerchantIndustryList.MerchantIndustryArray.MerchantIndustry);
                    }
                });
            }
        };
        return ret;
    });
```
### Angular Controller to get Places ###
```javascript
    .controller('MCCCtrl', function($scope, PlacesService) {
        $scope.mccs = {};
        var req = {
            isMCC: "true"
        };
        PlacesService.mcc(req, function(data) {
            $scope.mccs = data;
        });
    })

    .controller('POICtrl', function($window, $scope, $ionicModal, Session, PlacesService, NgMap) {
        $scope.pois = [];
        var req = {
            pageLength: "100",
            countryCode: "USA",
            pageOffset: "0",
            radiusSearch: "false",
            unit: "m",
            distance: "15",
            stateProvidenceCode: "AZ"
        };
        $scope.position = {};
        var vm = this;
        var center = {
            lat: 0,
            lng: 0
        };
        $scope.map = {
            center: center,
            zoom: 11
        };
        NgMap.getMap().then(function(map) {
            vm.mapObj = map;
            Session.getCurrentPosition(onSuccess);
        });

        var onSuccess = function(position, callback) {
            $scope.position = position;
            if (null == position) {
                alert('Unable to current location info');
            } else if (position.coords) {
                vm.mapObj.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
                PlacesService.poi(req, true, function(data) {
                    if (null != data) {
                        if (0 < data.length) {
                            vm.mapObj.setCenter({ lat: data[0].pos[0], lng: data[0].pos[1] });
                        }
                        $scope.pois = data;
                    }
                    if (null != callback) {
                        callback();
                    }
                });
            }

        };

    })

    .controller('GEOCtrl', function($scope, $stateParams, PlacesService) {
        var req = {
            cityName: "O FALLON",
            countryCode: "USA",
            postalCode: "63368",
            addressLine1: "2254 HIGHWAY K"
        };
        $scope.geo = {};
        PlacesService.geo(req, function(data) {
            $scope.geo = data;
        })
    })

    .controller('IndustriesCtrl', function($scope, PlacesService) {
        $scope.industries = {};
        var req = {
            isInd: "true"
        };
        PlacesService.industries(req, function(data) {
            $scope.industries = data;
        });
    });
```
### Angular Template to display the list of MCC Codes ###
```html
    <ion-list>
      <ion-item class="item" ng-repeat="mcc in mccs" type="item-text-wrap">
        <h2>{{mcc.MerchantCategoryName}}</h2>
        <p>{{mcc.MerchantCatCode}}</p>
      </ion-item>
    </ion-list>
```
### Angular Template to display the Places map/list ###
```html
    <div class="map-holder">
      <div map-lazy-load="https://maps.google.com/maps/api/js?libraries=visualization,drawing,geometry,places">
        <ng-map zoom="{{map.zoom}}" center="[{{map.center.lat}}, {{map.center.lng}}]">
          <marker ng-repeat="poi in pois" icon="{{poi.options.icon}}" position="{{poi.pos}}" data="{{poi.locID}}" on-click="showAtm(poi)"
            title="{{poi.cleansedMerchantName}}"></marker>
        </ng-map>
      </div>
    </div>
    <ion-list>
      <ion-item class="item item-icon-right" ng-repeat="poi in pois" type="item-text-wrap" href="#/tab/geo/{{$index}}">
        <h2>{{$index + 1}}. {{poi.cleansedMerchantName}}</h2>
        <p>{{poi.cleansedStreetAddr}} {{poi.cleansedCityName}} {{poi.cleansedStateProvidenceCode}} {{poi.cleansedPostalCode}}
          {{poi.cleansedCountryCode}}
        </p>
        <i class="icon ion-ios-arrow-right"></i>
      </ion-item>
    </ion-list>
```
### Angular Template to display the list of industries ###
```html
    <ion-list>
      <ion-item class="item" ng-repeat="ind in industries" type="item-text-wrap">
        <h2>{{ind.IndustryName}}</h2>
        <p>{{ind.Industry}}</p>
      </ion-item>
    </ion-list>
```
### Angular Template to display the geo information ###
```html
    <div class="list">
      <div class="item item-divider item-icon-left">
        <i class="icon ion-home"></i> {{geo.inputAddressLine1}} {{geo.inputCityName}} {{geo.inputCountryCode}} {{geo.inputPostalCode}}
      </div>
      <div class="item">
        <h2>Lat/Lng</h2>
        <p>{{geo.latitude}}, {{geo.longitude}}</p>
      </div>
    </div>
```

angular.module('places.api', [])


    .service('PlacesApi', ['$http', function ($http) {
        var ret = {
            getJson: function (file, callback) {
                $http.get('/mcdevapi-places-refimpl-web/data/' + file).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    $http.get('/data/' + file).then(function successCallback(response) {
                        callback(response.data)
                    }, function errorCallback(response) {
                        callback(null);
                    });
                });
            },
            mcc: function (req, callback) {
                var data = {
                    isMCC: req.isMCC
                }
                $http.post('/mcc', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    ret.getJson("mcc.json", callback);
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
                }, function errorCallback(response) {
                    ret.getJson("poi.json", callback);
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
                }, function errorCallback(response) {
                    ret.getJson("geo.json", callback);
                });
            },
            industries: function (req, callback) {
                var data = {
                    isInd: req.isInd
                }
                $http.post('/industries', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    ret.getJson("industries.json", callback);
                });
            }
        };
        return ret;

    }]);


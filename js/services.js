angular.module('places.services', [])

    .factory('Session', ['$rootScope', function ($rootScope) {
        var Session = {
            data: {},
            set: function (key, value) {
                Session.data[key] = value;
            },
            get: function (key) {
                return Session.data[key];
            },
            getCached: function (key, loader, callback) {
                if (null == Session.data[key]) {
                    console.log('Not in cache loading');
                    loader(function (data) {
                        Session.data[key] = data;
                        callback(data);
                    });
                } else {
                    console.log('in cache returning');
                    callback(Session.data[key]);
                }
            },
            getCurrentPosition: function (callback) {
                var ret = Session.data['CurrentPosition'];
                if (null == ret) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        Session.data['CurrentPosition'] = position;
                        callback(position);
                    }, function (error) {
                        Session.data['CurrentPosition'] = null;
                        callback(null);
                    });
                } else {
                    callback(ret);
                };
            },
            fireEvent: function (msgId, args) {
                $rootScope.$broadcast(msgId, args);
            },
            onEvent: function (msgId, handler) {
                $rootScope.$on(msgId, function (event, args) {
                    handler(args);
                });
            }
        };
        return Session;
    }])

    .factory('PlacesService', function (PlacesApi, Session) {
        var ret = {
            prepGmaps: function (poi, index) {
                var idx = (null == index) ? "." : (index + 1)
                poi.options = {
                    title: poi.cleansedMerchantName,
                    icon: 'http://chart.apis.google.com/chart?chst=d_map_spin&chld=.5|0|fd9827|10|b|' + idx
                };
                poi.pos = [parseFloat(poi.latitude), parseFloat(poi.longitude)]
            },
            mcc: function (req, callback) {
                PlacesApi.mcc(req, function (data) {
                    if (null != data) {
                        callback(data.MerchantCategoryCodeList.MerchantCategoryCodeArray.MerchantCategoryCode);
                    }
                });
            },
            poi: function (req, cached, callback) {
                if (cached) {
                    Session.getCached('pois', function (loaderCallback) {
                        PlacesApi.poi(req, function (data) {
                            if (null != data) {
                                data.MerchantPOIResponse.places.place.forEach(ret.prepGmaps, ret);
                                loaderCallback(data.MerchantPOIResponse.places.place);
                            }
                        });
                    }, function (data) {
                        callback(data);
                    });
                } else {
                    PlacesApi.poi(req, function (data) {
                        if (null != data) {
                            callback(data.MerchantPOIResponse.places.place);
                        }
                    });
                }
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

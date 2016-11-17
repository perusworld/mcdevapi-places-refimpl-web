angular.module('places.controllers', [])

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
        $scope.filter = {
            newBusiness: true,
            inBusiness: true,
            cashBack: true,
            payAtThePump: true,
            nfc: true
        };
        $scope.position = {};
        var vm = this;
        var center = {
            lat: 0,
            lng: 0
        };
        $ionicModal.fromTemplateUrl('templates/filter-poi.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        $scope.map = {
            center: center,
            zoom: 11
        };
        NgMap.getMap().then(function(map) {
            vm.mapObj = map;
            Session.getCurrentPosition(onSuccess);
        });

        var filterPoi = function(poi) {
            return (($scope.filter.newBusiness && 'TRUE' == poi.newBusinessFlag) ||
                ($scope.filter.inBusiness && 'TRUE' == poi.inBusiness7DayFlag) ||
                ($scope.filter.cashBack && 'TRUE' == poi.cashBack) ||
                ($scope.filter.payAtThePump && 'TRUE' == poi.payAtThePump) ||
                ($scope.filter.nfc && 'TRUE' == poi.nfcFlag))
        }

        $scope.doFilter = function() {
            onSuccess($scope.position, function() {
                $scope.closeModal();
            })
        };

        var onSuccess = function(position, callback) {
            $scope.position = position;
            if (null == position) {
                alert('Unable to current location info');
            } else if (position.coords) {
                vm.mapObj.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
                PlacesService.poi(req, true, function(data) {
                    if (null != data) {
                        data = data.filter(filterPoi);
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
            pageLength: "100",
            countryCode: "USA",
            pageOffset: "0",
            radiusSearch: "false",
            unit: "m",
            distance: "15",
            stateProvidenceCode: "AZ"
        };
        $scope.poi = {};
        PlacesService.poiAt(req, true, $stateParams.mId, function(data) {
            $scope.poi = data;
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

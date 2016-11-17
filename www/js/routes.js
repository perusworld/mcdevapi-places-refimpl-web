angular.module('places.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      .state('tab.poi', {
        url: '/poi',
        views: {
          'tab-poi': {
            templateUrl: 'templates/tab-poi.html',
            controller: 'POICtrl'
          }
        }
      })
      .state('tab.mcc', {
        url: '/mcc',
        views: {
          'tab-mcc': {
            templateUrl: 'templates/tab-mcc.html',
            controller: 'MCCCtrl'
          }
        }
      })
      .state('tab.industries', {
        url: '/industries',
        views: {
          'tab-industries': {
            templateUrl: 'templates/tab-industries.html',
            controller: 'IndustriesCtrl'
          }
        }
      })
      .state('tab.geo', {
        url: '/geo/:mId',
        views: {
          'tab-poi': {
            templateUrl: 'templates/tab-geo.html',
            controller: 'GEOCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/tab/poi');

  });

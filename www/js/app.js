angular.module('places', ['ionic', 'places.controllers', 'places.routes', 'places.services', 'places.api', 'nvd3ChartDirectives', 'angularMoment', 'ngMap'])

  .config(
  [function () {
  }]
  )

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
    });
  });

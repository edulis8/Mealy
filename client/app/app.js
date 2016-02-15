angular.module('mealy', [
  'ngRoute'
  ])

.config(function($routeProvider, $httpProvider){

$routeProvider
    .when('/', {
      templateUrl: 'app/home.html',
      controller: 'HomeController'
    })
     .when('/cook', {
      templateUrl: 'app/cook.html',
      controller: 'HomeController'
    })
    
    .otherwise({
      redirectTo: '/nowhere'
    });

})

.controller('HomeController', function($scope){

});
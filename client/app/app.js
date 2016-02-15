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

})


.factory('Cook', function($http){

  var postLink = function( link ){
    console.log('post link', link);
    //link = JSON.stringify(link);
    return $http({
      method: 'POST',
      url: '/api/links',
      data: link
    }).then(function(resp){
      console.log('Posted!', resp.data);
      return resp.data;
    });
  };

  return {postLink : postLink};

})
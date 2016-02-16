angular.module('mealy', [
  'ngRoute'
  ])

.config(function($routeProvider, $httpProvider){

$routeProvider
    .when('/', {
      templateUrl: 'app/home.html',
      //controller: 'HomeController'
    })
     .when('/cook', {
      templateUrl: 'app/cook.html',
      controller: 'CookController'
    })
     .when('/eat', {
      templateUrl: 'app/eat.html',
     controller: 'EatController'
    })
    
    .otherwise({
      redirectTo: '/nowhere'
    });

})
// Cook Controller //////
.controller('CookController', function($scope, Cook){
  angular.extend($scope, Cook);

  $scope.meal = {
    //time: '18:00:00'
  };
  $scope.sent = false; // for showing some kind of success div

  $scope.addMeal = function(meal){
    console.log(meal)
    Cook.postMeal(meal)
    .then(function(data){
      console.log('addMeal data returned', data);
      $scope.sent = true;
      $scope.meal = {};
    });
  };

})
//////// Eat Controller ////////////////
////////////////////////////////////////
.controller('EatController', function($scope, Eat){
  angular.extend($scope, Eat);

  $scope.getMeals = function(){
    Eat.getMeals()
    .then(function(data){
      console.log('data in $scope.getMeals', data);
      $scope.meals = data;
    });
  };

  $scope.getMeals();

})
/////////////////////////////////////////
/////////////////////
// Cook Factory ////
.factory('Cook', function($http){
  var postMeal = function( mealObject ){
    console.log('post mealObject', mealObject);
    return $http({
      method: 'POST',
      url: '/api/meals',
      data: mealObject
    }).then(function(resp){
      console.log('Posted!', resp.data);
      return resp.data;
    });
  };

  return {
    postMeal : postMeal
  };

})
/////////////////////
// Eat Factory ////
.factory('Eat', function($http){
  var getMeals = function(){
    return $http({
      method: 'GET',
      url: 'api/meals',
    })
    .then(function(resp){
      return resp.data;
    });
  };
  return {
    getMeals: getMeals
  };
});
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
     .when('/signup', {
      templateUrl: 'app/signup.html',
     controller: 'ProfileController'
    })
     .when('/login', {
      templateUrl: 'app/login.html',
     //controller: 'EatController'
    })

    
    .otherwise({
      redirectTo: '/nowhere'
    });

})
// Cook Controller //////
.controller('CookController', function($scope, Cook, Eat){
  angular.extend($scope, Cook);

  $scope.showNameForm = false;
  $scope.reserveSuccess = false;
  $scope.showEatersBool = false;

  $scope.meal = {
    //time: '18:00:00'
    eaters : []
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
/////repeat/////
  $scope.reserve = function(eater){
    console.log($scope.meal);
    console.log(eater);
    $scope.meal.eaters.push(eater);
    console.log($scope.meal);
    // GOT TO POST TO DB
    // will this make a repeat?
    Eat.updateMeal($scope.meal); //api.eaters
    $scope.showNameForm = false;
    // for div after reservation submission
    $scope.reserveSuccess = true;
  };

  console.log($scope.showNameForm);

  $scope.beginReservation = function(){
    $scope.reserveSuccess = false;
    //console.log('compare', Date.parse(this.meal.date) > Date.now());
    //console.log(Date.now())
    $scope.showNameForm = true;
    // set meal object to be meal just clicked on
    $scope.meal = this.meal;
    console.log($scope.meal);
  };

  $scope.showEaters = function(){
    $scope.showNameForm = false;
    $scope.reserveSuccess = false;
    console.log(this.meal.eaters);
    $scope.showEatersBool = true;
    // set meal object to be meal just clicked on
    $scope.meal = this.meal;
  };

})
//////// Eat Controller ////////////////
////////////////////////////////////////
.controller('EatController', function($scope, Eat, Cook){
  angular.extend($scope, Eat);

  //// GETS MEALS JSON
  $scope.getMeals = function(){
    Eat.getMeals()
    .then(function(data){
      console.log('data in $scope.getMeals', data);
      $scope.meals = data;
    });
  };

  $scope.reserve = function(){
    console.log($scope.meal);
  };

  $scope.getMeals();

})
.controller('ProfileController', function($scope, Profile){
  angular.extend($scope, Profile);

  $scope.profile = {
    tab : 0
  };

  $scope.addProfile = function(profile){
    console.log(profile);
    Profile.postProfile(profile)
    .then(function(data){
      console.log('profile data returned', data);
      $scope.sentProfile = true;
      $scope.profile = {
        tab : 0
      };
    });
  };
})
/////////////////////////////////////////
/////////////////////
// Cook Factory ////
.factory('Profile', function($http){
  var postProfile = function( profile ){
    console.log('post profile', profile);
    return $http({
      method: 'POST',
      url: '/api/profiles',
      data: profile
    }).then(function(resp){
      console.log('Posted!', resp.data);
      return resp.data;
    });
  };

  return {
    postProfile : postProfile
  };

})

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

  var updateMeal = function( mealObject ){
    console.log('update mealObject', mealObject);
    return $http({
      method: 'POST',
      url: '/api/eaters',
      data: mealObject
    }).then(function(resp){
      console.log('Posted!', resp.data);
      return resp.data;
    });
  };

  return {
    updateMeal: updateMeal,
    getMeals: getMeals
  };
});

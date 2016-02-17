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
      controller: 'ProfileController'

    })

    
    .otherwise({
      redirectTo: '/nowhere'
    });

})
// Cook Controller //////
.controller('CookController', function($scope, Cook, Eat){
  angular.extend($scope, Cook, Eat);

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
    // WAS TRYING TO GET A PROFILE BY SENDING THE _id STORED IN LOCAL STORAGE WHICH MATCHES THE MONGO _id
   // console.log('id about to be send', window.localStorage.sessionID);
    //console.log({'sessionID' : window.localStorage.sessionID})
    //Eat.getProfile({'sessionID' : window.localStorage.sessionID})
   // .then(function(profile){
     // console.log('profile returned from Eat.getProfile', profile);
    //  $scope.currentProfile = profile;
   // });

    $scope.reserveSuccess = false;
    $scope.showEatersBool = false;
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
/////////////////////////////////////////
/////////////////////
// Profile Controller ////

.controller('ProfileController', function($rootScope, $scope, $location, $window, Profile){
  angular.extend($scope, Profile);

  $scope.profile = {
    tab : 0
  };

  $rootScope.loggedIn = !!window.localStorage.sessionID;    

  console.log('!!', !!window.localStorage.sessionID);
  console.log('before login', $rootScope.loggedIn);

  $scope.loginInfo = {};

  $scope.addProfile = function(profile){
    console.log(profile);
    Profile.postProfile(profile)
    .then(function(data){
      console.log('profile data returned', data);
      $rootScope.loggedIn = true;
      console.log('after login', $rootScope.loggedIn);

      // $scope.profile = {
      //   tab : 0
      // };
      //$window.localStorage.setItem('sessionID', data);
      window.localStorage.sessionID = data;     

      // if(data){
      //   console.log('here');
      //   $location.path(data);
      // }

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
///// LATEST FEATURE NOT SURE IF WORKING, TRYING TO GET A PROFILE DOWN
   var getProfile = function(){
    return $http({
      method: 'GET',
      url: '/api/getprofile',
    })
    .then(function(resp){
      console.log('getProfile data', resp.data);
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
    getMeals: getMeals,
    getProfile: getProfile
  };
});

(function(){
    'use strict';
    angular.module('starter')

    .controller('AccountCtrl', function($rootScope, $scope, $state, User, Day){

        $scope.user = {};
        $scope.logo = true;
        $scope.account = true;
        $scope.login = true;
        $scope.join = false;

        if($rootScope.rootuser){
          $scope.logo = false;
          $scope.login = false;
          $scope.join = false;
          $scope.account = false;
          $scope.archive = true;
          $scope.dayDetail = {};
          $scope.days = [];

          Day.getDays().then(function(response){
            $scope.days = response.data;
            console.log('response from getting all days', response);
          });

          $scope.showDay = function(id){
            Day.showDay(id).then(function(response){
              $scope.archive = false;
              console.log('response from showDay', response);
              $scope.dayDetail = response.data;
              $scope.day = true;
            });
          };

        $scope.backToArchive = function(){
          $scope.day = false;
          $scope.archive = true;
        };

        }

        $scope.showLogo = function(){
          $scope.login = false;
          $scope.join = false;
          $scope.logo = true;
        };

        $scope.showLogin = function(){
          $scope.logo = false;
          $scope.join = false;
          $scope.login = true;
        };

        $scope.showJoin = function(){
          $scope.logo = false;
          $scope.login = false;
          $scope.join =  true;
        };

        $scope.register = function(user){
          User.register(user).then(function(response){
              delete user.email;
              delete user.phone;
              $scope.signin(user);
          }, function(){
            $scope.user = {};
          });
        };

        $scope.signin = function(user){
            User.login(user).then(function(response){
                console.log(response);
                $rootScope.rootuser = response.data;
                console.log('authenticatd');
                $state.go('tab.dash');
                $scope.user = {};
            }, function(){
                console.log('bad user/pss');
                $scope.user = {};
            });
        };
    });
})();

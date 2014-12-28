(function(){
    'use strict';
    angular.module('starter')

    .controller('AccountCtrl', function($rootScope, $scope, $state, User){

        $scope.user = {};
        $scope.account = true;
        $scope.logo = true;
        $scope.login = true;
        $scope.join = false;

        if($rootScope.rootuser){
          console.log($rootScope.rootuser);
          $scope.logo = false;
          $scope.login = false;
          $scope.join = false;
          $scope.account = false;
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

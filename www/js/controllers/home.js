(function(){
  'use strict';
  angular.module('starter')

  .controller('HomeCtrl', function($rootScope, $scope, $state, User, Day){
      $scope.archive = true;
      $scope.dayDetail = {};
      $scope.days = [];
      Day.getDays().then(function(response){
        $scope.days = response.data;
        console.log('response from getting all days', response);
      });

      $scope.showDay = function(id){
        Day.showDay(id).then(function(response){
          console.log('response from showDay', response);
          $scope.dayDetail = response.data;
          $scope.day = true;
        });
      };

  });
})();

(function(){
 'use strict';
angular.module('starter')

.controller('FriendsCtrl', function($scope, Friends){
  $scope.friends = Friends.all();
})

.controller('AccountCtrl', function($scope){
});
})();

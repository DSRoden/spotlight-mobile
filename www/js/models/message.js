(function(){
  'use strict';

  angular.module('starter')
  .factory('Message', ['$http', 'origin', function($http, origin){

    function getAll(){
      console.log('getting all messages');
      return $http.get(origin + '/messages');
    }

    function getAllAuthenticated(){
      return $http.get(origin + '/messages/authenticated');
    }

    return {getAll: getAll, getAllAuthenticated: getAllAuthenticated};
  }]);
})();

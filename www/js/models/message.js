(function(){
  'use strict';

  angular.module('starter')
  .factory('Message', ['$http', 'origin', function($http, origin){

    function getAll(){
      console.log('getting all messages');
      return $http.get(origin + '/messages');
    }

    return {getAll: getAll};
  }]);
})();

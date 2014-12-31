(function(){
  'use strict';

  angular.module('starter')
  .factory('Photo', ['$http', 'origin', function($http, origin){

    function getAll(){
      //console.log('getting all photos');
      return $http.get(origin + '/photos');
    }

    function getAllAuthenticated(){
      return $http.get(origin + '/photos/authenticated');
    }

    function upload(b64){
      return $http.post(origin + '/photos', {b64:b64});
    }
    return {getAll: getAll, getAllAuthenticated: getAllAuthenticated, upload: upload};
  }]);
})();

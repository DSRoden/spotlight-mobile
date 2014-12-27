(function(){
  'use strict';

  angular.module('starter')
  .factory('Photo', ['$http', 'origin', function($http, origin){

    function getAll(){
      //console.log('getting all photos');
      return $http.get(origin + '/photos');
    }

    function upload(b64){
      return $http.post(origin + '/photos', {b64:b64});
    }
    return {getAll: getAll, upload: upload};
  }]);
})();

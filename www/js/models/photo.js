(function(){
  'use strict';

  angular.module('starter')
  .factory('Photo', ['$http', 'origin', function($http, origin){
    function upload(b64){
      return $http.post(origin + '/photos', {b64:b64});
    }
    return {upload: upload};
  }]);
})();

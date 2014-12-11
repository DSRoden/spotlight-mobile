(function(){
  'use strict';

  angular.module('starter')
    .factory('Note', ['$http', 'origin', function($http, origin){
        function count(){
          return $http.get(origin + '/notes/count');
        }
        function query(tag, page){
          return $http.get(origin + '/notes?limit=5&offset=' + 5 * page + '&tag=' + tag);
        }
        function show(noteId){
          return $http.get(origin + '/notes/' + noteId);
        }
        function upload(noteId, b64){
          return $http.post(origin + '/notes/' + noteId + '/upload-mobile', {b64:b64});
        }
      return {count:count, query:query, show:show, upload: upload};
    }]);
})();


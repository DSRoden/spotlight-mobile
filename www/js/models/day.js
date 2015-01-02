(function(){
  'use strict';

  angular.module('starter')
  .factory('Day', ['$http', 'origin', function($http, origin){

    function getDays(){
      console.log('getting all days');
      return $http.get(origin + '/days');
    }

    function showDay(id){
      console.log('getting specific day with id', id);
      return $http.post(origin + '/day', {dayId : id});
    }

    return {getDays: getDays, showDay: showDay};
  }]);
})();

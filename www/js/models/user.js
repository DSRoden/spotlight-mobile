(function(){
  'use strict';

  angular.module('starter')
    .factory('User', ['$http', 'origin', function($http, origin){

      function register(user){
        //console.log('user object', user);
        return $http.post(origin + '/register', user);
      }

      function login(user){
        return $http.post(origin + '/login', user);
      }
      function logout(){
        return $http.delete(origin + '/logout');
      }

      function runLottery(){
        //console.log('getting users, in factory');
        return $http.get(origin + '/users');
      }

      function selectWinner(id){
        //console.log('sending winner id for selecting spotlight', id);
        return $http.post(origin + '/winner', {id: id});
      }

      function notifyWinner(id){
        return $http.post(origin + '/notify', {id: id});
      }

      function isSpotlightOn(){
        return $http.get(origin + '/spotlightcheck');
      }

      function validateSpotlight(password){
        //console.log('validating spotlight with password: ', password);
        return $http.post(origin +'/spotlight', {password : password});
      }

      return {register:register, login:login, logout:logout, runLottery: runLottery, selectWinner: selectWinner, notifyWinner: notifyWinner, isSpotlightOn: isSpotlightOn, validateSpotlight: validateSpotlight};
    }]);
})();

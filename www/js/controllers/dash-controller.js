(function(){
    'use strict';
    angular.module('starter')

    .controller('DashCtrl', function($rootScope, $scope, $state, Note, User){

        Note.count().then(function(response){
            console.log('notes count',response.data.count);
            $scope.count = response.data.count;
             $scope.dashboard = true;
        }, function(){
            console.log('notes count not coming in');
        });

        $scope.logout = function(){
            User.logout().then(function(){
               console.log('logout successful');
                $rootScope.rootuser = {};
               $state.go('tab.account');
                $scope.dashboard = false;
            }, function(){
               console.logout('logout unsuccessful');
            });
        };
    });
})();

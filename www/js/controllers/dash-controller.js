(function(){
    'use strict';
    angular.module('starter')

    .controller('DashCtrl', function($rootScope, $scope, $state, Note, User, socketUrl){
        $scope.messages = [];
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

        var socket = io.connect(socketUrl);

        $scope.chat = function(msg){
            socket.emit('globalChat', {avatar:$rootScope.rootuser.avatar,                               content:msg});
        };

        socket.on('bGlobalChat', function(data){
            $scope.messages.unshift(data);
            $scope.messages = $scope.messages.slice(0, 100);
            $scope.message = null;
            //$('#message').focus();
            $scope.$digest();
        });
    });
})();

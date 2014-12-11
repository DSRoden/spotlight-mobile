(function(){
    'use strict';
    angular.module('starter')
    .controller('NoteDetailCtrl', function($rootScope, $scope, $state, Note){
        function show(){
            Note.show($state.params.noteId).then(function(response){
                $scope.note = response.data;
                console.log('note', $scope.note);
            });
        }

        function success(b64){
            Note.upload($state.params.noteId, b64).then(function(){
            show();
        });
        }

    function error(msg){
      console.log(msg);
    }

        $scope.snap = function(){
            var options = {
                quality : 75,
                destinationType: Camera.DestinationType.DATA_URL
            };
            navigator.camera.getPicture(success, error, options);
        };

        $scope.select = function(){
              var options = {
                quality : 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            };
            navigator.camera.getPicture(success, error, options);
        };

    show();

    });
})();

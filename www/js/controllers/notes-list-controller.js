(function(){
    'use strict';
    angular.module('starter')
    .controller('NotesListCtrl', function($rootScope, $scope, $state, Note){
        $scope.notes = [];
        Note.query($state.params.tag || '%', $state.params.page * 1 || 0).then(function(response){
            $scope.notes = response.data.notes;
            console.log('single note', $scope.notes[0]);
        });
    });
})();

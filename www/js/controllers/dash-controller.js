(function(){
    'use strict';
    angular.module('starter')

    .controller('DashCtrl', function($rootScope, $scope, $state, User, Message, socketUrl){
      console.log($rootScope.rootuser);
      //estalishing socket connection
      var socket = io.connect(socketUrl);
      $scope.message = {};
      $scope.messages = [];
      $scope.updates = [];
      $scope.winner = {};
      $scope.lotteryNum = null;
      $scope.winner = null;
      $scope.showAdmin = false;
      $scope.showWinner = false;
      $scope.spotlight = {};
      $scope.confirmed = false;
      $scope.validated = false;

      //photo testing
      $scope.photos =[];
      $scope.photos.push({time: '2014-12-24T19:56:25.745Z', url: 'https://cdn3.iconfinder.com/data/icons/pictofoundry-pro-vector-set/512/Avatar-512.png'});
      $scope.photos.push({time: '2014-12-24T20:40:29.793Z', url: 'https://cdn3.iconfinder.com/data/icons/pictofoundry-pro-vector-set/512/Avatar-512.png'});

      //merge photos and messages
      $scope.merge = function(){
        $scope.updates = _.union($scope.photos, $scope.messages);
      };

      //make a call to db to get all messages for current day
      Message.getAll().then(function(response){
        //console.log(response);
        $scope.messages = response.data;
        $scope.merge();
      });

      //check to see if rootuser is in the spotlight
      User.isSpotlightOn().then(function(response){
        //console.log('response from isSpotlightOn', response);
        $scope.confirmed = (response.data.confirmed) ? true : false;
        $scope.validated = (response.data.validated) ? true : false;
        if($scope.validated){$scope.confirmed = false;}
      });

      //validate the winner's password
      $scope.validate = function(){
        //console.log('validating password button clicked');
        User.validateSpotlight($scope.spotlight.password).then(function(response){
          //console.log(response);
          if(response.data.validated){
            $scope.validated = true;
            $scope.confirmed = false;
          }
          //console.log('rootuser', $rootScope.rootuser);
        });
      };

      //manual lottery
      $scope.runLottery = function(){
        //run function if rootuse is admin - cosmetic since real validation runs on server
        if($rootScope.rootuser.id !== 1){return;}
        User.runLottery().then(function(response){
          //console.log('getting all users, in scope', response);
          //console.log('response from lotter', response);
          if(response.data !== ''){
            $scope.showAdmin = true;
          }
          $scope.winner = response.data;
        });
      };

      //select a lottery winner on load
      $scope.runLottery();

      //set winner as spotlight
      $scope.selectWinner = function(id){
        //console.log(id);
        User.selectWinner(id).then(function(response){
          //console.log(response);
          $scope.winner = response.data;
          //console.log($scope.winner.id);
          //create winner variable and emit info
          var winner = $scope.winner;
          //console.log('winner received and being emitted', winner);
          socket.emit('spotlightChosen', {winner: winner});
        });
      };

      $scope.winnerInfo = function(){
        $scope.showWinner = ($scope.showWinner) ? false : true;
      };


      //notify the winner with an email and a password
      $scope.notifyWinner = function(){
        User.notifyWinner($scope.winner.id).then(function(){
          console.log('winner notified successfully');
        }, function(){
          console.log('failed to notify winner');
        });
      };


      //show winner password option
      socket.on('areYouTheSpotlight', function(data){
        $scope.selectedUser = data.winner.id;
        console.log('spotlight id', $scope.selectedUser);
        console.log('current user id', $rootScope.rootuser.id);
        if($rootScope.rootuser.id === $scope.selectedUser){
          console.log('inside are you the spotlight if statement');
          $scope.$apply(function(){
            $scope.confirmed = true;
            $scope.validated = false;
            console.log('confirmed>>>>', $scope.confirmed);
          });
        } else {
          $scope.$apply(function(){
            $scope.confirmed = false;
            $scope.validated = false;
            $scope.messages = [];
          });
        }
      });


      //sending messages, need to be validated as spotlight
      $scope.chat = function(msg){
        socket.emit('globalChat', {id: $scope.rootuser.id, content:msg});
        $scope.$apply(function(){
          $scope.message = '';
        });
      };


      socket.on('bGlobalChat', function(data){
        console.log(data);
        $scope.updates.unshift(data);
        // $scope.messages = $scope.messages.slice(0, 100);
        $scope.message = null;
        $scope.$digest();
      });

      //logout function
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

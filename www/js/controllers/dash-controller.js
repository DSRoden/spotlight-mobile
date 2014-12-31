(function(){
    'use strict';
    angular.module('starter')
    .controller('DashCtrl', function($rootScope, $scope, $state, User, Message, socketUrl, Photo){

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
      $scope.photos =[];

      //merge photos and messages
      $scope.merge = function(){
        $scope.updates = _.union($scope.photos, $scope.messages);
      };


      if(!$rootScope.rootuser){

        //make a call to db to get all photos for current day
        Photo.getAll().then(function(response){
          $scope.photos = response.data;
        });

        //make a call to db to get all messages for current day
        Message.getAll().then(function(response){
          //console.log(response);
          $scope.messages = response.data;
          $scope.merge();
        });

      } else {

        //make a call to db to get all photos for current day
        Photo.getAllAuthenticated().then(function(response){
          $scope.photos = response.data;
        });

        console.log('authenticated');
        //make a call to db to get all messages for current day
        Message.getAllAuthenticated().then(function(response){
          console.log(response);
          $scope.messages = response.data;
          $scope.merge();
        });
      }


      //check to see if rootuser is in the spotlight
      $scope.checkSpotlight = function(){
        User.isSpotlightOn().then(function(response){
          //console.log('response from isSpotlightOn', response);
          $scope.confirmed = (response.data.confirmed) ? true : false;
          $scope.validated = (response.data.validated) ? true : false;
          if($scope.validated){$scope.confirmed = false;}
        });
      };

      //when a message is liked
      $scope.like = function(update){
        console.log('update that is being liked', update);
        //emit to db to update the count of likes for that message
        update.liked = 'yes';
        if(update.content){
          $scope.messageLiked($rootScope.rootuser.id, update.id);
        } else if(update.url){
          $scope.imageLiked($rootScope.rootuser.id, update.id);
        }

      };

      //function to emit when a message is liked
      $scope.messageLiked = function(userId, messageId){
        console.log('emmitting message liked with user id and message id' + userId +', ' + messageId);
        socket.emit('messageLiked', {userId: userId, messageId: messageId});
      };

      //function to emit when a message is liked
      $scope.imageLiked = function(userId, imageId){
        console.log('emmitting message liked with user id and message id' + userId +', ' + imageId);
        socket.emit('messageLiked', {userId: userId, imageId: imageId});
      };

      //when a message has been liked
      socket.on('newLike', function(data){
        //gets back the entire message, including id and new likes count
        console.log('newlike from sockets', data);
        //reset it's likes to a new count
        $scope.$apply(function(){
          for(var i = 0; i < $scope.updates.length; i++){
            if($scope.updates[i].id === data.id){$scope.updates[i].likes = data.likes;}
          }
        });
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
      if($rootScope.rootuser){
        $scope.runLottery();
      }

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

      //adding new message to messages
      socket.on('bGlobalChat', function(data){
        console.log(data);
        $scope.updates.unshift(data);
        // $scope.messages = $scope.messages.slice(0, 100);
        $scope.message = null;
        $scope.$digest();
      });


      //camera and photos success and error functions
      function success(b64){
        Photo.upload(b64).then(function(response){

          $scope.emitMessage({time: response.data.time, url: response.data.url, id: response.data.id});
          //console.log('photo sent  successfully');
        });
      }

      function error(msg){
        console.log(msg);
      }


      $scope.emitMessage = function(data){
        socket.emit('globalImage', data);
      };

      //take a photo
      $scope.snap = function(){
        var options = {
          quality : 75,
          destinationType: Camera.DestinationType.DATA_URL
        };
        navigator.camera.getPicture(success, error, options);
      };

      //select a photo
      $scope.select = function(){
        var options = {
          quality : 75,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        };
        navigator.camera.getPicture(success, error, options);
      };

      //getting back image from sockets
      socket.on('bGlobalImage', function(data){
        console.log('image from sockets', data);
        $scope.updates.unshift(data);
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

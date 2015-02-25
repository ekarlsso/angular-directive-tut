'use strict';

angular.module('scoreApp', [])
.factory('PlayerService', ['$q', function($q) {
  var idCounter = 3;
  var players = [
    {
      id: 1,
      name: 'Test Player 1',
      score: 5000
    },
    {
      id: 2,
      name: 'Test Player 2',
      score: 4500
    },
    {
      id: 3,
      name: 'Test Player 3',
      score: 9500
    }  
  ];
  return {
    removePlayer: function(id) {
      players = _.filter(players, function(player) {
        return player.id != id;
      });
    },
    addPlayer: function(player) {
      var newPlayer = _.clone(player);
      idCounter++;
      newPlayer.id = idCounter;
      players.push(newPlayer);
    },
    loadPlayers: function() {
      var result = $q.defer();
      result.resolve(players);
      return result.promise;
    }
  };
}])
.directive('topScoresComponent', function() {
  return {
    controller: 'TopScoresController',
    templateUrl: 'app/top-scores.html',
    controllerAs: 'ctrl'
  };
})
.controller('TopScoresController', ['$scope', 'PlayerService', function($scope, PlayerService) {
  $scope.topScores = {};

  var reloadPlayers = function() {
    PlayerService.loadPlayers().then(function(players) {
      var sortedPlayers = _.sortBy(players, function(player) {
        return -1 * player.score;
      });
      $scope.topScores.players = sortedPlayers;
    });
  };

  reloadPlayers();

  this.removePlayer = function(player) {
    PlayerService.removePlayer(player.id);
    reloadPlayers();
  };

  this.addUser = function() {
    PlayerService.addPlayer({
      name: $scope.newPlayer.name,
      score: parseInt($scope.newPlayer.score)
    });
    $scope.newPlayer = {};
    reloadPlayers();
  };
}]);

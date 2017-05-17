angular.module('playService', [])
  .factory('Play', function ($http) {
    var playFactory = {};

    playFactory.getVideos = function () {
      return $http.get('https://api.reddit.com/r/videos/hot.json');
    };

    return playFactory;
  });
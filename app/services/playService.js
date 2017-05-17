angular.module('playService', [])
  .factory('Play', function ($http) {
    var playFactory = {};
    var baseUrl = 'https://api.reddit.com/r/';
    playFactory.getVideos = function (subreddit, type) {
      url = baseUrl+subreddit+'/'+type+'.json';
      return $http.get(url);
    };

    return playFactory;
  });
angular.module('playService', [])
  .factory('Play', function ($http) {
    var playFactory = {};
    var baseUrl = 'https://api.reddit.com/r/';
    playFactory.getVideosFromSubreddit = function (subreddit, type, limit) {
      url = baseUrl+subreddit+'/'+type+'.json?limit='+limit;
      console.log(url);
      return $http.get(url);
    };

    return playFactory;
  });
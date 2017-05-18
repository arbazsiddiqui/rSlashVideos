angular.module('playService', [])
  .factory('Play', function ($http) {
    var playFactory = {};
    var baseUrl = 'https://api.reddit.com/r/';
    playFactory.getVideosFromSubreddit = function (subreddit, type, limit) {
      if(limit==null)
        url = baseUrl+subreddit+'/'+type+'.json';
      else
        url = baseUrl+subreddit+'/'+type+'.json?limit='+limit;
      return $http.get(url);
    };

    return playFactory;
  });
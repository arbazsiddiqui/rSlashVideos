angular.module('playService', [])
  .factory('Play', function ($http) {
    var playFactory = {};
    var baseUrl = 'https://api.reddit.com/r/';
    playFactory.getVideosFromSubreddit = function (subreddit, listing, limit) {
      var url = baseUrl+subreddit+'/'+listing+'.json?limit='+limit;
      if(listing=='topAllTime')
        url = baseUrl+subreddit+'/top.json?limit='+limit+'&t=all';
      else if(listing=='topHour')
        url = baseUrl+subreddit+'/top.json?limit='+limit+'&t=hour';
      else if(listing=='topDay')
        url = baseUrl+subreddit+'/top.json?limit='+limit+'&t=day';
      else if(listing=='topWeek')
        url = baseUrl+subreddit+'/top.json?limit='+limit+'&t=week';
      else if(listing=='topMonth')
        url = baseUrl+subreddit+'/top.json?limit='+limit+'&t=month';
      else if(listing=='topYear')
        url = baseUrl+subreddit+'/top.json?limit='+limit+'&t=year';
      console.log(url);
      return $http.get(url);
    };

    return playFactory;
  });
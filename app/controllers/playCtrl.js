angular.module('playCtrl', [])
  .controller('PlayController', function ($scope, $rootScope, Play, $sce, $window) {

    $scope.videos = [];
    $scope.subreddits = ["videos", "deepIntoYouTube", "documentaries", "music", "gaming", "ted", "woahTube", "asmr", "contagiousLaughter"];
    $scope.sr = "";
    $scope.listings = ["hot", "topAllTime", "topHour", "topDay", "topWeek", "topMonth", "topYear"];
    $scope.listing = "hot";
    $scope.currentSubreddit = "videos";
    $scope.currentVideoIndex = 0;
    $scope.playVideoUrl = $sce.trustAsHtml('<iframe></iframe>');

    $scope.getVideosFromSubreddit = function (subreddit, listing, limit) {
      $scope.playVideoUrl = $sce.trustAsHtml('<h2>Loading '+listing+' videos from r/'+subreddit+'...'+'</h2>');
      resetScope();
      $scope.currentSubreddit = subreddit;
      Play.getVideosFromSubreddit(subreddit, listing, limit)
        .success(function (data) {
          createVideoList(data.data.children);
          if ($scope.videos.length != 0)
            $scope.playVideo($scope.videos[0]);
          else
            $scope.playVideoUrl = $sce.trustAsHtml('<h1>No videos in this subreddit :(</h1>');
        })
        .error(function (err) {
          $scope.playVideoUrl = $sce.trustAsHtml('<h1>Subreddit not found :(</h1>');
        })
    };

    $scope.playVideo = function (video, index) {
      if (index)
        $scope.currentVideoIndex = index;
      $scope.playVideoUrl = $sce.trustAsHtml(video.embedHtml);
      $scope.playVideoTitle = video.title;
      $scope.playVideoRedditLink = video.redditLink;
    };

    $scope.addSubreddit = function () {
      $scope.subreddits.push($scope.sr);
      $scope.getVideosFromSubreddit($scope.sr, $scope.listing, 100);
      $scope.sr = ""
    };

    $scope.playRandomVideo = function () {
      Play.getVideosFromSubreddit('videos', 'random', null)
        .success(function (data) {
          randomvideo = {};
          randomvideo['title'] = data[0].data.children[0].data.title;
          randomvideo['redditLink'] = "https://www.reddit.com" + data[0].data.children[0].data.permalink;
          embedHtml = document.createElement('div');
          embedHtml.innerHTML = data[0].data.children[0].data.media.oembed.html;
          randomvideo['embedHtml'] = embedHtml.textContent;
          $scope.playVideo(randomvideo);
        });
    };

    $scope.shuffle = function () {
      var currentIndex = $scope.videos.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = $scope.videos[currentIndex];
        $scope.videos[currentIndex] = $scope.videos[randomIndex];
        $scope.videos[randomIndex] = temporaryValue;
      }
    };

    $scope.applySubredditListing = function () {
      $scope.getVideosFromSubreddit($scope.currentSubreddit, $scope.listing, 100)
    };

    $scope.next = function () {
      $scope.playVideo($scope.videos[$scope.currentVideoIndex + 1])
      $scope.currentVideoIndex = $scope.currentVideoIndex + 1;
    };

    $scope.previous = function () {
      $scope.playVideo($scope.videos[$scope.currentVideoIndex - 1]);
      $scope.currentVideoIndex = $scope.currentVideoIndex - 1;
    };

    $scope.reload = function () {
      $window.location.reload()
    };

    $scope.isActive = function(item) {
      return $scope.currentSubreddit === item;
    };

    var createVideoList = function (children) {
      for (i = 0; i < children.length; i++) {
        child = children[i];
        temp = {};
        if (child.data.media != null) {
          if (child.data.media.oembed.type == 'video') {
            temp['thumbnailUrl'] = child.data.media.oembed.thumbnail_url;
            embedHtml = document.createElement('div');
            embedHtml.innerHTML = child.data.media.oembed.html;
            temp['embedHtml'] = embedHtml.textContent;
            temp['title'] = child.data.title;
            temp['redditLink'] = "https://www.reddit.com" + child.data.permalink;
            $scope.videos.push(temp);
          }
        }
      }
    };

    var resetScope = function () {
      $scope.videos = [];
      $scope.currentVideoIndex = 0;
      $scope.playVideoTitle = "";
      $scope.playVideoRedditLink = "";
    };

    $scope.getVideosFromSubreddit($scope.currentSubreddit, $scope.listing, 100)
  });
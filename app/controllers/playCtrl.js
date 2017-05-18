angular.module('playCtrl', [])
  .controller('PlayController', function ($scope, $rootScope, Play,$sce) {

    $scope.videos = [];
    $scope.subreddits = ["videos", "deepIntoYouTube", "documentaries", "music", "gaming", "ted", "woahTube", "asmr", "contagiousLaughter", "wtf"];
    $scope.sr = "";
    $scope.listings= ["hot", "topAll", "topHour", "topDay", "topWeek", "topMonth", "topYear"];
    $scope.listing = "hot";
    $scope.currentSubreddit = "videos";

    $scope.getVideosFromSubreddit = function (subreddit, listing, limit){
      Play.getVideosFromSubreddit(subreddit, listing, limit)
        .success(function (data) {
          $scope.currentSubreddit = subreddit;
          $scope.videos = [];
          createVideoList(data.data.children);
          if($scope.videos.length!=0){
            $scope.playVideo($scope.videos[0])
          }
          else
            $scope.playVideoUrl =  $sce.trustAsHtml('<h1>No videos in this subreddit :(</h1>');
        });
    };

    $scope.playVideo = function (video) {
      $scope.playVideoUrl = $sce.trustAsHtml(video.embedHtml);
      $scope.playVideoTitle = video.title;
      $scope.playVideoRedditLink = video.redditLink;
    };

    var createVideoList = function (children) {
      for(i=0; i<children.length; i++){
        child = children[i];
        temp = {};
        if(child.data.media != null){
          if(child.data.media.oembed.type == 'video'){
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

    //onload default
    $scope.getVideosFromSubreddit($scope.currentSubreddit, $scope.listing, 100)

  });
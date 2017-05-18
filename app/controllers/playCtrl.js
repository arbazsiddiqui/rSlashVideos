angular.module('playCtrl', [])
  .controller('PlayController', function ($scope, $rootScope, Play,$sce) {

    $scope.videos = [];
    $scope.subreddits = ["videos", "deepIntoYouTube", "documentaries", "music", "gaming", "ted", "woahTube", "asmr", "contagiousLaughter", "wtf"];
    $scope.sr = "";
    $scope.getVideosFromSubreddit = function (subreddit, type, limit){
      Play.getVideosFromSubreddit(subreddit, type, limit)
        .success(function (data) {
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
      $scope.getVideosFromSubreddit($scope.sr, 'hot', 100);
      $scope.sr = ""
    };

    $scope.playRandomVideo = function () {
      Play.getVideosFromSubreddit('videos', 'random', null)
        .success(function (data) {
            console.log(data);
            randomvideo = {};
            randomvideo['title'] = data[0].data.children[0].data.title;
            randomvideo['redditLink'] = "https://www.reddit.com" + data[0].data.children[0].data.permalink;
            embedHtml = document.createElement('div');
            embedHtml.innerHTML = data[0].data.children[0].data.media.oembed.html;
            randomvideo['embedHtml'] = embedHtml.textContent;
            $scope.playVideo(randomvideo);
        });
    };

    //onload default
    $scope.getVideosFromSubreddit('videos', 'hot', 100)

  });
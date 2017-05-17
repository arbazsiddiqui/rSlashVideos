angular.module('playCtrl', [])
  .controller('PlayController', function ($scope, $rootScope, Play,$sce) {

    $scope.getVideosFromSubreddit = function (subreddit, type){
      Play.getVideos(subreddit, type)
        .success(function (data) {
          var children = data.data.children;
          $scope.videos = createVideoList(children);
          $scope.playVideoUrl =  $sce.trustAsHtml($scope.videos[0].embedHtml);
        });
    };

    $scope.playVideo = function (embedHtml) {
      $scope.playVideoUrl = $sce.trustAsHtml(embedHtml);
    };

    var createVideoList = function (children) {
      var videos = [];
      var count = 0;
      for(i=0; i<children.length && count<10; i++){
        temp = {};
        if(children[i].data.media != null){
          if(children[i].data.media.oembed.type == 'video'){
            temp['thumbnailUrl'] = children[i].data.media.oembed.thumbnail_url;
            embedHtml = document.createElement('div');
            embedHtml.innerHTML = children[i].data.media.oembed.html;
            temp['embedHtml'] = embedHtml.textContent;
            videos.push(temp);
            count = count+1;
          }
        }
      }
      return videos;
    };
    
    //onload default
    $scope.getVideosFromSubreddit('videos', 'top')

  });
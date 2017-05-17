angular.module('playCtrl', [])
  .controller('PlayController', function ($scope, $rootScope, Play,$sce) {
    Play.getVideos()
      .success(function (data) {
        var videos = data.data.children;
        var div = document.createElement('div');
        div.innerHTML = videos[0].data.media.oembed.html;
        $scope.url =  $sce.trustAsHtml(div.textContent);
      });
  });
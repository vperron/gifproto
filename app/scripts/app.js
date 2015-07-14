'use strict';

var angular = require('shimp-js').angular();
require('angular-ui-router');

angular.module('app', [
  'ui.router',
  'app.templates',
])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.when('/', '/main');
  $urlRouterProvider.when('', '/main');

  $stateProvider
  .state('main', {
    url: '/main',
    controller: 'MyCtrl',
    templateUrl: 'app/templates/main.jade',
  });
})

.controller('MyCtrl', function() {

  var element = document.getElementById('image');
  var ctx = element.getContext('2d');

  var img = new Image();
  img.src = 'assets/img.jpg';
  img.onload = function() {

    var w = this.width;
    var h = this.height;

    ctx.canvas.width = w;
    ctx.canvas.height = h;
    
    // ctx.drawImage(im, 0, 0);
    ctx.canvas.height = h;
    ctx.canvas.width = w;
    ctx.fillStyle = '#dedede';
    ctx.fillRect(0, 0, w, h);
    var imageData = ctx.getImageData(0, 0, w, h);

    // for (var y = 0; y < height; y++) {
    //   var inpos = y * width * 4; // *4 for 4 ints per pixel
    //   var outpos = inpos + width * 4
    //   for (var x = 0; x < width; x++) {
    //     var r = imageData.data[inpos++];
    //     var g = imageData.data[inpos++];
    //     var b = imageData.data[inpos++];
    //     var a = imageData.data[inpos++];

    //     imageData.data[outpos++] = r;
    //     imageData.data[outpos++] = g;
    //     imageData.data[outpos++] = b;
    //     imageData.data[outpos++] = a;
    //   }
    // }

    // put pixel data on canvas
    // c.putImageData(imageData, 0, 0);
  };
});

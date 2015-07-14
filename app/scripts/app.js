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

  function identityCb(rgba) {
    return rgba;
  }

  function blackCb(rgba) {
    return [0, 0, 0, 0xff];
  }

  function getPixel(arr, row, col) {
    return [
      arr[row + col + 0],
      arr[row + col + 1],
      arr[row + col + 2],
      arr[row + col + 3],
    ];
  }

  function setPixel(arr, row, col, pixel) {
    arr[row + col + 0] = pixel[0];
    arr[row + col + 1] = pixel[1];
    arr[row + col + 2] = pixel[2];
    arr[row + col + 3] = pixel[3];
  }

  function redrawPixels(data, w, h, callback) {
    for (var y=0; y<h; y=y+1) {
      for (var x=0; x<w; x=x+1) {
        var row = y * (w*4);
        var col = 4*x;

        var pixel = getPixel(data, row, col);
        pixel = callback(pixel);
        setPixel(data, row, col, pixel);
      }
    }
  }

  var element = document.getElementById('image');
  var ctx = element.getContext('2d');

  var img = new Image();
  img.src = 'assets/img.jpg';
  img.onload = function() {

    var w = this.width;
    var h = this.height;

    ctx.canvas.width = w;
    ctx.canvas.height = h;
    
    ctx.drawImage(img, 0, 0);
    var imageData = ctx.getImageData(0, 0, w, h);
    
    ctx.fillStyle = '#dedede';
    ctx.fillRect(0, 0, w, h);

    var origData = new Uint8ClampedArray(imageData.data);
    var drawBlack = true;
    setInterval(function() {
      
      if (drawBlack) {
        redrawPixels(imageData.data, w, h, blackCb);
      } else {
        redrawPixels(imageData.data, w, h, identityCb);
      }
      ctx.putImageData(imageData, 0, 0);

      imageData.data.set(origData);
      drawBlack = ! drawBlack;
    }, 1000 / 10);


  };
});

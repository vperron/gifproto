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
  element.style.display = 'none'; // hide the image source for now
  var ctx = element.getContext('2d');

  var freq = 2;
  var img = new Image();
  img.src = 'assets/img.jpg';
  img.onload = function() {

    var w = this.width;
    var h = this.height;

    ctx.canvas.width = w;
    ctx.canvas.height = h;
    
    ctx.drawImage(img, 0, 0);  // draw it once, to get the Image Data
    var imageData = ctx.getImageData(0, 0, w, h);
    
    ctx.fillStyle = '#dedede';
    ctx.fillRect(0, 0, w, h);

    // Corners
    var divider = h / 20;
    var layer = ctx.createImageData(w, divider);

    // Canvasses
    var children = document.getElementById('children');
    var images = new Array(divider);
    for(var i=0; i<divider; i=i+1) {
      var canvas = document.createElement('canvas');
      children.appendChild(canvas);
      var context = canvas.getContext('2d');
      images[i] = {
        context: context,
        imageData: context.createImageData(w, divider),
      };
    };

    var n = 0;
    function redraw() {
      console.log('redrawing...');
      var index = 0;
      var pixels = imageData.data.subarray(index*divider*w*4, (index+1)*divider*w*4);
      // layer.data.set(pixels);
      // ctx.putImageData(layer, 0, index*divider);

      // Subcanvasses
      var item = images[index];
      if (n % freq) {
        item.imageData.data.set(pixels);
        item.context.canvas.width = w;
        item.context.canvas.height = divider;
        item.context.putImageData(item.imageData, 0, 0);
      } else {
        item.context.fillStyle = '#dedede';
        item.context.fillRect(0, 0, w, divider);
      }
      n = n + 1;
      for(var index=1; index<h/divider; index=index+1) {
        var pixels = imageData.data.subarray(index*divider*w*4, (index+1)*divider*w*4);
        // layer.data.set(pixels);
        // ctx.putImageData(layer, 0, index*divider);

        // Subcanvasses
        var item = images[index];
        item.imageData.data.set(pixels);
        item.context.canvas.width = w;
        item.context.canvas.height = divider;
        item.context.putImageData(item.imageData, 0, 0);
      }
    }

    redraw();
    setInterval(redraw, 1000/freq);
  };
});

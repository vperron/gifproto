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

    // Canvasses
    var children = document.getElementById('children');
    var images = new Array(divider);
    for(var i=0; i<divider; i=i+1) {
      var canvas = document.createElement('canvas');
      children.appendChild(canvas);
      var context = canvas.getContext('2d');
      images[i] = {
        canvas: canvas,
        context: context,
        imageData: context.createImageData(w, divider),
      };
    }


    function drawWholeImage() {
      for(var index=0; index<h/divider; index=index+1) {
        var pixels = imageData.data.subarray(index*divider*w*4, (index+1)*divider*w*4);

        // Subcanvasses
        var item = images[index];
        item.imageData.data.set(pixels);
        item.context.canvas.width = w;
        item.context.canvas.height = divider;
        item.context.putImageData(item.imageData, 0, 0);
      }
    }

    var n = 0;
    var index = 0;
    var pixels = imageData.data.subarray(index*divider*w*4, (index+1)*divider*w*4);

    function switchFirst() {
      var item = images[index];
      if (n % freq === 1) {
        console.log('switching alpha to 1');
        item.context.globalAlpha = 1.0;
        item.imageData.data.set(pixels);
        item.context.putImageData(item.imageData, 0, 0);
        item.context.restore();
      }
      if (n % freq === 0) {
        console.log('switching alpha to 0');
        item.context.globalAlpha = 0;
        item.imageData.data.set(pixels);
        item.context.putImageData(item.imageData, 0, 0);
        item.context.restore();
      }
      n = n + 1;
    }

    drawWholeImage();
    // redraw();
    setInterval(switchFirst, 1000/freq);
  };
});

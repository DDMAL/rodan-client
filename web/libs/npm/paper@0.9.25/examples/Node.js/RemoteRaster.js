/* */ 
var paper = require('../../dist/paper-node');
var fs = require('fs');
var canvas = new paper.Canvas(800, 600);
paper.setup(canvas);
var url = 'http://assets.paperjs.org/images/marilyn.jpg';
var raster = new paper.Raster(url);
raster.position = paper.view.center;
raster.onLoad = function() {
  console.log('The image has loaded:' + raster.bounds);
  out = fs.createWriteStream(__dirname + '/canvas.png');
  stream = canvas.pngStream();
  stream.on('data', function(chunk) {
    out.write(chunk);
  });
  stream.on('end', function() {
    console.log('saved png');
  });
};

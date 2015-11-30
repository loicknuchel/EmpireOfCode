var Geo = (function(){
  return {
    isInCircle: isInCircle,
    forEachInCircle: forEachInCircle
  };

  function isInCircle(centerX, centerY, radius, pointX, pointY){
    var x = centerX-pointX, y = centerY-pointY;
    var d = Math.sqrt((x*x)+(y*y));
    return d <= radius;
  }
  function forEachInCircle(centerX, centerY, radius, iteratee){
    for(var i=centerX-radius; i<centerX+radius; i++){
      for(var j=centerY-radius; j<centerY+radius; j++){
        if(isInCircle(centerX, centerY, radius, i, j)){
          iteratee(i, j);
        }
      }
    }
  }
})();

var Matrix = function(rows, cols){
  var data = init(rows, cols);
  this.data = data;

  this.map = function(f){
    return _.map(data, f);
  };
  this.filter = function(f){
    return _.filter(data, f);
  };
  this.toString = function(){
    console.log('Matrix', data);
  };

  function init(rows, cols){
    var data = [];
    for(var i=0; i<rows; i++){
      for(var j=0; j<cols; j++){
        data.push({
          x: i,
          y: j
        });
      }
    }
    return data;
  }
};

var Utils = (function(){
  return {
  };
})();

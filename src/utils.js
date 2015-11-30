var Geo = (function(){
  return {
    isInCircle: isInCircle
  };

  function isInCircle(centerX, centerY, radius, pointX, pointY){
    var x = centerX-pointX, y = centerY-pointY;
    var d = Math.sqrt((x*x)+(y*y));
    return d <= radius;
  }
})();

var Utils = (function(){
  return {
  };
})();

function Geo(){
  this.distance = distance;
  this.isInCircle = isInCircle;
  this.forEachInCircle = forEachInCircle;
  this.getNearest = getNearest;

  function distance(coord1, coord2){
    var x = coord1[0]-coord2[0], y = coord1[1]-coord2[1];
    return Math.sqrt((x*x)+(y*y));
  }
  function isInCircle(centerCoord, radius, pointCoord){
    return distance(centerCoord, pointCoord) <= radius;
  }
  function forEachInCircle(centerCoord, radius, iteratee){
    for(var i=centerCoord[0]-radius; i<centerCoord[0]+radius; i++){
      for(var j=centerCoord[1]-radius; j<centerCoord[1]+radius; j++){
        if(isInCircle(centerCoord, radius, [i, j])){
          iteratee([i, j]);
        }
      }
    }
  }
  function getNearest(coords, items){
    var nearest = null;
    var nearestDistance = null;
    for(var i=0; i<items.length; i++){
      var itemDistance = distance(coords, items[i].coordinates);
      if(nearestDistance === null || itemDistance < nearestDistance){
        nearest = items[i];
        nearestDistance = itemDistance;
      }
    }
    return nearest;
  }
}

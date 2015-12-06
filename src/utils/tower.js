function Tower(){
  this.isRocketGun = isRocketGun;
  this.isMachineGun = isMachineGun;
  this.isSentryGun = isSentryGun;
  this.getNearest = getNearest;
  var geo = new Geo();

  function isRocketGun(item){
    return item && item.role === 'tower' && item.firing_range === 15;
  }
  function isMachineGun(item){
    return item && item.role === 'tower' && item.firing_range === 5;
  }
  function isSentryGun(item){
    return item && item.role === 'tower' && item.firing_range === 12;
  }
  function getNearest(coords, items){
    var nearest = null;
    var nearestDistance = null;
    for(var i=0; i<items.length; i++){
      var itemDistance = geo.distance(coords, items[i].coordinates);
      if(nearestDistance === null || itemDistance < nearestDistance){
        nearest = items[i];
        nearestDistance = itemDistance;
      }
    }
    return nearest;
  }
}

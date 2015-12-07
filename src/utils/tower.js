function Tower(){
  this.isRocketGun = isRocketGun;
  this.isMachineGun = isMachineGun;
  this.isSentryGun = isSentryGun;
  this.canFire = canFire;
  var GeoUtils = new Geo();

  function isRocketGun(item){
    return item && item.role === 'tower' && item.firing_range === 15;
  }
  function isMachineGun(item){
    return item && item.role === 'tower' && item.firing_range === 5;
  }
  function isSentryGun(item){
    return item && item.role === 'tower' && item.firing_range === 12;
  }
  function canFire(item, coords){
    return GeoUtils.distance(item.coordinates, coords) < item.firing_range+0.5;
  }
}

function Game(client){
  this.groupUnits = groupUnits;
  this.getTowers = getTowers;
  this.hasRocketGun = hasRocketGun;
  var geo = new Geo();

  function groupUnits(coord){
    client.doMove(coord);
    return client.whenIdle().then(function(){
      return waitIn(coord, 1);
    });
    function waitIn(coord, radius){
      return client.whenItemInArea(coord, radius).then(function(){
        if(!isAllUnitsIn(coord, radius)){
          return waitIn(coord, radius);
        }
      });
    }
    function isAllUnitsIn(coord, radius){
      var units = client.askUnits();
      for(var i in units){
        if(!geo.isInCircle(coord, radius, units[i].coordinates)){
          return false;
        }
      }
      return true;
    }
  }
  function getTowers(){
    return _.map(_.filter(client.askTowers(), {is_dead: false}), function(tower){
      if(TowerUtils.isSentryGun(tower)){ tower.type = 'sentry'; }
      if(TowerUtils.isMachineGun(tower)){ tower.type = 'machine'; }
      if(TowerUtils.isRocketGun(tower)){ tower.type = 'rocket'; }
      return tower;
    });
  }
  function hasRocketGun(towers){
    return _.filter(towers, {type: 'rocket'}).length > 0;
  }
}

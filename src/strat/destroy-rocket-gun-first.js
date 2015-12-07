"use strict";
var _ = require("underscore");
var Client = require("battle/commander.js").Client;
var client = new Client();

var GeoUtils = new Geo();
var TowerUtils = new Tower();
var UnitUtils = new Unit(client);
var GameUtils = new Game(client);

var me = client.askMyInfo();
var side = me.coordinates[1] > 20 ? 40 : 0;
var dir = me.coordinates[1] > 20 ? -1 : 1;
UnitUtils.moveTo([/*[40, side], [20, side], [20, side+(10*dir)]*/]).then(function(){
  var towers = GameUtils.getTowers();
  if(GameUtils.hasRocketGun(towers)){
    attackNext();
  } else {
    GameUtils.groupUnits([40, 20]).then(function(){
      attackNext();
    });
  }
});

function attackNext(){
  var me = client.askMyInfo();
  var towers = GameUtils.getTowers();
  var target = client.askCenter();
  if(GameUtils.hasRocketGun(towers)){
    target = GeoUtils.getNearest(me.coordinates, _.filter(towers, {type: 'rocket'}));
  } else if(towers.length > 0){
    target = GeoUtils.getNearest(me.coordinates, towers);
  }
  /*var shootingPlace = bestShootingPlace(target, towers, me.firing_range, me.coordinates);
  client.doMove(shootingPlace.coordinates);
  client.whenIdle().then(function(){
    client.doAttack(target.id);
    client.whenItemDestroyed(target.id).then(attackNext);
  });*/
  client.doAttack(target.id);
  client.whenItemDestroyed(target.id).then(attackNext);
}
function bestShootingPlace(item, towers, firing_range, start_coordinates){
  var leastDps = null;
  var placesWithLessDps = null;
  GeoUtils.forEachInCircle(item.coordinates, firing_range, function(coords){
    var placeDps = _.reduce(towers, function(cpt, tower){
      return cpt + (TowerUtils.canFire(tower, coords) ? tower.dps : 0);
    }, 0);
    if(leastDps === null || placeDps < leastDps){
      leastDps = placeDps;
      placesWithLessDps = [{coordinates: coords}];
    } else if(placeDps === leastDps){
      placesWithLessDps.push({coordinates: coords});
    }
  });
  return GeoUtils.getNearest(start_coordinates, placesWithLessDps);
}

/* Utils */

function Game(client){
  this.groupUnits = groupUnits;
  this.getTowers = getTowers;
  this.hasRocketGun = hasRocketGun;
  var GameUtils = new Geo();

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
        if(!GameUtils.isInCircle(coord, radius, units[i].coordinates)){
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
      tower.dps = dps(tower);
      return tower;
    });
  }
  function hasRocketGun(towers){
    return _.filter(towers, {type: 'rocket'}).length > 0;
  }
  function dps(item){
    return item.damage_per_shot / item.rate_of_fire;
  }
}

function Unit(client){
  this.moveTo = moveTo;

  function moveTo(coordList){
    if(!coordList || coordList.length === 0){
      return client.whenIdle();
    } else {
      var head = coordList[0];
      var tail = coordList.slice(1);
      client.doMove(head);
      return client.whenIdle().then(function(){
        return moveTo(tail);
      });
    }
  }
}

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

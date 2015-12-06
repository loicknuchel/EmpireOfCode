"use strict";
var _ = require("underscore");
var Client = require("battle/commander.js").Client;
var client = new Client();


var GeoUtils = new Geo();
var TowerUtils = new Tower();
var GameUtils = new Game(client);

var towers = GameUtils.getTowers();
if(GameUtils.hasRocketGun(towers)){
  attackNext();
} else {
  GameUtils.groupUnits([40, 20]).then(function(){
    attackNext();
  });
}

function attackNext(){
  var me = client.askMyInfo();
  var towers = GameUtils.getTowers();
  var target = client.askCenter();
  if(GameUtils.hasRocketGun(towers)){
    target = TowerUtils.getNearest(me.coordinates, _.filter(towers, {type: 'rocket'}));
  } else if(towers.length > 0){
    target = TowerUtils.getNearest(me.coordinates, towers);
  }
  client.doAttack(target.id);
  client.whenItemDestroyed(target.id).then(attackNext);
}

/* Utils */

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

function Geo(){
  this.distance = distance;
  this.isInCircle = isInCircle;
  this.forEachInCircle = forEachInCircle;

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
}

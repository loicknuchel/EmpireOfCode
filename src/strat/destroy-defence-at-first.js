"use strict";
var _ = require("underscore");
var Client = require("battle/commander.js").Client;
var client = new Client();

var geo = new Geo();
var game = new Game(client);

function attackNext(){
  var me = client.askMyInfo();
  var target = client.askCenter();
  var towers = _.filter(client.askTowers(), {is_dead: false});

  if(towers.length){
    target = getNearest(me.coordinates, towers);
  }
  client.doAttack(target.id);
  client.whenItemDestroyed(target.id).then(attackNext);
}

game.groupUnits([40, 20]).then(function(){
  attackNext();
});

function getNearest(coords, items){
  var nearest = null;
  var distance = null;
  for(var i=0; i<items.length; i++){
    var itemDistance = geo.distance(coords, items[i].coordinates);
    if(distance === null || distance > itemDistance){
      nearest = items[i];
      distance = itemDistance;
    }
  }
  return nearest;
}

/* Utils */

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

function Game(client){
  this.groupUnits = groupUnits;
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
}

"use strict";
var _ = require("underscore");
var Client = require("battle/commander.js").Client;
var client = new Client();

var geo = new Geo();

var Command = {
  MOVE: 'MOVE',
  ATTACK: 'ATTACK'
};
var Target = {
  TOWER: 'TOWER',
  CENTER: 'CENTER'
};
var actions = [
  {command: Command.MOVE, coords: [40, 0]},
  {command: Command.MOVE, coords: [20, 0]},
  {command: Command.ATTACK, target: Target.CENTER}
];
execAll(actions);

function execAll(actions){
  if(actions.length > 0){
    var head = actions[0];
    var tail = actions.slice(1);
    exec(head).then(function(){
      execAll(tail);
    });
  } else {
    console.log('ERROR: no more actions... :(');
  }
}

function exec(action){
  if(action.command === Command.MOVE){
    client.doMove(action.coords);
  } else if(action.command === Command.ATTACK){
    var target = client.askCenter();
    if(action.target === Target.TOWER){
      var towers = _.filter(client.askTowers(), {is_dead: false});
      if(towers.length > 0){
        var me = client.askMyInfo();
        target = getNearest(me.coordinates, towers);
      }
    }
    client.doAttack(target.id);
  } else {
    console.log('ERROR: unknown command', action);
  }
  return client.whenIdle();
}

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

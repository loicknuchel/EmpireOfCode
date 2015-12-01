"use strict";
var _ = require("underscore");
var Client = require("battle/commander.js").Client;
var client = new Client();
var geo = new Geo();

// TODO sync troupes...
var me = client.askMyInfo();
console.log('me', me);
var center = client.askCenter();
console.log('center', center);
var towers = client.askTowers();
console.log('towers', towers);
var lastCoordinates = safestPlace(center.coordinates, me.firing_range, towers);
console.log('lastCoordinates', lastCoordinates);
var shootingTowers = getShootingTowers(lastCoordinates, towers);
var targets = sortItemsByDistance(lastCoordinates, shootingTowers).reverse();
targets.push(center);
var targetsWithPlace = _.map(targets, function(target){
    return {
        coordinates: safestPlace(target.coordinates, me.firing_range, towers),
        item: target
    };
});
console.log('targets', targetsWithPlace);
attack(targetsWithPlace);


// return the safer place (less shooting towers) within the circle (area)
function safestPlace(coordinates, range, towers){
    // IMPROVE : choose towers with less power...
    var minFiringTowers = towers.length+1;
    var bestPlaces = [];
    geo.forEachInCircle(coordinates, range, function(coord){
        var firingTowers = _.filter(towers, function(tower){
            return geo.isInCircle(tower.coordinates, tower.firing_range, coord);
        });
        if(firingTowers.length < minFiringTowers){
            minFiringTowers = firingTowers.length;
            bestPlaces = [coord];
        } else if(firingTowers.length === minFiringTowers){
            bestPlaces.push(coord);
        }
    });
    return bestPlaces[0];
}

// return towers shooting at the coordinates
function getShootingTowers(coordinates, towers){
    return _.filter(towers, function(tower){
        return geo.isInCircle(tower.coordinates, tower.firing_range, coordinates);
    });
}

// sort items by distance to coordinates
function sortItemsByDistance(coordinates, items){
    return _.sortBy(items, function(item){
        return geo.distance(coordinates, item.coordinates);
    });
}

// sequentially attack all targets
function attack(targets){
    if(targets.length > 0){
        var head = targets[0];
        var tail = targets.slice(1);
        console.log('attack', head);
        /*client.doMove(head.coordinates);
        client.whenIdle().then(function(){
            client.doAttack(head.item.id);
            return client.whenIdle();
        }).then(function(){
            attack(tail);
        });*/
        client.doAttack(head.item.id);
        client.whenIdle().then(function(){
            attack(tail);
        });
    } else {
        console.log('NO MORE TARGETS !');
    }
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
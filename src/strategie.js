"use strict";
var _ = require("underscore");
var Client = require("battle/commander.js").Client;
var client = new Client();

var Geo = (function(){
  return {
    distance: distance,
    isInCircle: isInCircle,
    forEachInCircle: forEachInCircle
  };

  function distance(x1, y1, x2, y2){
    var x = x1-x2, y = y1-y2;
    return Math.sqrt((x*x)+(y*y));
  }
  function isInCircle(centerX, centerY, radius, pointX, pointY){
    return distance(centerX, centerY, pointX, pointY) <= radius;
  }
  function forEachInCircle(centerX, centerY, radius, iteratee){
    for(var i=centerX-radius; i<centerX+radius; i++){
      for(var j=centerY-radius; j<centerY+radius; j++){
        if(isInCircle(centerX, centerY, radius, i, j)){
          iteratee(i, j);
        }
      }
    }
  }
})();

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
    Geo.forEachInCircle(coordinates[0], coordinates[1], range, function(x, y){
        var firingTowers = _.filter(towers, function(tower){
            return Geo.isInCircle(tower.coordinates[0], tower.coordinates[1], tower.firing_range, x, y);
        });
        if(firingTowers.length < minFiringTowers){
            minFiringTowers = firingTowers.length;
            bestPlaces = [[x, y]];
        } else if(firingTowers.length === minFiringTowers){
            bestPlaces.push([x, y]);
        }
    });
    return bestPlaces[0];
}

// return towers shooting at the coordinates
function getShootingTowers(coordinates, towers){
    return _.filter(towers, function(tower){
        return Geo.isInCircle(tower.coordinates[0], tower.coordinates[1], tower.firing_range, coordinates[0], coordinates[1]);
    });
}

// sort items by distance to coordinates
function sortItemsByDistance(coordinates, items){
    return _.sortBy(items, function(item){
        return Geo.distance(coordinates[0], coordinates[1], item.coordinates[0], item.coordinates[1]);
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

"use strict";
var _ = require("underscore");
var Client = require("battle/commander.js").Client;
var client = new Client();

function attackNext() {
    var towers = client.askTowers(),
        enemy;
    console.log('towers', towers);
    if (towers.length) {
        enemy = towers[0];
    } else {
        enemy = client.askCenter();
    }
    console.log('enemy', enemy);
    client.doAttack(enemy.id);
    client.whenItemDestroyed(enemy.id).then(attackNext);
}

attackNext();

console.log('inCircle: ', Utils.Geo.isInCircle(0, 0, 5, 0, 4));
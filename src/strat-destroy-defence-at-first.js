"use strict";
var Client = require("battle/commander.js").Client;
var client = new Client();

function attackNext() {
    var data = client.askTowers(),
        enemy;
    if (data.length) {
        enemy = data[0];
    } else {
        enemy = client.askCenter();
    }
    client.doAttack(enemy.id);
    client.whenItemDestroyed(enemy.id).then(attackNext);
}

attackNext();

"use strict";
var Client = require("battle/commander.js").Client;
var client = new Client();

var center = client.askCenter();
client.doAttack(center.id);
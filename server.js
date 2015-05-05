#!/bin/env node
var WebSocketServer = require('ws').Server;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
//var io = require('socket.io')(server);

var sfs = require('./sfs/game');
var cards = require('./sfs/combinators');

var game = null;
var serverPort = process.env.PORT || 5000;
app.use(express.static(__dirname + "/public"));

server.listen(serverPort, function() {
    game = new sfs.Game();
    cards.Initialize(sfs);
    console.log('listening on *:' + serverPort);
});

var wss = new WebSocketServer({server: server});

wss.on('connection', function(socket){
    // create new player and add it to the list
    var player = game.ConnectPlayer(socket);
    
    socket.on('close', function() {
        game.DisconnectPlayer(player);
    });
    
    socket.on('message', function(event, flags) {
        var packet = JSON.parse(event);
        switch (packet.type) {
            case 'set name':
                player.name = packet.data.name;
                break;
            case 'random deck':
                player.NewRandomDeck();
                break;
            case 'new deck':
                player.NewDeck(packet.data.name);
                break;
            case 'delete deck':
                player.DeleteDeck(packet.data.index);
                break;
            case 'choose avatar':
                console.log('Avatar ' + packet.data + ' chosen for ' + player.name);
                game.EnqueuePlayer(player, packet.data, 0);
                break;
            case 'end turn':
                player.match.EndTurn();
                break;
            case 'play card on ally':
                player.avatar.PlayCard(packet.data, true);
                break;
            case 'play card on enemy':
                player.avatar.PlayCard(packet.data, false);
                break;
            case 'character power':
                player.avatar.CharacterPower();
                break;
            case 'attack automaton':
                player.avatar.AttackEnemyAutomaton(packet.attacking, packet.target);
                break;
            case 'attack hero':
                player.avatar.AttackCharacter(packet.attacking);
                break;
            default:
                console.log('Unknown server event received: ' + packet.type);
        }
    });
});

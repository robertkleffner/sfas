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
            default:
                console.log('Unknown server event received: ' + packet.type);
        }
    });
});

/*
wss.on('set name', function(data) {
    player.name = data.name;
});

wss.on('random deck', function() {
    player.NewRandomDeck();
});

wss.on('new deck', function(data) {
    player.NewDeck(data.name);
});

wss.on('delete deck', function(data) {
    player.DeleteDeck(data.index);
});

wss.on('choose avatar', function(avatarId) {
    console.log('Avatar ' + avatarId + ' chosen for ' + player.name);
    game.EnqueuePlayer(player, avatarId, 0);
});

wss.on('end turn', function() {
    player.match.EndTurn();
});

wss.on('play card on ally', function(cardIndex) {
    player.avatar.PlayCard(cardIndex, true);
});

wss.on('play card on enemy', function(cardIndex) {
    player.avatar.PlayCard(cardIndex, false);
});

wss.on('character power', function() {
    player.avatar.CharacterPower();
});
*/

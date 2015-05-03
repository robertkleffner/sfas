#!/bin/env node
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var sfs = require('./sfs/game');
var cards = require('./sfs/combinators');

var game = null;
var serverPort = 8080;
app.use(express.static(__dirname + "/public"));

io.on('connection', function(socket){
    // create new player and add it to the list
    var player = game.ConnectPlayer(socket);

    socket.on('disconnect', function() {
        game.DisconnectPlayer(player);
    });

    socket.on('set name', function(data) {
        player.name = data.name;
    });

    socket.on('random deck', function() {
        player.NewRandomDeck();
    });

    socket.on('new deck', function(data) {
        player.NewDeck(data.name);
    });

    socket.on('delete deck', function(data) {
        player.DeleteDeck(data.index);
    });

    socket.on('choose avatar', function(avatarId) {
        console.log('Avatar ' + avatarId + ' chosen for ' + player.name);
        game.EnqueuePlayer(player, avatarId, 0);
    });
    
    socket.on('end turn', function() {
        player.match.EndTurn();
    });
    
    socket.on('play card on ally', function(cardIndex) {
        player.avatar.PlayCard(cardIndex, true);
    });
    
    socket.on('play card on enemy', function(cardIndex) {
        player.avatar.PlayCard(cardIndex, false);
    });
    
    socket.on('character power', function() {
        player.avatar.CharacterPower();
    });
});

server.listen(serverPort, function() {
    game = new sfs.Game();
    cards.Initialize(sfs);
    console.log('listening on *:' + serverPort);
});

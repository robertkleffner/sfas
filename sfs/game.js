var utils = require('./utils');
var cards = require('./combinators');

module.exports = {

// This class manages player connections and match making.
Game: function() {
    this.players = [];
    this.matches = [];
    this.uniqueId = 1;
    this.queue = [];

    this.ConnectPlayer = function(socket) {
        var player = new sfs.Player(this.uniqueId++, socket);
        this.players.push(player);
        console.log('A new player [' + player.id + '] connected.');
        return player;
    };

    this.DisconnectPlayer = function(player) {
        if (player.InMatch()) {
            // TODO: if the player is in a match, dismantle it properly
        }

        // remove player from player list
        this.players.splice(player.id, 1);
        console.log('Player ' + player.id + ' disconnected.');
    };

    this.EnqueuePlayer = function(player, avatarId, deckId) {
        // TODO: if we get deck building done, this will need to be removed
        // just give each player a random deck for now
        console.log('Generating random deck for ' + player.name + '...');
        player.NewRandomDeck();
        console.log('Random deck generated.');

        player.avatar = new sfs.Avatar(player.decks[deckId].Copy(), avatarId);
        console.log(player.name + ' has avatar with id ' + player.avatar.character);

        // terrible matchmaking algorithm: as soon as two players
        // have connected and selected an avatar, pair them in a match
        if (this.queue.length > 0) {
            var match = new sfs.Match();
            match.AssignPlayer(player);
            match.AssignPlayer(this.queue.shift());
            this.matches.push(match);
            match.StartMatch();
        } else {
            console.log(player.name + ' joined the matchmaking queue.');
            this.queue.push(player);
        }
    };
},

// This class represents an individual match between two people.
Match: function() {
    this.firstPlayer = null;
    this.secondPlayer = null;

    this.StartMatch = function() {
        this.firstPlayer.match = this;
        this.secondPlayer.match = this;

        console.log('Match started between ' + this.firstPlayer.name + ' and ' + this.secondPlayer.name);

        console.log('Shuffling decks...');
        this.firstPlayer.avatar.deck.Shuffle();
        this.secondPlayer.avatar.deck.Shuffle();

        console.log('Drawing starting hand...');
        this.firstPlayer.avatar.DrawCard().DrawCard().DrawCard();
        this.secondPlayer.avatar.DrawCard().DrawCard().DrawCard().DrawCard();
        this.secondPlayer.avatar.hand.push(cards.TheGear);

        console.log(this.firstPlayer.name + ' starting hand: ');
        console.log(this.firstPlayer.avatar.hand);
        console.log(this.secondPlayer.name + ' starting hand: ');
        console.log(this.secondPlayer.avatar.hand);
    };

    this.AssignPlayer = function(player) {
        // If one position has already been assigned, fill the other
        if (this.firstPlayer != null) {
            this.secondPlayer = player;
        } else if (this.secondPlayer != null) {
            this.firstPlayer = player;
        } else {
            // otherwise, we choose one of the positions randomly
            var first = Math.random();
            if (first < 0.5) {
                this.firstPlayer = player;
            } else {
                this.secondPlayer = player;
            }
        }
    };
},

// This class represents the player's global game information
// This information is persisted between matches, but not
// really used during a match.
Player: function(id, socket) {
    this.decks = [];
    this.avatar = null;
    this.match = null;
    this.name = 'Player ' + id;
    this.id = id;
    this.socket = socket;

    // Create a new deck populated with 30 random cards
    this.NewRandomDeck = function() {
        if (this.decks.length >= utils.MAXIMUM_DECKS) { return null; }
        this.NewDeck({ name: 'Random Deck' + this.decks.length }).FillWithRandom();
    };

    // Create a new empty deck with the given name
    // Format @data: { name }
    this.NewDeck = function(name) {
        if (this.decks.length >= utils.MAXIMUM_DECKS) { return null; }

        var deck = new sfs.Deck(name);
        this.decks.push(deck);
        return deck;
    };

    // Removes the deck at the specified index from the player's list of decks.
    // Format @index: starts at 0
    this.DeleteDeck = function(index) {
        if (index >= this.decks.length) { return; }
        this.decks.splice(index, 1);
    }

    this.InMatch = function() { return this.avatar != null; }
},

// This class represents the player's match information
// Storing deck played, hand info, character health and type, etc.
Avatar: function(deck, character) {
    this.deck = deck;
    this.hand = [];
    this.health = utils.MAXIMUM_AVATAR_HEALTH;
    this.character = character;
    this.activeGears = 1;
    this.maxGears = 1;
    this.opponent = null;
    this.line = new sfs.Line();
    this.fatigue = 1;

    // Used at the end of each turn to give each player another gear,
    // up to MAXIMUM_GEARS.
    this.IncrementMaxGears = function() {
        if (this.maxGears >= utils.MAXIMUM_GEARS) { return; }
        this.maxGears += 1;
    };

    // Used to give a player a number of extra gears, like when playing
    // The Gear (combinator)
    this.AddGears = function(amount) {
        this.activeGears += amount;
        if (this.activeGears >= utils.MAXIMUM_GEARS) {
            this.activeGears = utils.MAXIMUM_GEARS;
        }
        return this;
    };

    this.AddHealth = function(amount) {
        this.health += amount;
        if (this.health >= utils.MAXIMUM_AVATAR_HEALTH) {
            this.health = utils.MAXIMUM_AVATAR_HEALTH;
        }
        return this;
    };

    this.DrawCard = function() {
        if (this.deck.length < 1) {
            // fatigue mechanic: after a player runs out of cards, every time they
            // draw they take this.fatigue amount of damage, which increases by 1
            // each draw
            this.health -= this.fatigue;
            this.fatigue += 1;
        } else if (this.hand.length >= utils.MAXIMUM_CARDS_IN_HAND) {
            this.deck.cards.pop();
        } else {
            this.hand.push(this.deck.cards.pop());
        }
        return this;
    };
},

// This class represents an automaton on the player's
// automaton line. Automatons are recursive and gain energy and
// durability by merging with other automatons.
Automaton: function(submatons) {
    this.submatons = submatons || [];
    this.durability = 1;
    this.energy = 1;
    this.canAttack = false;

    // Energy = sum(subs.energy) + 1
    // Durability = sum(subs.durability) + 1
    for (var i = 0; i < this.submatons.length; i++) {
        this.durability += this.submatons[i].durability;
        this.energy += this.submatons[i].energy;
    }

    // Does a recursive deep copy of this automaton.
    this.Copy = function() {
        var subs = [];
        for (var i = 0; i < this.submatons.length; i++) {
            subs.push(this.submatons[i].Copy());
        }
        return new sfs.Automaton(subs);
    }
},

// This class represents the automaton front line
Line: function() {
    this.automatons = [];

    this.Push = function(auto) {
        // NOTE: this simple if-statement is actually a huge mechanic!
        // it means that left-most automatons can be destroyed if played
        // if there's already too many automatons on the line
        if (this.automatons.length < utils.MAXIMUM_LIVE_AUTOMATONS) {
            auto.canAttack = true;
            this.automatons.unshift(auto);
        }
    };

    this.Pop = function() { return this.automatons.shift(); };

    this.Clear = function() { this.automatons = []; };

    this.Length = function() { return this.automatons.length; }
},

// This class represents a constructed deck.
Deck: function(name) {
    this.name = name || "";
    this.cards = [];

    // Populates the remaining open slots in a deck with random cards.
    this.FillWithRandom = function() {
        // this guarantees at least 30 cards will be picked and allows
        // possible duplicates
        var remaining = cards.All.concat(cards.All);
        while (this.cards.length < utils.MAXIMUM_CARDS_IN_DECK) {
            // choose a random card from the list of remaining cards
            // if two copies of it are already in, it won't be added
            this.AddCard(remaining[utils.RandomBetween(0,remaining.length-1)]);
        }
        console.log(this.cards);
        return this;
    };

    // Adds a card to the deck, if there are fewer than two copies of it
    // in the deck currently. Otherwise fails.
    this.AddCard = function(card) {
        if (this.ContainsTwo(card)) { return false; }
        this.cards.push(card);
        return true;
    };

    // Checks to see if the deck already contains two of the specified card.
    this.ContainsTwo = function(card) {
        var count = 0;
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].name == card.name) { count += 1; }
        }
        return count >= 2;
    };

    // Shuffles the deck
    this.Shuffle = function() {
        utils.Shuffle(this.cards);
    };

    this.Copy = function() {
        var nueva = new sfs.Deck(this.name);
        nueva.cards = this.cards.splice(0);
        return nueva;
    };
},

}

var sfs = module.exports;
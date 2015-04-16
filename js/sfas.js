var sfas = {

// This class manages player connections and match making.
Game: function() {
    this.players = [];
    this.match = null;

    this.Initialize = function() {
        this.match = new sfas.Match();
    };

    this.ConnectPlayer = function(name) {
        var player = new sfas.Player(this.players.length, name);

        // for now just give each player a random deck
        player.NewRandomDeck().Shuffle();

        this.players.push(player);
        console.log('A new player "' + player.name + '"-[' + player.id + '] connected.');

        this.match.AssignPlayer(player);
        return player;
    };
},

// This class represents an individual match between two people.
Match: function() {
    this.firstPlayer = null;
    this.secondPlayer = null;

    this.StartMatch = function() {
        console.log('Match started - Player "' + this.firstPlayer.name + '" chosen to go first.');
    };

    this.AssignPlayer = function(player, deckIndex, character) {
        // If one position has already been assigned, fill the other
        if (this.firstPlayer != null) {
            this.secondPlayer = player;
        } else if (this.secondPlayer != null) {
            this.firstPlayer = player;
        } else {
            // otherwise, we choose one of the positions randomly
            var first = utils.RandomBetween(1, 10);
            if (first < 5) {
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
Player: function(id, name) {
    this.decks = [];
    this.avatar = null;
    this.match = null;
    this.name = name;
    this.id = id;

    // Create a new deck populated with 30 random cards
    this.NewRandomDeck = function() {
        if (this.decks.length >= utils.MAXIMUM_DECKS) { return null; }
        var deck = this.NewDeck({ name: 'Random Deck' + this.decks.length }).FillWithRandom();
        console.log(this.decks[this.decks.length-1]);
        return deck;
    };

    // Create a new empty deck with the given name
    // Format @data: { name }
    this.NewDeck = function(name) {
        if (this.decks.length >= utils.MAXIMUM_DECKS) { return null; }

        var deck = new sfas.Deck(name);
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
    this.gears = 1;
    this.maxGears = 1;
    this.opponent = null;
    this.line = new sfas.Line();

    // Used at the end of each turn to give each player another gear,
    // up to MAXIMUM_GEARS.
    this.IncrementMaxGears = function() {
        if (this.maxGears >= utils.MAXIMUM_GEARS) { return; }
        this.maxGears += 1;
    };

    this.AddHealth = function(amount) {
        this.health += amount;
        if (this.health >= utils.MAXIMUM_AVATAR_HEALTH) {
            this.health = utils.MAXIMUM_AVATAR_HEALTH;
        }
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
        return new sfas.Automaton(subs);
    }
},

// This class represents the automaton front line
Line: function() {
    this.automatons = [];

    this.Push = function(auto) {
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
},

};

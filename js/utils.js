var utils = {
    MAXIMUM_CARDS_IN_DECK: 30,
    MAXIMUM_DECKS: 9,
    MAXIMUM_GEARS: 10,
    MAXIMUM_LIVE_AUTOMATONS: 7,
    MAXIMUM_AVATAR_HEALTH: 30,

    BABBOCK: 0,
    DE_BORG: 1,
    VAN_NEWMAN: 2,
    MCCREARY: 3,

    RandomBetween: function(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    },

    // Knuth-Fisher-Yeates shuffle algorithm applied to JS array
    Shuffle: function(array) {
      var m = array.length, t, i;

      // While there remain elements to shuffle…
      while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }

      return array;
    }
};

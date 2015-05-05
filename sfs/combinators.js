var sfas = null;

module.exports = {

// Each combinator has a play function of type (Match, Avatar, Avatar) -> Boolean
// The boolean return value says whether the play was successful or not.
// If the play was successful, the game moves on. If not, the owner is notified
// and they will have to choose another combinator. All combinators that only
// require one automaton on the line will always succeed.

// These top eight are the basic combinators.

// [A] -> A
Separate: {
    name: "Separate",
    cost: 1,
    description: '[A] -> A',
    image: 'separate',
    Play: function(match, owner, target) {
        if (target.line.Length() < 1) { return false; }
        var auto = target.line.Pop();
        for (var i = 0; i < auto.submatons.length; i++) {
            target.line.Push(auto.submatons[i]);
        }
        return true;
    }
},

// [A] -> [A] [A]
Duplicate: {
    name: "Duplicate",
    cost: 2,
    description: 'Deep copy of first element on the stack',
    image: 'duplicate',
    Play: function(match, owner, target) {
        if (target.line.Length() < 1) { return false; }
        var auto = target.line.Pop();
        target.line.Push(auto.Copy());
        target.line.Push(auto);
        return true;
    }
},

// [B] [A] -> [A] [B]
Swap: {
    name: "Swap",
    cost: 1,
    description: 'Swap the first two items in the stack',
    image: 'swap',
    Play: function(match, owner, target) {
        if (target.line.Length() < 2) { return false; }
        var auto1 = target.line.Pop();
        var auto2 = target.line.Pop();
        target.line.Push(auto1);
        target.line.Push(auto2);
        return true;
    }
},

// [B] [A] -> B [A]
Subvert: {
    name: "Subvert",
    cost: 2,
    description: 'Debuffs or eliminates second element',
    image: 'subvert',
    Play: function(match, owner, target) {
        if (target.line.Length() < 2) { return false; }
        var auto1 = target.line.Pop();
        var auto2 = target.line.Pop();
        for (var i = 0; i < auto1.submatons.length; i++) {
            target.line.Push(auto2.submatons[i]);
        }
        target.line.Push(auto1);
        return true;
    }
},

// [B] [A] -> [B A]
Combine: {
    name: "Combine",
    cost: 3,
    description: '[B] [A] -> [B A]',
    image: 'combine',
    Play: function(match, owner, target) {
        if (target.line.Length() < 2) { return false; }
        var auto1 = target.line.Pop();
        var auto2 = target.line.Pop();
        target.line.Push(new sfas.Automaton(auto2.submatons.concat(auto1.submatons)));
        return true;
    }
},

// [A] -> [[A]]
Shield: {
    name: 'Shield',
    cost: 1,
    description: 'Add a (1, 1) buff to the minion on the top of the stack',
    image: 'shield',
    Play: function(match, owner, target) {
        if (target.line.Length() < 1) { return false; }
        var auto1 = target.line.Pop();
        target.line.Push(new sfas.Automaton([auto1]));
        return true;
    }
},

// [A] ->
Zap: {
    name: 'Zap',
    cost: 2,
    description: 'Kill the minion on the top of the stack',
    image: 'zap',
    Play: function(match, owner, target) {
        if (target.line.Length() < 1) { return false; }
        target.line.Pop();
        return true;
    }
},

// [B] [A] -> [[B] A]
Prepend: {
    name: 'Prepend',
    cost: 2,
    description: '[B] [A] -> [[B] A]',
    image: 'prepend',
    Play: function(match, owner, target) {
        if (target.line.Length() < 2) {return false;}
        var auto1 = target.line.Pop();
        var auto2 = target.line.Pop();
        target.line.Push(new sfas.Automaton([auto2].concat(auto1.submatons)));
        return true;
    }
},

// All the rest of the combinators here

// -> [A]
Spawn: {
    name: 'Spawn',
    cost: 1,
    description: 'Create a (1, 1) minion',
    image: 'minion',
    Play: function(match, owner, target) {
        target.line.Push(new sfas.Automaton());
        return true;
    }
},

// [A] -> A A
Repetition: {
    name: 'Repetition',
    cost: 2,
    description: '[A] -> A A',
    image: 'repetition',
    Play: function(match, owner, target) {
        if (target.line.Length() < 1) { return false; }
        var auto1 = target.line.Pop();
        for (var i = 0; i < auto1.submatons.length; i++) {
            target.line.Push(auto1.submatons[i]);
        }
        for (var i = 0; i < auto1.submatons.length; i++) {
            target.line.Push(auto1.submatons[i].Copy());
        }
        return true;
    }
},

// [A] -> A [A]
Reincarnate: {
    name: 'Reincarnate',
    cost: 3,
    description: '[A] -> A [A]',
    image: 'reincarnate',
    //Todo: something here can attack
    Play: function(match, owner, target) {
        if (target.line.Length() < 1) { return false; }
        var auto1 = target.line.Pop();
        for (var i = 0; i < auto1.submatons.length; i++) {
            target.line.Push(auto1.submatons[i]);
        }
        target.line.Push(auto1);
        return true;
    }
},


// [A] ->    & +5 health to ally hero
Consume: {
    name: 'Consume',
    cost: 4,
    description: 'Destroys top item adding 5 health to ally hero',
    image: 'consume',
    Play: function(match, owner, target) {
        if (target.line.Length() < 1) { return false; }
        target.line.Pop();
        owner.ChangeHealth(5);
        return true;
    }
},

// [B] [A] ->    & +10 health to ally hero
Chomp: {
    name: 'Chomp',
    cost: 8,
    description: 'Destroy top two minions adding 10 health to ally',
    image: 'chomp',
    Play: function(match, owner, target) {
        if (target.line.Length() < 2) { return false; }
        target.line.Pop();
        target.line.Pop();
        owner.ChangeHealth(10);
        return true;
    }
},

// [B] [A] -> A
Kappa: {
    name: 'Kappa',
    cost: 3,
    description: '[B] [A] -> A',
    image: 'kappa',
    Play: function(match, owner, target) {
        if (target.line.Length() < 2) { return false; }
        var auto = target.line.Pop();
        target.line.Pop();
        for (var i = 0; i < auto.submatons.length; i++) {
            target.line.Push(auto.submatons[i]);
        }
        return true;
    }
},

// [B] [A] -> B
Hoist: {
    name: 'Hoist',
    cost: 2,
    description: '[B] [A] -> B',
    image: 'hoist',
    Play: function(match, owner, target) {
        if (target.line.Length() < 2) { return false; }
        target.line.Pop();
        var auto = target.line.Pop();
        for (var i = 0; i < auto.submatons.length; i++) {
            target.line.Push(auto.submatons[i]);
        }
        return true;
    }
},

// ->    (+1 gear this turn)
TheGear: {
    name: 'The Gear',
    cost: 0,
    description: 'Give your character 1 extra gear this turn',
    image: 'cog',
    Play: function(match, owner, target) {
        owner.AddGears(1);
        return true;
    }
},

// Collections of the combinators
All: [],

Initialize: function(sfs) {
    sfas = sfs;
    this.All = [
        this.Separate,
        this.Duplicate,
        this.Swap,
        this.Subvert,
        this.Combine,
        this.Shield,
        this.Zap,
        this.Prepend,
        this.Spawn,
        this.Repetition,
        this.Reincarnate,
        this.Consume,
        this.Chomp,
        this.Kappa,
        this.Hoist
    ];
}

};

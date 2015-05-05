var battle = function(game){
    console.log("Initiating battle");
};

battle.prototype = {
    preload: function(){
        this.game.load.image('match_background', 'assets/backgrounds/match.jpg');

        this.game.load.image('cog', 'assets/icons/cog.png');
        this.game.load.image('heart', 'assets/icons/mineral-heart.png');
        this.game.load.image('attack', 'assets/icons/overdrive.png');
        this.game.load.image('swap', 'assets/icons/trade.png');
        this.game.load.image('separate', 'assets/icons/unplugged.png');
        this.game.load.image('duplicate', 'assets/icons/materials-science.png');
        this.game.load.image('subvert', 'assets/icons/cctv-camera.png');
        this.game.load.image('combine', 'assets/icons/cog-lock.png');
        this.game.load.image('shield', 'assets/icons/bordered-shield.png');
        this.game.load.image('zap', 'assets/icons/cogsplosion.png');
        this.game.load.image('prepend', 'assets/icons/abstract-057.png');
        this.game.load.image('repetition', 'assets/icons/over-infinity.png');
        this.game.load.image('reincarnate', 'assets/icons/eagle-emblem.png');
        this.game.load.image('consume', 'assets/icons/gluttony.png');
        this.game.load.image('chomp', 'assets/icons/bestial-fangs.png');
        this.game.load.image('kappa', 'assets/icons/kappa.png');
        this.game.load.image('hoist', 'assets/icons/trebuchet.png');
        this.game.load.image('minion', 'assets/creatures/vintage-robot.png');
        this.game.load.image('profile', 'assets/ability/iron-mask.png');
        this.game.load.image('profile_enemy', 'assets/ability/iron-mask.png');
        this.game.load.image('ability', 'assets/ability/auto-repair.png');
        this.game.load.image('enemy_ability', 'assets/ability/auto-repair.png');

        this.game.load.image('babbock', 'assets/avatars/babbock.jpg');
        this.game.load.image('de_borg', 'assets/avatars/de_borg.jpg');
        this.game.load.image('mccreary', 'assets/avatars/mccreary.jpg');
        this.game.load.image('van_newman', 'assets/avatars/van_newman.jpg');
    },

    init: function(data) {
        this.playerHand = [];
        this.opponentHand = [];
        this.allyLine = [];
        this.opponentLine = [];
        this.created = false;
        this.abilityEnabled = true;

        console.log('Battle commencing!');
        this.updateData(data);

        this.startHandPositionX = 145;
    },

    create: function(){
        console.log('Creating board');
        this.game.add.sprite(0, 0, 'match_background');
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.setupAvatars();
        this.updateHand();
        this.createButtons();
        this.updateLines();
        
        this.created = true;
    },

    update: function() {
        
    },

    setupAvatars: function() {
        // The bottom player is the client player
        this.allyProfile = this.game.add.sprite(5, 280, this.game.utils.avatarMap[this.data.player.avatar.character]);
        this.allyProfile.scale.setTo(0.6, 0.6);
        this.allyProfile.tint = this.data.player.id == this.data.active ? 0x00ffff : 0xffffff;

        this.game.add.sprite(80, 270, 'heart').scale.setTo(.06,.06);
        this.allyHealth = this.game.add.text(110, 273, this.data.player.avatar.health, {fontSize: '20px', fill: '#F00'});
        var abilityBack = this.game.add.bitmapData(52, 52);
        abilityBack.ctx.beginPath();
        abilityBack.ctx.rect(0, 0, 52, 52);
        abilityBack.ctx.fillStyle = '#ff0000';
        abilityBack.ctx.fill();
        this.game.add.sprite(80, 305, abilityBack);
        this.characterAbility = this.game.add.sprite(80, 305, 'ability');
        this.characterAbility.scale.setTo(0.1, 0.1);
        this.characterAbility.inputEnabled = this.data.player.id == this.data.active;
        this.characterAbility.useHandCursor = true;
        this.characterAbility.events.onInputDown.add(this.characterPower.bind(this));

        // The top player is the opponent
        this.enemyProfile = this.game.add.sprite(582, 10, this.game.utils.avatarMap[this.data.opponent.avatar.character]);
        this.enemyProfile.scale.setTo(0.44, 0.44);
        this.enemyProfile.tint = this.data.player.id != this.data.active ? 0x00ffff : 0xffffff;
        this.enemyProfile.inputEnabled = true;
        this.enemyProfile.useHandCursor = true;
        this.enemyProfile.events.onInputDown.add(this.characterProfileClick.bind(this));

        this.game.add.sprite(530, 5, 'heart').scale.setTo(0.05, 0.05);
        this.enemyHealth = this.game.add.text(555, 5, this.data.opponent.avatar.health, {fontSize: '20px', fill: '#F00'});
        var enemyAbilityBack = this.game.add.bitmapData(48, 48);
        enemyAbilityBack.ctx.beginPath();
        enemyAbilityBack.ctx.rect(0, 0, 48, 48);
        enemyAbilityBack.ctx.fillStyle = '#ff0000';
        enemyAbilityBack.ctx.fill();
        this.game.add.sprite(530, 35, enemyAbilityBack);
        var enemyAbility = this.game.add.sprite(530, 35, 'enemy_ability');
        enemyAbility.scale.setTo(0.09, 0.09);

        this.game.add.sprite(590, 295, 'cog').scale.setTo(.05,.05);
        this.activeGears = this.game.add.text(580, 325, this.data.player.avatar.activeGears + '', {fontSize: '20px', fill: '#00F'});
        this.game.add.text(603, 325, '/', {fontSize: '20px', fill: '#000'});
        this.maxGears = this.game.add.text(610, 325, this.data.player.avatar.maxGears + '', {fontSize: '20px', fill: '#00F'});
    },
    
    createButtons: function() {
        var buttonBack = this.game.add.bitmapData(150, 40);
        buttonBack.ctx.beginPath();
        buttonBack.ctx.rect(0,0,150,40);
        buttonBack.ctx.fillStyle = '#ffffff';
        buttonBack.ctx.fill();
        
        var yheight = 240;
        
        this.allyButton = this.game.add.sprite(this.startHandPositionX, yheight, buttonBack);
        this.game.add.text(this.startHandPositionX + 5, yheight, 'Play Ally', {fontSize: '20px', fill: '#080'});
        this.allyButton.tint = 0xdddddd;
        this.allyButton.inputEnabled = this.data.player.id == this.data.active;
        this.allyButton.useHandCursor = true;
        this.allyButton.events.onInputDown.add(this.playCardOnAlly.bind(this, this.allyButton));
        
        this.enemyButton = this.game.add.sprite(this.startHandPositionX + 160, yheight, buttonBack);
        this.game.add.text(this.startHandPositionX + 160 + 5, yheight, 'Play Enemy', {fontSize: '20px', fill: '#800'});
        this.enemyButton.tint = 0xdddddd;
        this.enemyButton.inputEnabled = this.data.player.id == this.data.active;
        this.enemyButton.useHandCursor = true;
        this.enemyButton.events.onInputDown.add(this.playCardOnEnemy.bind(this, this.enemyButton));
        
        this.endButton = this.game.add.sprite(this.startHandPositionX + 320, yheight, buttonBack);
        this.game.add.text(this.startHandPositionX + 320 + 5, yheight, 'End Turn', {fontSize: '20px', fill: '#000'});
        this.endButton.tint = 0xdddddd;
        this.endButton.inputEnabled = this.data.player.id == this.data.active;
        this.endButton.useHandCursor = true;
        this.endButton.events.onInputDown.add(this.endTurn.bind(this, this.endButton));
    },

    updateData: function(data) {
        console.log("Updating data: ");
        this.data = data;
        console.log(this.data);
        
        if (this.created) {
            var isActive = this.data.player.id == this.data.active;
            this.allyProfile.tint = isActive ? 0x00ffff : 0xffffff;
            this.enemyProfile.tint = this.data.opponent.id == this.data.active ? 0x00ffff : 0xffffff;
            this.characterAbility.inputEnabled = this.allyButton.inputEnabled = this.enemyButton.inputEnabled = this.endButton.inputEnabled = isActive;
            if (!this.abilityEnabled) {this.characterAbility.inputEnabled = false;}
            this.allyHealth.text = this.data.player.avatar.health + '';
            this.enemyHealth.text = this.data.opponent.avatar.health + '';
            this.activeGears.text = this.data.player.avatar.activeGears + '';
            this.maxGears.text = this.data.player.avatar.maxGears + '';
        }
        
        this.updateHand();
        this.updateLines();
    },

    updateHand: function() {
        this.playerHand.map(function(s) { s.destroy(); });
        this.opponentHand.map(function(s) { s.destroy(); });
        this.playerHand.length = this.opponentHand.length = 0;

        // Create player hand display
        var startHandPoxY = 300;
        for (var i = 0; i < this.data.player.avatar.hand.length; i++){
            var cardData = this.data.player.avatar.hand[i];
            var card = this.game.add.group();

            var cardBackBox = this.game.add.bitmapData(40, 50);
            cardBackBox.ctx.beginPath();
            cardBackBox.ctx.rect(0, 0, 40, 50);
            cardBackBox.ctx.fillStyle = '#eeeeee';
            cardBackBox.ctx.fill();

            var pback = this.game.add.sprite(this.startHandPositionX + i *43, startHandPoxY, cardBackBox);
            pback.inputEnabled = true;
            pback.useHandCursor = true;
            pback.events.onInputDown.add(this.cardMouseDown.bind(this, card, this.data.player.avatar.hand[i]), this);

            var cardCogs = this.game.add.sprite(this.startHandPositionX + i*43 + 17, startHandPoxY, 'cog');
            cardCogs.scale.setTo(0.02, 0.02);
            var cardImage = this.game.add.sprite(this.startHandPositionX + i*43, startHandPoxY + 10, cardData.image);
            cardImage.scale.setTo(.08,.08);

            card.add(pback);
            card.add(cardCogs);
            card.add(cardImage);
            card.select = (function(sprite) { this.selected = true; sprite.tint = 0x00ff00; }).bind(card, pback);
            card.deselect = (function(sprite) { this.selected = false; sprite.tint = 0xffffff; }).bind(card, pback);
            card.lockPosition = { x: card.x, y: card.y };
            this.playerHand.push(card);
        }

        // Create enemy hand display
        var startHandPoxY = 10;
        for (var i = 0; i < this.data.opponent.avatar.hand.length; i++){
            var cardBackBox = this.game.add.bitmapData(35, 50);
            cardBackBox.ctx.beginPath();
            cardBackBox.ctx.rect(0, 0, 40, 50);
            cardBackBox.ctx.fillStyle = '#777777';
            cardBackBox.ctx.fill();
            var back = this.game.add.sprite(this.startHandPositionX + i *37, startHandPoxY, cardBackBox);
            this.opponentHand.push(back);
        }
    },
    
    updateLines: function() {
        // create ally battle line
        this.allyLine.map(function(s) { s.destroy(); });
        this.opponentLine.map(function(s) { s.destroy(); });
        this.allyLine.length = this.opponentLine.length = 0;
        
        var startLinePosY = 170;
        for (var i = 0; i < this.data.player.avatar.line.automatons.length; i++){
            var automaton = this.data.player.avatar.line.automatons[i];
            var card = this.game.add.group();
            
            var cardBackBox = this.game.add.bitmapData(45, 60);
            cardBackBox.ctx.beginPath();
            cardBackBox.ctx.rect(0, 0, 45, 60);
            cardBackBox.ctx.fillStyle = '#fff';
            cardBackBox.ctx.fill();
            
            var back = this.game.add.sprite(this.startHandPositionX + i *48, startLinePosY, cardBackBox);
            if (this.data.player.id == this.data.active && automaton.canAttack) {
                back.inputEnabled = true;
                back.useHandCursor = true;
                back.events.onInputDown.add(this.toggleAutomaton.bind(this, card));
            }
            var cardImage = this.game.add.sprite(this.startHandPositionX + i*48, startLinePosY, 'minion');
            cardImage.scale.setTo(.09,.09);
            var health = this.game.add.text(this.startHandPositionX + 3 + i*48, startLinePosY + 45,automaton.durability+'', {fontSize: '12px', fill: '#f00'});
            var attack = this.game.add.text(this.startHandPositionX + 30 + i*48, startLinePosY + 45,automaton.energy+'', {fontSize: '12px', fill: '#00f'});
                
            card.add(back);
            card.add(cardImage);
            card.add(health);
            card.add(attack);
            card.select = (function(sprite) { this.selected = true; sprite.tint = 0xffff00; }).bind(card, back);
            card.deselect = (function(sprite) { this.selected = false; sprite.tint = 0xffffff; }).bind(card, back);
            card.selected = false;
            card.disable = (function(sprite) {
                this.selected = false;
                sprite.tint = 0xffffff;
                sprite.inputEnabled = false;
                sprite.useHandCursor = false; }).bind(card, back);
            this.allyLine.push(card);
        }

        // create enemy battle line
        var startEnemyLinePoxY = 90;
        for (var i = 0; i < this.data.opponent.avatar.line.automatons.length; i++){
            var automaton = this.data.opponent.avatar.line.automatons[i];
            var card = this.game.add.group();
            
            var cardBackBox = this.game.add.bitmapData(45, 60);
            cardBackBox.ctx.beginPath();
            cardBackBox.ctx.rect(0, 0, 45, 60);
            cardBackBox.ctx.fillStyle = '#fff';
            cardBackBox.ctx.fill();
            
            var back = this.game.add.sprite(this.startHandPositionX + i *48, startEnemyLinePoxY, cardBackBox);
            back.inputEnabled = true;
            back.useHandCursor = true;
            back.events.onInputDown.add(this.enemyAutomatonClick.bind(this, this.data.player.avatar.hand[i]), this);

            var cardImage = this.game.add.sprite(this.startHandPositionX + i*48, startEnemyLinePoxY, 'minion');
            cardImage.scale.setTo(.09,.09);
            var health = this.game.add.text(this.startHandPositionX + 3 + i*48, startEnemyLinePoxY + 45, automaton.durability+'', {fontSize: '12px', fill: '#f00'});
            var attack = this.game.add.text(this.startHandPositionX + 30 + i*48, startEnemyLinePoxY + 45, automaton.energy+'', {fontSize: '12px', fill: '#00f'});
            
            card.add(back);
            card.add(cardImage);
            card.add(health);
            card.add(attack);
            this.opponentLine.push(card);
        }
    },

    cardMouseDown: function(sprite, card) {
        this.showCardPreview(card);

        for (var i = 0; i < this.playerHand.length; i++) {
            this.playerHand[i].deselect();
        }
        sprite.select();
    },

    showCardPreview: function(card) {
        // Create card preview
        if (this.cardPreview) {
            this.cardPreview.destroy();
        }
        this.cardPreview = this.game.add.group();
        var cardBack = this.game.add.bitmapData(124, 250);
        cardBack.ctx.beginPath();
        cardBack.ctx.rect(0, 0, 135, 220);
        cardBack.ctx.fillStyle = '#eeeeee';
        cardBack.ctx.fill();
        var back = this.game.add.sprite(5, 30, cardBack);
        back.inputEnabled = true;
        back.useHandCursor = true;
        var cardCog = this.game.add.sprite(85, 30, 'cog');
        cardCog.scale.setTo(.04,.04);
        var cardCost = this.game.add.text(105, 31, card.cost + '', {fontSize: '16px', fill:'#000'});
        var cardName = this.game.add.text(15, 55, card.name, {fontSize: '12px', fill: '#000'})
        var cardImage = this.game.add.sprite(15, 75, card.image);
        cardImage.scale.setTo(0.2, 0.2);

        var descStyle = { font: 'bold 10px Arial', fill: '#333', align: 'center', wordWrap: true, wordWrapWidth: 110 };
        var description = this.game.add.text(15, 190, card.description, descStyle);

        this.cardPreview.add(back);
        this.cardPreview.add(cardCog);
        this.cardPreview.add(cardCost);
        this.cardPreview.add(cardName);
        this.cardPreview.add(cardImage);
        this.cardPreview.add(description);
    },
    
    playCardOnAlly: function(sprite) {
        for (var i = 0; i < this.playerHand.length; i++) {
            if (this.playerHand[i].selected) {
                var card = this.data.player.avatar.hand[i];
                if (this.data.player.avatar.activeGears < card.cost) {
                    alert('Not enough gears to play ' + card.name);
                } else {
                    this.game.socket.send(JSON.stringify({type:'play card on ally',data:i}));
                }
            }
        }
    },
    
    playCardOnEnemy: function(sprite) {
        for (var i = 0; i < this.playerHand.length; i++) {
            if (this.playerHand[i].selected) {
                var card = this.data.player.avatar.hand[i];
                if (this.data.player.avatar.activeGears < card.cost) {
                    alert('Not enough gears to play ' + card.name);
                } else {
                    this.game.socket.send(JSON.stringify({type:'play card on enemy',data:i}));
                }
            }
        }
    },

    toggleAutomaton: function(automaton) {
        if (automaton.selected) {
            automaton.deselect();
        } else {
            for (var i = 0; i < this.allyLine.length; i++) {
                this.allyLine[i].deselect();
            }
            automaton.select();
        }
    },

    enemyAutomatonClick: function(enemyIndex) {
        for (var i = 0; i < this.allyLine.length; i++) {
            if (this.allyLine[i].selected) {
                this.game.socket.send(JSON.stringify({type:'attack automaton', attacking:i, target:enemyIndex}));
                this.allyLine[i].disable();
            }
        }
    },

    characterProfileClick: function() {
        for (var i = 0; i < this.allyLine.length; i++) {
            if (this.allyLine[i].selected) {
                this.game.socket.send(JSON.stringify({type:'attack hero', attacking:i}));
                this.allyLine[i].disable();
            }
        }
    },
    
    characterPower: function() {
        if (this.data.player.avatar.activeGears < 2) {
            alert('Not enough gears to use character power!');
        } else {
            this.abilityEnabled = false;
            this.game.socket.send(JSON.stringify({type:'character power'}));
        }
    },
    
    endTurn: function(sprite) {
        this.game.socket.send(JSON.stringify({type:'end turn'}));
        // disable buttons so player's can't end twice while the server waits
        this.characterAbility.inputEnabled = this.allyButton.inputEnabled = this.enemyButton.inputEnabled = this.endButton.inputEnabled = false;
    },
    
    startTurn: function(data) {
        console.log('A new turn started');
        this.abilityEnabled = true;
        this.updateData(data);
    }
};

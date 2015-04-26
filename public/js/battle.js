var battle = function(game){
    console.log("Initiating battle");
};

battle.prototype = {
    preload: function(){
        this.game.load.image('match_background', 'assets/backgrounds/match.jpg');

        this.game.load.image('cog', 'assets/icons/cog.png');
        this.game.load.image('heart', 'assets/icons/mineral-heart.png');
        this.game.load.image('attack', 'assets/icons/overdrive.png');
        this.game.load.image('minion', 'assets/creatures/vintage-robot.png');
        this.game.load.image('profile', 'assets/abilities/iron-mask.png');
        this.game.load.image('profile_enemy', 'assets/abilities/iron-mask.png');
        this.game.load.image('ability', 'assets/abilities/auto-repair.png');
        this.game.load.image('enemy_ability', 'assets/abilities/auto-repair.png');

        this.game.load.image('babbock', 'assets/avatars/babbock.jpg');
        this.game.load.image('de_borg', 'assets/avatars/de_borg.jpg');
        this.game.load.image('mccreary', 'assets/avatars/mccreary.jpg');
        this.game.load.image('van_newman', 'assets/avatars/van_newman.jpg');
    },

    init: function(data) {
        this.playerHand = [];
        this.opponentHand = [];

        console.log('Battle commencing!');
        this.updateData(data);
    },

    create: function(){
        console.log('Creating board');
        this.game.add.sprite(0, 0, 'match_background');

        this.setupAvatars();
        this.setupCardPreview();
        this.updateHand();

        // create battle line
        var line = [];
        var startLinePosX = 145;
        var startLinePosY = 170;
        for (var i = 0; i < 10; i++){
            var card = {};
            var cardBackBox = this.game.add.bitmapData(45, 60);
            cardBackBox.ctx.beginPath();
            cardBackBox.ctx.rect(0, 0, 45, 60);
            cardBackBox.ctx.fillStyle = '#fff';
            cardBackBox.ctx.fill();
            var back = this.game.add.sprite(startLinePosX + i *48, startLinePosY, cardBackBox);
            var cardImage = this.game.add.sprite(startLinePosX + i*48, startLinePosY, 'minion');
            cardImage.scale.setTo(.09,.09);
            var health = this.game.add.text(startLinePosX + 3 + i*48, startLinePosY + 45,
                '1', {fontSize: '12px', fill: '#f00'});
            var attack = this.game.add.text(startLinePosX + 30 + i*48, startLinePosY + 45,
                '1', {fontSize: '12px', fill: '#00f'});
        }

        // create enemy battle line
        var enemyLine = [];
        var startEnemyLinePosX = 145;
        var startEnemyLinePoxY = 90;
        for (var i = 0; i < 10; i++){
            var card = {};
            var cardBackBox = this.game.add.bitmapData(45, 60);
            cardBackBox.ctx.beginPath();
            cardBackBox.ctx.rect(0, 0, 45, 60);
            cardBackBox.ctx.fillStyle = '#fff';
            cardBackBox.ctx.fill();
            var back = this.game.add.sprite(startHandPosX + i *48, startEnemyLinePoxY, cardBackBox);
            var cardImage = this.game.add.sprite(startEnemyLinePosX + i*48, startEnemyLinePoxY, 'minion');
            cardImage.scale.setTo(.09,.09);
            var health = this.game.add.text(startEnemyLinePosX + 3 + i*48, startEnemyLinePoxY + 45, '1', {fontSize: '12px', fill: '#f00'});
            var attack = this.game.add.text(startEnemyLinePosX + 30 + i*48, startEnemyLinePoxY + 45, '1', {fontSize: '12px', fill: '#00f'});
        }
    },

    update: function(){
    },

    setupAvatars: function() {
        // The bottom player is the active player
        var profileImage = this.game.add.sprite(5, 280, this.game.utils.avatarMap[this.data.player.avatar.character]);
        profileImage.scale.setTo(0.6, 0.6);

        this.game.add.sprite(80, 270, 'heart').scale.setTo(.06,.06);
        var heroHealth = this.game.add.text(110, 273, this.data.player.avatar.health, {fontSize: '20px', fill: '#F00'});
        var abilityBack = this.game.add.bitmapData(52, 52);
        abilityBack.ctx.beginPath();
        abilityBack.ctx.rect(0, 0, 52, 52);
        abilityBack.ctx.fillStyle = '#ff0000';
        abilityBack.ctx.fill();
        var back = this.game.add.sprite(80, 305, abilityBack);
        var characterAbility = this.game.add.sprite(80, 305, 'ability');
        characterAbility.scale.setTo(0.1, 0.1);

        // The top player is the opponent
        var enemyProfile = this.game.add.sprite(582, 10, this.game.utils.avatarMap[this.data.opponent.avatar.character]);
        enemyProfile.scale.setTo(0.44, 0.44);

        this.game.add.sprite(530, 5, 'heart').scale.setTo(0.05, 0.05);
        var enemyHealth = this.game.add.text(555, 5, this.data.opponent.avatar.health, {fontSize: '20px', fill: '#F00'});
        var enemyAbilityBack = this.game.add.bitmapData(48, 48);
        enemyAbilityBack.ctx.beginPath();
        enemyAbilityBack.ctx.rect(0, 0, 48, 48);
        enemyAbilityBack.ctx.fillStyle = '#ff0000';
        enemyAbilityBack.ctx.fill();
        var enemyBack = this.game.add.sprite(530, 35, enemyAbilityBack);
        var enemyAbility = this.game.add.sprite(530, 35, 'enemy_ability');
        enemyAbility.scale.setTo(0.09, 0.09);

        this.game.add.sprite(590, 295, 'cog').scale.setTo(.05,.05);
        var currentCog = this.game.add.text(580, 325, this.data.player.avatar.activeGears, {fontSize: '20px', fill: '#00F'});
        var div = this.game.add.text(603, 325, '/', {fontSize: '20px', fill: '#000'});
        var totalCog = this.game.add.text(610, 325, this.data.player.avatar.maxGears, {fontSize: '20px', fill: '#00F'});
    },

    setupCardPreview: function() {
        // Create card preview
        var cardBack = this.game.add.bitmapData(124, 250);
        cardBack.ctx.beginPath();
        cardBack.ctx.rect(0, 0, 135, 220);
        cardBack.ctx.fillStyle = '#ffffff';
        cardBack.ctx.fill();
        var back = this.game.add.sprite(5, 30, cardBack);
        var cardCog = this.game.add.sprite(85, 30, 'cog');
        cardCog.scale.setTo(.04,.04);
        var cardCost = this.game.add.text(105, 31, '10', {fontSize: '16px', fill:'#000'});
        var cardName = this.game.add.text(15, 55, 'Duplicate', {fontSize: '12px', fill: '#000'})
        var cardImage = this.game.add.sprite(15, 75, 'minion');
        cardImage.scale.setTo(0.2, 0.2);
        var description = this.game.add.text(15, 190, 'Description', {fontSize: '10px', fill: '#333'});
    },

    updateData: function(data) {
        console.log("Updating data: ");
        this.data = data;
        console.log(this.data);
    },

    updateHand: function() {
        this.playerHand.map(function(s) { s.destroy(); });
        this.opponentHand.map(function(s) { s.destroy(); });
        this.playerHand.length = this.opponentHand.length = 0;

        // Create player hand display
        var startHandPos = 145;
        var startHandPoxY = 300;
        for (var i = 0; i < this.data.player.avatar.hand.length; i++){
            var card = this.game.add.group();

            var cardBackBox = this.game.add.bitmapData(40, 50);
            cardBackBox.ctx.beginPath();
            cardBackBox.ctx.rect(0, 0, 40, 50);
            cardBackBox.ctx.fillStyle = '#ffffff';
            cardBackBox.ctx.fill();

            var back = this.game.add.sprite(startHandPos + i *43, startHandPoxY, cardBackBox);
            var cardCogs = this.game.add.sprite(startHandPos + i*43, startHandPoxY, 'cog');
            cardCogs.scale.setTo(0.03, 0.03);
            var cardImage = this.game.add.sprite(startHandPos + i*43, startHandPoxY + 10, 'minion');
            cardImage.scale.setTo(.08,.08);

            card.add(back);
            card.add(cardCogs);
            card.add(cardImage);
        }

        // Create enemy hand display
        var startHandPosX = 145;
        var startHandPoxY = 10;
        for (var i = 0; i < 10; i++){
            var card = {};
            var cardBackBox = this.game.add.bitmapData(35, 50);
            cardBackBox.ctx.beginPath();
            cardBackBox.ctx.rect(0, 0, 40, 50);
            cardBackBox.ctx.fillStyle = '#ffffff';
            cardBackBox.ctx.fill();
            var back = this.game.add.sprite(startHandPosX + i *37, startHandPoxY, cardBackBox);
        }
    }
};

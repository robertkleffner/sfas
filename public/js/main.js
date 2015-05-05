(function () {
    var game = new Phaser.Game(640, 360, Phaser.AUTO, '',
        {preload: preload, create: create, update: update});

    function preload(){
        game.load.image('cog', 'assets/icons/cog.png');
        game.load.image('heart', 'assets/icons/mineral-heart.png');
        game.load.image('attack', 'assets/icons/overdrive.png');
        game.load.image('minion', 'assets/creatures/vintage-robot.png');
        game.load.image('profile', 'assets/abilities/iron-mask.png');
        game.load.image('profile_enemy', 'assets/abilities/iron-mask.png');
        game.load.image('ability', 'assets/abilities/auto-repair.png');
        game.load.image('enemy_ability', 'assets/abilities/auto-repair.png');
    }

    function create(){
        game.stage.backgroundColor = '#ddd';
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        // Base Board Setup
        var profileImage = game.add.sprite(5, 270, 'profile');
        profileImage.scale.setTo(0.15, 0.15);
        var heroHeart = game.add.sprite(80, 270, 'heart');
        heroHeart.scale.setTo(.06,.06);
        var heroHealth = game.add.text(110, 273, '20', {fontSize: '20px', fill: '#F00'});
        var abilityBack = game.add.bitmapData(52, 52);
        abilityBack.ctx.beginPath();
        abilityBack.ctx.rect(0, 0, 52, 52);
        abilityBack.ctx.fillStyle = '#ff0000';
        abilityBack.ctx.fill();
        var back = game.add.sprite(80, 305, abilityBack);
        var characterAbility = game.add.sprite(80, 305, 'ability');
        characterAbility.scale.setTo(0.1, 0.1);
        var enemyProfile = game.add.sprite(575, 5, 'profile_enemy');
        enemyProfile.scale.setTo(0.12, 0.12);
        var enemyHeart = game.add.sprite(530, 5, 'heart');
        enemyHeart.scale.setTo(0.05, 0.05);
        var enemyHealth = game.add.text(555, 5, '20', {fontSize: '20px', fill: '#F00'});
        var enemyAbilityBack = game.add.bitmapData(48, 48);
        enemyAbilityBack.ctx.beginPath();
        enemyAbilityBack.ctx.rect(0, 0, 48, 48);
        enemyAbilityBack.ctx.fillStyle = '#ff0000';
        enemyAbilityBack.ctx.fill();
        var enemyBack = game.add.sprite(530, 35, enemyAbilityBack);
        var enemyAbility = game.add.sprite(530, 35, 'enemy_ability');
        enemyAbility.scale.setTo(0.09, 0.09);
        var cog = game.add.sprite(590, 295, 'cog');
        cog.scale.setTo(.05,.05);
        var currentCog = game.add.text(580, 325, '10', {fontSize: '20px', fill: '#00F'});
        var div = game.add.text(603, 325, '/', {fontSize: '20px', fill: '#000'});
        var totalCog = game.add.text(610, 325, '30', {fontSize: '20px', fill: '#00F'});

        // Create card preview
        var cardBack = game.add.bitmapData(124, 250);
        cardBack.ctx.beginPath();
        cardBack.ctx.rect(0, 0, 135, 220);
        cardBack.ctx.fillStyle = '#ffffff';
        cardBack.ctx.fill();
        var back = game.add.sprite(5, 30, cardBack);
        var heart = game.add.sprite(5, 30, 'heart');
        heart.scale.setTo(.04,.04);
        var health = game.add.text(27, 31, '13', {fontSize: '16px', fill: '#F00'});
        var damage = game.add.sprite(50, 30, 'attack');
        damage.scale.setTo(.04,.04);
        var attack = game.add.text(70, 31, '5', {fontSize: '16px', fill: '#00F'});
        var cardCog = game.add.sprite(85, 30, 'cog');
        cardCog.scale.setTo(.04,.04);
        var cardCost = game.add.text(105, 31, '10', {fontSize: '16px', fill:'#000'});
        var cardImage = game.add.sprite(15, 55, 'minion');
        cardImage.scale.setTo(0.2, 0.2);
        var description = game.add.text(15, 170, 'DESCRIPTION', {fontSize: '10px', fill: '#000'});

        // Create hand display
        var hand = [];
        var startHandPos = 145;
        var startHandPoxY = 300;
        for (var i = 0; i < 10; i++){
            var card = {};
            var cardBackBox = game.add.bitmapData(40, 50);
            cardBackBox.ctx.beginPath();
            cardBackBox.ctx.rect(0, 0, 40, 50);
            cardBackBox.ctx.fillStyle = '#ffffff';
            cardBackBox.ctx.fill();
            var back = game.add.sprite(startHandPos + i *43, startHandPoxY, cardBackBox);
            var cardCogs = game.add.sprite(startHandPos + i*43, startHandPoxY, 'cog');
            cardCogs.scale.setTo(0.03, 0.03);
            var cardImage = game.add.sprite(startHandPos + i*43, startHandPoxY + 10, 'minion');
            cardImage.scale.setTo(.08,.08);
        }

        // Create enemy hand display
        var hand = [];
        var startHandPosX = 145;
        var startHandPoxY = 10;
        for (var i = 0; i < 10; i++){
            var card = {};
            var cardBackBox = game.add.bitmapData(35, 50);
            cardBackBox.ctx.beginPath();
            cardBackBox.ctx.rect(0, 0, 40, 50);
            cardBackBox.ctx.fillStyle = '#ffffff';
            cardBackBox.ctx.fill();
            var back = game.add.sprite(startHandPosX + i *37, startHandPoxY, cardBackBox);
        }

        // create battle line
        var line = [];
        var startLinePosX = 145;
        var startLinePosY = 170;
        for (var i = 0; i < 10; i++){
            var card = {};
            var cardBackBox = game.add.bitmapData(45, 60);
            cardBackBox.ctx.beginPath();
            cardBackBox.ctx.rect(0, 0, 45, 60);
            cardBackBox.ctx.fillStyle = '#fff';
            cardBackBox.ctx.fill();
            var back = game.add.sprite(startLinePosX + i *48, startLinePosY, cardBackBox);
            var cardImage = game.add.sprite(startLinePosX + i*48, startLinePosY, 'minion');
            cardImage.scale.setTo(.09,.09);
            var health = game.add.text(startLinePosX + 3 + i*48, startLinePosY + 45,
                '1', {fontSize: '12px', fill: '#f00'});
            var attack = game.add.text(startLinePosX + 30 + i*48, startLinePosY + 45,
                '1', {fontSize: '12px', fill: '#00f'});
        }

        // create enemy battle line
        var enemyLine = [];
        var startEnemyLinePosX = 145;
        var startEnemyLinePoxY = 90;
        for (var i = 0; i < 10; i++){
            var card = {};
            var cardBackBox = game.add.bitmapData(45, 60);
            cardBackBox.ctx.beginPath();
            cardBackBox.ctx.rect(0, 0, 45, 60);
            cardBackBox.ctx.fillStyle = '#fff';
            cardBackBox.ctx.fill();
            var back = game.add.sprite(startHandPosX + i *48, startEnemyLinePoxY, cardBackBox);
            var cardImage = game.add.sprite(startEnemyLinePosX + i*48, startEnemyLinePoxY, 'minion');
            cardImage.scale.setTo(.09,.09);
            var health = game.add.text(startEnemyLinePosX + 3 + i*48, startEnemyLinePoxY + 45, '1', {fontSize: '12px', fill: '#f00'});
            var attack = game.add.text(startEnemyLinePosX + 30 + i*48, startEnemyLinePoxY + 45, '1', {fontSize: '12px', fill: '#00f'});
        }
    }

    function update(){
    }
})();

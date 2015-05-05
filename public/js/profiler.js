var profiler = function(game){};

profiler.prototype = {
    preload: function() {
        this.game.load.image('babbock', 'assets/avatars/babbock.jpg');
        this.game.load.image('de_borg', 'assets/avatars/de_borg.jpg');
        this.game.load.image('mccreary', 'assets/avatars/mccreary.jpg');
        this.game.load.image('van_newman', 'assets/avatars/van_newman.jpg');
        this.game.load.image('gear_bg', 'assets/backgrounds/gear_bg.jpg');
    },

    create: function() {
        this.game.add.sprite(0, 0, 'gear_bg');
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        var title = this.game.add.text(320, 30, 'Choose your Character');
        title.anchor.set(0.5);
        title.stroke = '#ffffff';
        title.strokeThickness = 2;

        var dbPortrait = this.game.add.sprite(22, 125, 'de_borg');
        var bbPortrait = this.game.add.sprite(182, 125, 'babbock');
        var vnPortrait = this.game.add.sprite(342, 125, 'van_newman');
        var mcPortrait = this.game.add.sprite(502, 125, 'mccreary');
        this.portraits = [];
        this.portraits.push(bbPortrait, dbPortrait, vnPortrait, mcPortrait);

        dbPortrait.inputEnabled = bbPortrait.inputEnabled = vnPortrait.inputEnabled = mcPortrait.inputEnabled = true;
        dbPortrait.input.useHandCursor = bbPortrait.input.useHandCursor = vnPortrait.input.useHandCursor = mcPortrait.input.useHandCursor = true;

        dbPortrait.events.onInputDown.add(this.choose.bind(this, this.game.utils.DE_BORG), this);
        bbPortrait.events.onInputDown.add(this.choose.bind(this, this.game.utils.BABBOCK), this);
        vnPortrait.events.onInputDown.add(this.choose.bind(this, this.game.utils.VAN_NEWMAN), this);
        mcPortrait.events.onInputDown.add(this.choose.bind(this, this.game.utils.MCCREARY), this);

        var dbName = this.game.add.text(80, 260, 'Lady de Borg');
        var bbName = this.game.add.text(240, 260, 'Count Babbock');
        var vnName = this.game.add.text(400, 260, 'Baron Van Newman');
        var mcName = this.game.add.text(560, 260, 'Alfonzo McCreary');

        dbName.anchor.set(0.5);
        bbName.anchor.set(0.5);
        vnName.anchor.set(0.5);
        mcName.anchor.set(0.5);
        dbName.fontSize = bbName.fontSize = vnName.fontSize = mcName.fontSize = 16;
        dbName.stroke = bbName.stroke = vnName.stroke = mcName.stroke = '#ffffff';
        dbName.strokeThickness = bbName.strokeThickness = vnName.strokeThickness = mcName.strokeThickness = 2;

        /*var names = ["Ben", "Rob", "TJ", "Gavin", "Clint", "Gliedson", "John", "Frank"];
        this.players = ["Player2", "Player1"];
        var title = this.game.add.text(280, 10, "Choose a profile:");
        this.currPlayer = this.game.add.text(500, 10, this.players.pop(), {fill: "#ff0000"});

        var selectArea = this.game.add.bitmapData(640, 52);
        selectArea.ctx.beginPath();
        selectArea.ctx.rect(0, 0, 640, 52);
        selectArea.ctx.fillStyle = '#ff0000';
        selectArea.ctx.fill();
        this.select = this.game.add.sprite(0, 300, selectArea);
        this.physics.enable(this.select, Phaser.Physics.ARCADE);

        this.usernames = [];
        var row = 10;
        var column = 10;
        for (var i = 0; i < names.length; i++){
            row += 40;
            var name = this.game.add.text(0, 0, names[i], "");
            var username = this.game.add.sprite(column, row, null);
            username.addChild(name);
            username.inputEnabled = true;
            username.input.enableDrag();
            username.events.onDragStop.add(this.check, this);
            this.physics.enable(username, Phaser.Physics.ARCADE);
            this.usernames.push(username);
            if (row >= 210){
                row = 10;
                column += 130;
            }
        }*/

    },
    check: function() {
        for (var i = 0; i < this.usernames.length; i++){
            this.physics.arcade.overlap(this.select, this.usernames[i], this.next, null, this);
        }
    },

    next: function(selector, sprite){
        if (this.players.length > 0){
            this.currPlayer.text = this.players.pop();
            return;
        }
        //sfas.game.ConnectPlayer(sprite.children[0].text);
        this.game.state.start("Battle");
    },

    update: function(){

    },

    choose: function(avatar) {
        this.game.socket.send(JSON.stringify({type:'choose avatar',data:avatar}));
        this.portraits[avatar].tint = 0x00ff00;
        // disable other portraits
        this.portraits.map(function(p) { p.events.onInputDown.removeAll(); });
        // show waiting message
        var wait = this.game.add.text(320, 300, 'Waiting to find match...');
        wait.anchor.set(0.5);
        wait.stroke = '#ffffff';
        wait.strokeThickness = 2;
    }
};

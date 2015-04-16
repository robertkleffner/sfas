var profiler = function(game){};

profiler.prototype = {
    preload: function() {
    },
    create: function() {
        var names = ["Ben", "Rob", "TJ", "Gavin", "Clint", "Gliedson", "John", "Frank"];
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
        }

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
        sfas.game.ConnectPlayer(sprite.children[0].text);
        this.game.state.start("Battle");
    },

    update: function(){

    }
};

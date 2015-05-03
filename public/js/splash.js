var splash = function(game){};

splash.prototype = {
    preload: function(){
        this.game.load.image('gauges', 'assets/backgrounds/gauges.jpg');
        this.game.load.image('play', "assets/icons/play.png");
    },

    create: function(){
        this.game.add.sprite(0, 0, 'gauges');

        this.game.stage.draggable = true;
        var playButton = this.game.add.button(320, 240, "play", this.play, this);
        playButton.scale.setTo(0.3, 0.3);
        playButton.anchor.setTo(0.5,0.5);
        var playText = this.game.add.text(320, 242, "Play", { font: "30px Arial", fill: "#ffffff", align: "center" });
        playText.anchor.setTo(0.5, 0.5);
    },

    play: function(){
        this.game.state.start('Profiler');
    },
    
    update: function(){

    }
};

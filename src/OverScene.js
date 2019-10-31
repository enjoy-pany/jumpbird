
(function(ns){

    var OverScene = ns.OverScene = Hilo.Class.create({
        Extends: Hilo.Container,
        constructor: function(properties){
            OverScene.superclass.constructor.call(this, properties);
            this.init(properties);
        },
    
        init: function(properties){
            var gameover = new Hilo.Bitmap({
                id: 'gameover',
                image: properties.image,
                rect: [0, 298, 508, 158]
            });
            
            gameover.x = this.width - gameover.width >> 1;
            gameover.y = gameover.height - 20;
            
            this.addChild(gameover);
        },
    
        show: function(score, bestScore){
            this.visible = true;
            Hilo.Tween.to(this.getChildById('gameover'), {alpha:1}, {duration:100});
        },
    
        hide : function(){
            this.visible = false;
            this.getChildById('gameover').alpha = 0;
        }
    });
    
    })(window.game);
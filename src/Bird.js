(function(ns) {
    var Bird = ns.Bird = Hilo.Class.create({
        Extends: Hilo.Sprite,
        constructor: function(properties) {
            Bird.superclass.constructor.call(this, properties);
            //添加小鸟精灵动画帧
            this.addFrame(properties.atlas.getSprite('bird'));
            //设置小鸟扇动翅膀的频率
            this.interval = 6;
            //设置小鸟的中心点位置
            // 而小鸟的宽度和高度分别为86和60，故pivotX和pivotY即为43和30。
            this.pivotX = 43;
            this.pivotY = 30;

            this.flyHeight = 80; // 飞行高度
            this.gravity = 10 / 1000 * 0.3; // 加速度
            this.initVelocity = Math.sqrt(2 * this.flyHeight * this.gravity);
        },
        startX: 0, //小鸟的起始x坐标
        startY: 0, //小鸟的起始y坐标
        groundY: 0, //地面的坐标
        gravity: 0, //重力加速度
        flyHeight: 0, //小鸟每次往上飞的高度
        initVelocity: 0, //小鸟往上飞的初速度

        flyEnd: true, // 是否完成一次飞行
        isDead: true, //小鸟是否已死亡
        isUp: false, //小鸟是在往上飞阶段，还是下落阶段
        flyStartY: 600, //小鸟往上飞的起始y轴坐标
        flyStartX: 200, //小鸟往上飞的起始y轴坐标
        flyStartTime: 0, //小鸟飞行起始时间

        v0: 0, //初始速度

        getReady: function() {
            // this.x = this.startX;
            // this.y = this.startY;
            this.x = 200;
            this.y = 600;
            //恢复小鸟飞行角度为平行向前
            this.rotation = -10;
            //减慢小鸟精灵动画速率
            this.interval = 6;
            //恢复小鸟精灵动画
            this.play();
            //小鸟上下漂浮的动画
            // this.tween = Hilo.Tween.to(this, {y:this.y + 10, rotation:-8}, {duration:400, reverse:true, loop:true});

            if(ns.groundTween) ns.groundTween.stop()
        },
        startFly: function(dt) {
            this.flyStartX = this.x
            this.flyEnd =false
            this.flyStartTime = +new Date();
            this.v0 = dt*1.2
            if(this.tween) this.tween.pause();
        },
        onUpdate: function() {
            if(this.flyEnd) return
            //飞行时间
            var t = ((+new Date()) - this.flyStartTime)/1000;
            var v0 = this.v0;
            var v1 = 1000;
            var g = 1200;
            var v = v0 - g*t
            var h = 2/3*v0*t - .5*g*t*t;
            var l = .4*v0*t;;
            //y轴坐标
            var y = this.flyStartY - h;
            var x = this.flyStartX + l;
            if(y<this.flyStartY) {
                this.y = y;
                this.x = x;
            }else {
                this.fire('done')
                this.flyEnd = true;
                ns.groundTween.start()
                ns.moveTween.start()
                Hilo.Tween.to(this, {x:200}, {duration:2000, loop:false, delay:500 ,onComplete: function() {
                    ns.groundTween.pause()
                    ns.moveTween.pause()
                }});
                
            }
            
        }
     })
})(window.game);
(function() {
    window.onload = function() {
        game.init();
    }
    var game = window.game = {
        width: 0,
        height: 0,

        asset: null,
        stage: null,
        ticker: null,
        state: null,
        score: 0,

        bg: null,
        ground: null,
        bird: null,
        holdbacks: null,
        gameReadyScene: null,
        gameOverScene: null,

        startTime: null,
        endTime: null,

        init: function() {
            this.asset = new game.Asset();
            this.asset.on('complete', function(e) { // 注册监听
                this.asset.off('complete'); // 注销监听
                this.initStage();
            }.bind(this));
            this.asset.load(); //开始读取资源
        },
        initStage() {
            this.width = Math.min(innerWidth, 750) * 2;
            this.height = Math.min(innerHeight, 450) * 2;
            this.scale = 0.5;

            //舞台画布
            var renderType = location.search.indexOf('dom') != -1 ? 'dom' : 'canvas';

            //舞台
            this.stage = new Hilo.Stage({
                renderType: renderType,
                width: this.width,
                height: this.height,
                scaleX: this.scale,
                scaleY: this.scale
            });
            document.body.appendChild(this.stage.canvas);

            //启动计时器
            this.ticker = new Hilo.Ticker(60);
            this.ticker.addTick(Hilo.Tween);
            this.ticker.addTick(this.stage);
            this.ticker.start(true);

            //绑定交互事件
            this.stage.enableDOMEvent(Hilo.event.POINTER_START, true);
            this.stage.enableDOMEvent(Hilo.event.POINTER_END, true);
            this.stage.on(Hilo.event.POINTER_START, this.onUserInputStart.bind(this));
            this.stage.on(Hilo.event.POINTER_END, this.onUserInputEnd.bind(this));
            
            // 游戏元素初始化
            this.initBackground();
            this.initBird();
            this.initHoldbacks();

            // 准备游戏
            this.gameReady()

        },
        initBackground() {
            var bgWidth = this.width * this.scale;
            var bgHeight = this.height * this.scale;

            var bgImg = this.asset.bg;
            this.bg = new Hilo.Bitmap({
                id: 'bg',
                image: bgImg,
                scaleX: this.width / bgImg.width,
                scaleY: this.height / bgImg.height
            }).addTo(this.stage);

            //地面
            var groundImg = this.asset.ground;
            var groundOffset = 60;
            this.ground = new Hilo.Bitmap({
                id: 'ground',
                image: groundImg,
                scaleX: (this.width + groundOffset * 2) / groundImg.width
            }).addTo(this.stage);

            //设置地面的y轴坐标
            this.ground.y = this.height - this.ground.height + 150;

            //移动地面
            this.groundTween = Hilo.Tween.to(this.ground, {
                x: -groundOffset * this.ground.scaleX
            }, {
                duration: 400,
                loop: true,
                delay:500
            });
        },
        initBird: function() {
            this.bird = new game.Bird({
                id: 'bird',
                atlas: this.asset.birdAtlas,
                startX: 100,
                startY: this.height >> 1,
                groundY: this.ground.y - 12
            }).addTo(this.stage, this.ground.depth - 1);
        },
        initHoldbacks: function() {
            this.holdbacks = new game.Holdbacks({
                id: 'holdbacks',
                image: this.asset.holdback,
                height: this.height,
                startX: this.width + 200,
                groundY: this.ground.y
            }).addTo(this.stage, this.ground.depth - 1);
        },
        gameReady() {
            this.bird.getReady();
        },
        onUserInputStart: function(e) {
            this.startTime = +new Date()
            // if (this.state !== 'over' && !this.gameOverScene.contains(e.eventTarget)) {
                //启动游戏场景
                // if (this.state !== 'playing') this.gameStart();
                //控制小鸟往上飞
                // this.bird.startFly();
            // }
        },
        onUserInputEnd: function(e) {
            this.endTime = +new Date()
            var diffTime = this.endTime - this.startTime
            this.bird.startFly(diffTime);
        }
    }
})();
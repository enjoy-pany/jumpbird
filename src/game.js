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
        state: null, // ready: 准备阶段 play:进行中状态 over:游戏结束状态
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
            this.initCurrentScore();
            this.initScenes();

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
            this.bird.on('done', this.flyDone.bind(this));
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
        initCurrentScore() {
            //当前分数
            this.currentScore = new Hilo.BitmapText({
                id: 'score',
                glyphs: this.asset.numberGlyphs,
                textAlign: 'center'
            }).addTo(this.stage);

            //设置当前分数的位置
            this.currentScore.x = this.width - this.currentScore.width >> 1;
            this.currentScore.y = 180;
        },
        initScenes() {
            //结束场景
            this.gameOverScene = new game.OverScene({
                id: 'overScene',
                width: this.width,
                height: this.height,
                image: this.asset.over,
                numberGlyphs: this.asset.numberGlyphs,
                visible: false
            }).addTo(this.stage);
        },
        gameReady() {
            this.state === 'ready'
            this.score = 0;
            this.currentScore.visible = true;
            this.currentScore.setText(this.score);
            this.bird.getReady();
            
        },
        onUserInputStart: function(e) {
            if(this.state === 'play') return
            if(this.state === 'over') {
                this.restartGame();
            }
            this.startTime = +new Date()
            var me = this;
            var base = 1;
            this.inputTimes = setInterval(function(){
                base-=.02;
                if(base < 0.4) return;
                me.bird.scaleX = base;
                me.bird.scaleY = base;
            }, 60)
        },
        onUserInputEnd: function(e) {
            if(this.state === 'play') return
            clearInterval(this.inputTimes);
            Hilo.Tween.to(this.bird, {scaleX:1, scaleY:1}, {time:100});
            this.endTime = +new Date()
            var diffTime = this.endTime - this.startTime;
            this.state = 'play';
            this.bird.startFly(diffTime);
        },
        restartGame() {
            this.gameOverScene.hide();
            this.gameReady();
        },
        gameOver: function() {
                this.state = 'over';
                //显示结束场景
                this.gameOverScene.show();
                // 隐藏分数
                this.currentScore.visible =false;
        },
        flyDone() {
            if(this.holdbacks.collisionTest(this.bird)) {
                var me = this;
                me.score+=1;
                me.currentScore.setText(me.score);
                me.bird.startMove(function(){
                    console.log('ddddd')
                    me.state = 'ready';
                });
                
            }else {
                this.gameOver();
            }
        }
    }
})();
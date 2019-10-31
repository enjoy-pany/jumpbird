(function(ns){

var Holdbacks = ns.Holdbacks = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function(properties) {
        Holdbacks.superclass.constructor.call(this, properties);

         //管子之间的水平间隔
        this.hoseSpacingX = 300;
        this.numHoses = 2;
        //移出屏幕左侧的管子数量，一般设置为管子总数的一半
        this.numOffscreenHoses = this.numHoses * 0.5;
        //管子的宽度（包括管子之间的间隔）
        this.hoseWidth = 148 + this.hoseSpacingX;

        this.createHoses(properties.image);
    },
    numHoses: 0, //管子的总数
    groundY: 0, //地面的y轴坐标
    hoseWidth: 0, //管子的宽度（包括管子之间的间隔）
    createHoses: function(image) {
        for(var i = 0; i < this.numHoses; i++){
            var downHose = new Hilo.Bitmap({
                id: 'down' + i,
                image: image,
                rect: [0, 0, 148, 820],
            }).addTo(this);
            this.placeHose(downHose, i)
        }
        
    },
    placeHose: function(down, index){
        //x轴最大值
        var downMaxX = ns.width - down.width;
        //x轴最小值
        var downMinX = down.width + 150;
        //随机位置
        down.y = 625;
        down.x = (downMinX + (downMaxX - downMinX) * Math.random() >> 0) * index;
        if(index === 1) {
            this.initMoveTween(down.x)
        }
    },
    resetHoses: function() {
        var total = this.children.length;
        //把已移出屏幕外的管子放到队列最后面，并重置它们的位置
        for(var i = 0; i < this.numOffscreenHoses; i++){
            var downHose = this.getChildAt(0);
            this.setChildIndex(downHose, total - 1);
            this.placeHose(downHose, this.numOffscreenHoses + i);
        }
        this.x = 0 // 重置位置
        var downHose2 = this.getChildAt(0);
        downHose2.x = 150

        //更新穿过的管子数量
        // this.passThrough += this.numOffscreenHoses;
    },
    initMoveTween(x) {
        //移动管子
        this.moveTween = ns.moveTween = Hilo.Tween.to(this, {
            x: -(x - 150)
        },{
            duration: 2000,
            loop: false,
            delay:500,
            onComplete: this.resetHoses.bind(this)
        });
        this.moveTween.pause()
    },
    collisionTest(bird) {
        for(var i=0,length=this.children.length;i<length;i++) {
            if(bird.hitTestObject(this.children[i],true)) {
                return true
            }
        }
        return false
    }
})
})(window.game)
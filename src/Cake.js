var Cake = cc.Sprite.extend({
    _scoreValue: 0,

    ctor:function (arg){
        /*if(arg.crop){
            this._super("#"+arg.textureName, arg.crop);
        }
        else {
            //this._super("#"+arg.textureName);
            
        }*/
        this._super("res/Sprites/cakes.png", arg.crop);
        this.setAnchorPoint(cc.p(0.5, 0));
        this._scoreValue = arg.scoreValue;
        this.x = arg.pos.x;
        this.y = arg.pos.y;
        this.winSize = cc.director.getWinSize();
        this.setPosition(cc.p(this.x, this.y));
    },
    getSpeed:function(){
        return constants.INIT_CAKE_TIME * Math.pow(constants.SPEED_UP_RATIO, (this._scoreValue / constants.SPEED_UP_NUM));
    },
    /*
    onEnter:function(arg){
        this._super();
        var speed = this.getSpeed();
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setPosition(cc.p(-this.width / 2, this.winSize.height / 2));
        var actionToRight = cc.MoveTo.create(speed, cc.p(this.winSize.width - this.width / 2, this.winSize.height / 2));
        var actionToLeft = cc.MoveTo.create(speed, cc.p(this.width / 2, this.winSize.height / 2));
        var delay = cc.delayTime(0.1);
        this.action = cc.sequence(actionToRight, delay, actionToLeft).repeatForever();
        this.runAction(this.action);
    }*/
    moveAround:function(){
        var speed = this.getSpeed();
        
        //this.setPosition(cc.p(-this.width / 2, this.winSize.height / 2));
        this.setPosition(cc.p(-this.width / 2, this.y));
        var actionToRight = cc.MoveTo.create(speed, cc.p(this.winSize.width - this.width / 2, this.y));
        var actionToLeft = cc.MoveTo.create(speed, cc.p(this.width / 2, this.y));
        var delay = cc.delayTime(0.1);
        this.action = cc.sequence(actionToRight, delay, actionToLeft).repeatForever();
        this.runAction(this.action);
    }
});
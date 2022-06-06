var MainGame = cc.Layer.extend({
  _scoreValue: 1,
  _prevLeft: 0,
  _prevRight: 0,
  _cakeType: 1,
  _cakeContainer: null,
  _scoreText: null,
  perfect_msg: null,
  //FIXED_CAKE_Y: 0,
  ctor: function () {
    this._super();
    this.init();
    this.addTouchListener();
    //var tmpCake = new Cake({ textureName: "cake" + ((this._scoreValue % constants.CAKE_TYPE_NUM) + 1) + ".png", scoreValue: this._scoreValue, pos:{x: (newXLeft + newXRight) / 2, y: yPos}, crop: cc.rect(0, 0, 100, 50) });
    this.addNewMovingCake();
  },
  init: function () {
    this.winSize = cc.director.getWinSize();
    this._cakeContainer = new cc.Node();
    this.addChild(this._cakeContainer, 1);
    this.initBackGround();
    this.initScoreAndButton();
    cc.spriteFrameCache.addSpriteFrames(res.cakes_plist);
    this.initFirstCake();
    this._prevLeft = (this.winSize.width - this.cake.width) / 2;
    this._prevRight = (this.winSize.width + this.cake.width) / 2;
    this.FIXED_CAKE_Y =
      this.ground_sprite.height +
      constants.TRANSITION_CAKE_NUM * this.cake.height;
  },
  initBackGround: function () {
    this.background_sprite = cc.Sprite.create(res.blue_background_jpg);
    this.background_sprite.setAnchorPoint(cc.p(0.5, 0.5));
    // Scale background to be fixed with screen
    var ratio = Math.max(
      (1.0 * this.winSize.height) / this.background_sprite.height,
      (1.0 * this.winSize.width) / this.background_sprite.width
    );
    this.background_sprite.setPosition(
      cc.p(this.winSize.width / 2, this.winSize.height / 2)
    );
    this.background_sprite.setScale(ratio);
    this.addChild(this.background_sprite, 0);

    // Add the ground
    this.ground_sprite = cc.Sprite.create(res.ground_png);
    this.ground_sprite.setAnchorPoint(cc.p(0.5, 0));
    this.ground_sprite.setPosition(cc.p(this.winSize.width / 2, 0));
    this.ground_sprite.setScaleX(
      (1.0 * this.winSize.width) / this.ground_sprite.width
    );
    this.addChild(this.ground_sprite, 2);
  },
  initScoreAndButton: function () {
    var ls = cc.sys.localStorage;
    // Add score text
    this._scoreText = new cc.LabelTTF("1", "Arial", 50);
    this._scoreText.setColor(cc.color(font.SCORE_COLOR));
    this.addChild(this._scoreText, 1);
    this._scoreText.x = this.winSize.width / 2;
    this._scoreText.y = this.winSize.height - 40;

    // Add high score text
    this._highScoreText = new cc.LabelTTF("" + ls.getItem("high_score"), "Arial", 30);
    this._highScoreText.setColor(cc.color(font.SCORE_COLOR));
    this.addChild(this._highScoreText, 1);
    this._highScoreText.x = 90;
    this._highScoreText.y = this.winSize.height - 40;

    this.cup_sprite = cc.Sprite('#cup.png');
    this.cup_sprite.setAnchorPoint(cc.p(0.5, 0.5));
    this.cup_sprite.width = 50;
    this.cup_sprite.height = 50;
    this.cup_sprite.setPosition(
      cc.p(40, this.winSize.height - 40)
    );
    this.addChild(this.cup_sprite, 1);

    // Add back button
    this.back_button = ccui.Button.create(res.back_button_png);
    this.back_button.setTouchEnabled(true);
    this.back_button.x = this.winSize.width - 40;
    this.back_button.y = this.winSize.height - 40;
    this.back_button.addTouchEventListener(this.goToMenu, this);
    this.addChild(this.back_button, 1);
  },
  goToMenu:function(sender, type){
    switch (type) {
      case ccui.Widget.TOUCH_BEGAN:
        break;
      case ccui.Widget.TOUCH_MOVED:
        break;
      case ccui.Widget.TOUCH_ENDED:
        cc.LoaderScene.preload(
          g_mainmenu,
          function () {
            cc.director.runScene(MenuScene.scene());
          },
          this
        );
        break;
      case ccui.Widget.TOUCH_CANCELLED:
        break;
    }
  },
  initFirstCake: function () {
    // Add first cake
    this.cake = new Cake({
      scoreValue: this._scoreValue,
      pos: { x: this.winSize.width / 2, y: this.ground_sprite.height },
      crop: cc.rect(0, 0, constants.CAKE_WIDTH, constants.CAKE_HEIGHT),
    });
    this._cakeContainer.addChild(this.cake, 1);
  },
  addTouchListener: function () {
    if ("touches" in cc.sys.capabilities)
      cc.eventManager.addListener(
        cc.EventListener.create({
          event: cc.EventListener.TOUCH_ALL_AT_ONCE,
          onTouchesEnded: function (touches, event) {
            if (touches.length <= 0) return;
            var curLayer = event.getCurrentTarget();
            var curCake = event.getCurrentTarget().cake;
            curCake.stopAction(curCake.action);
            curLayer.updateCakePos();
          },
        }),
        this
      );
    else if ("mouse" in cc.sys.capabilities)
      cc.eventManager.addListener(
        {
          event: cc.EventListener.MOUSE,
          onMouseUp: function (event) {
            var curLayer = event.getCurrentTarget();
            var curCake = event.getCurrentTarget().cake;
            curCake.stopAction(curCake.action);
            curLayer.updateCakePos();
          },
        },
        this
      );
  },
  updateCakePos: function () {
    var xLeft = this.cake.x - this.cake.width / 2;
    var xRight = this.cake.x + this.cake.width / 2;
    var yPos = this.calcCakeY();
    if (
      xLeft + constants.MIN_CAKE_PIECE > this._prevRight ||
      xRight - constants.MIN_CAKE_PIECE < this._prevLeft
    ) {
      cc.log("loser");
      cc.audioEngine.playEffect(cc.sys.os == cc.sys.OS_WINDOWS || cc.sys.os == cc.sys.OS_WINRT ? res.shipDestroyEffect_wav : res.shipDestroyEffect_mp3);
      cc.LoaderScene.preload(
        g_mainmenu,
        function () {
          cc.director.runScene(new cc.TransitionFade(0.5, GameOver.scene({scoreValue: this._scoreValue})));
        },
        this
      );
    } else if (Math.abs(xLeft - this._prevLeft) < constants.MIN_CAKE_PIECE) {
      cc.log("Perfect");
      this.showPerfectMsg();
      this.cake.setPosition(
        cc.p((this._prevLeft + this._prevRight) / 2, this.cake.y)
      );
      //this.cake.removeFromParent(false);
      //this._cakeContainer.addChild(this.cake, 1);
      //this._cakeArr.push(this.cake);
      this.prepareForNextLevel();
    } else {
      cc.log("Good");
      this._prevLeft = Math.max(xLeft, this._prevLeft);
      this._prevRight = Math.min(xRight, this._prevRight);
      var tmpCake = new Cake({
        scoreValue: this._scoreValue,
        pos: { x: (this._prevLeft + this._prevRight) / 2, y: yPos },
        crop: cc.rect(
          this._prevLeft - xLeft,
          constants.CAKE_HEIGHT * (this._cakeType - 1),
          this._prevRight - this._prevLeft,
          constants.CAKE_HEIGHT
        ),
      });
      //this._cakeContainer.removeChild(this.cake, true);
      this.cake.setVisible(false);
      //this.cake.removeFromParent(false);
      /*var tmpCake = new cc.Sprite('res/Sprites/cake3.png', cc.rect(0, 0, 50, 50));
        tmpCake.setAnchorPoint(cc.p(0.5, 0));
        tmpCake.setPosition(cc.p((newXLeft + newXRight) / 2, yPos));*/
      this._cakeContainer.addChild(tmpCake, 1);
      this.prepareForNextLevel();
      //this._cakeArr.push(tmpCake);
    }
  },
  showPerfectMsg:function(){
    /*if(!this.perfect_msg){
      this.perfect_msg = cc.Sprite('#perfect.png');
      this.perfect_msg.setAnchorPoint(cc.p(0.5, 0.5));
      //this.perfect_msg.width = 50;
      //this.perfect_msg.height = 50;
      this.perfect_msg.setPosition(
        cc.p(this.winSize.width / 2, this.winSize.height / 2)
      );
      this.addChild(this.perfect_msg, 2);
    }*/
    var perfect_msg = cc.Sprite('#perfect.png');
    perfect_msg.setAnchorPoint(cc.p(0.5, 0.5));
      //this.perfect_msg.width = 50;
      //this.perfect_msg.height = 50;
    perfect_msg.setPosition(cc.p(this.winSize.width / 2, this.winSize.height / 2));
    this.addChild(perfect_msg, 2);
    /*var cake_msg = cc.Sprite('#cake_tower.png');
    cake_msg.setAnchorPoint(cc.p(0.5, 0.5));
      //this.perfect_msg.width = 50;
      //this.perfect_msg.height = 50;
    cake_msg.setPosition(cc.p(this.winSize.width / 2, this.winSize.height / 2));
    cake_msg.setVisible(true);
    this.addChild(cake_msg);*/
    //var animation = new cc.Animation([cake_msg, perfect_msg], 0.5);
    //cake_msg.runAction(cc.animate(animation));
    //var delay = cc.delayTime(10);
    perfect_msg.setVisible(true);
    //var callFunc1 = cc.callFunc(cc.log("1"), this);
    //var callFunc2 = cc.callFunc(cc.log("2"), this);
    //var sequenceAction = cc.sequence(callFunc1, delay, callFunc2);
    //this.runAction(sequenceAction);
    setTimeout(function() {
      //your code to be executed after 1 second
      perfect_msg.setVisible(false);
    }, 300);
    
  },
  prepareForNextLevel: function () {
    cc.audioEngine.playEffect(cc.sys.os == cc.sys.OS_WINDOWS || cc.sys.os == cc.sys.OS_WINRT ? res.fireEffect_wav : res.fireEffect_mp3);
    this._scoreValue++;
    this._scoreText.setString(this._scoreValue);
    if (this._scoreValue > constants.TRANSITION_CAKE_NUM) {
      this.moveCamera();
    }
    this.addNewMovingCake();
  },
  moveCamera: function () {
    var actionBy = cc.MoveBy.create(0.3, cc.p(0, -constants.CAKE_HEIGHT));
    
    this._cakeContainer.runAction(actionBy);
    if(this.ground_sprite.y > -this.ground_sprite.height){
      var actionBy2 = cc.MoveBy.create(0.3, cc.p(0, -constants.CAKE_HEIGHT));
      this.ground_sprite.runAction(actionBy2);
    }
    //this._cakeContainer.y -= constants.CAKE_HEIGHT;
    //this._cakeContainer.removeChild(this._cakeArr.shift(), true);
    //this._cakeContainer.setAnchorPoint(cc.p(0, 1));
    //this._cakeContainer.setPositionY(417 - 70);
  },
  addNewMovingCake: function () {
    this._cakeType = (this._scoreValue % constants.CAKE_TYPE_NUM) + 1;
    //this.cake = new Cake({ scoreValue: this._scoreValue, pos:{x: -this.cake.width / 2, y: this.calcCakeY()}, crop: cc.rect(0, constants.CAKE_HEIGHT * (this._cakeType - 1), constants.CAKE_WIDTH, constants.CAKE_HEIGHT) });
    this.cake = new Cake({
      scoreValue: this._scoreValue,
      pos: { x: -this.cake.width / 2, y: this.calcCakeY() },
      crop: cc.rect(
        0,
        constants.CAKE_HEIGHT * (this._cakeType - 1),
        this._prevRight - this._prevLeft,
        constants.CAKE_HEIGHT
      ),
    });
    this.cake.moveAround();
    //this.addChild(this.cake);
    this._cakeContainer.addChild(this.cake, 1);
    //this._cakeArr.push(this.cake);
  },
  calcCakeY: function () {
    if (this._scoreValue < constants.TRANSITION_CAKE_NUM) {
      return this.ground_sprite.height + this._scoreValue * this.cake.height;
    }
    //return this.FIXED_CAKE_Y;
    return (this._scoreValue + 2) * constants.CAKE_HEIGHT;
  },
});
MainGame.scene = function () {
  var scene = new cc.Scene();
  var layer = new MainGame();
  scene.addChild(layer);
  return scene;
};

var MenuScene = cc.Layer.extend({
  ctor: function () {
    this._super();
    this.init();
  },
  init: function () {
    this.winSize = cc.director.getWinSize();
    cc.spriteFrameCache.addSpriteFrames(res.ui_plist);
    this.initBackground();
    this.initPlayButton();
    this.initGameName();
    this.initHighScore();
    //this.initDialog();
  },
  initBackground: function () {
    this.background_sprite = cc.Sprite("#background.jpg");
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
  },
  initDialog: function () {
    this.dialog_sprite = cc.Sprite.create(res.dialog_png);
    this.dialog_sprite.setAnchorPoint(cc.p(0.6, 0.5));
    // Scale background to be fixed with screen
    this.dialog_sprite.width = this.winSize.width * 0.8;
    this.dialog_sprite.height = this.dialog_sprite.width * 0.75;
    this.dialog_sprite.setPosition(
      cc.p(this.winSize.width / 2, this.winSize.height / 2)
    );
    this.addChild(this.dialog_sprite, 1);
  },
  initPlayButton: function () {
    //this.play_button = ccui.Button.create(res.play_button_png);
    this.play_button = ccui.Button.create(res.play_button_png);
    this.play_button.setTouchEnabled(true);
    this.play_button.x = this.winSize.width / 2.0;
    this.play_button.y = this.winSize.height / 2.0 - 100;
    this.play_button.addTouchEventListener(this.playGame, this);
    this.addChild(this.play_button, 1);
  },
  initGameName: function () {
    this.name_sprite = cc.Sprite("#cake_tower.png");
    this.name_sprite.setAnchorPoint(cc.p(0.5, 0.5));
    //this.dialog_sprite.width = this.winSize.width * 0.8;
    //this.dialog_sprite.height = this.dialog_sprite.width * 0.75;
    this.name_sprite.setPosition(
      cc.p(this.winSize.width / 2, this.winSize.height - 50)
    );
    this.addChild(this.name_sprite, 1);
  },
  playGame: function (sender, type) {
    switch (type) {
      case ccui.Widget.TOUCH_BEGAN:
        break;
      case ccui.Widget.TOUCH_MOVED:
        break;
      case ccui.Widget.TOUCH_ENDED:
        cc.LoaderScene.preload(
          g_mainmenu,
          function () {
            cc.director.runScene(new cc.TransitionFade(0.5,MainGame.scene()));
          },
          this
        );
        break;
      case ccui.Widget.TOUCH_CANCELLED:
        break;
    }
  },
  initHighScore:function(){
    var ls = cc.sys.localStorage;
    if(!ls.getItem("high_score")){
      ls.setItem("high_score", 1);
    }
    this._highScoreText = new cc.LabelTTF("High score: " + ls.getItem("high_score"), "Arial", 30);
    this._highScoreText.setColor(cc.color(font.SCORE_COLOR));
    this.addChild(this._highScoreText, 1);
    this._highScoreText.x = this.winSize.width / 2;
    this._highScoreText.y = this.name_sprite.y - 100;
  }
});
MenuScene.scene = function () {
  var scene = new cc.Scene();
  var layer = new MenuScene();
  scene.addChild(layer);
  return scene;
};

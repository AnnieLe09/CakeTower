var GameOver = cc.Layer.extend({
  _scoreValue: 0,
  ctor: function (arg) {
    this._super();
    //this._scoreValue = arg.scoreValue;
    this.winSize = cc.director.getWinSize();
    this._scoreValue = arg.scoreValue;
    this.init();
  },
  init: function () {
    this.initBackGround();
    this.initText();
    this.initButtons();
  },
  initBackGround: function () {
    this.background_sprite = cc.Sprite.create(res.game_over_background_jpg);
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
  initText: function () {
    this.game_over = cc.Sprite.create(res.game_over_text_png);
    this.game_over.setAnchorPoint(cc.p(0.5, 0.5));
    //this.dialog_sprite.width = this.winSize.width * 0.8;
    //this.dialog_sprite.height = this.dialog_sprite.width * 0.75;
    this.game_over.setPosition(
      cc.p(this.winSize.width / 2, this.winSize.height - 50)
    );
    this.addChild(this.game_over, 1);

    // Add score text
    var ls = cc.sys.localStorage;
    // Add score text
    this._scoreText = new cc.LabelTTF("" + this._scoreValue, "Arial", 50);
    this._scoreText.setColor(cc.color(font.SCORE_COLOR));
    this.addChild(this._scoreText, 1);
    this._scoreText.x = this.winSize.width / 2;
    this._scoreText.y = this.winSize.height - this.game_over.height - 100;

    // Add high score text
    this._highScoreText = new cc.LabelTTF(
      "High score: " + ls.getItem("high_score"),
      "Arial",
      30
    );
    this._highScoreText.setColor(cc.color(font.SCORE_COLOR));
    this.addChild(this._highScoreText, 1);
    this._highScoreText.x = this.winSize.width / 2;
    this._highScoreText.y = this._scoreText.y - 100;

    this._newHighScoreText = new cc.LabelTTF(
      "New high score: " + this._scoreValue,
      "Arial",
      30
    );
    this._newHighScoreText.setColor(cc.color(font.NEW_HIGH_SCORE_COLOR));
    this.addChild(this._newHighScoreText, 1);
    this._newHighScoreText.x = this.winSize.width / 2;
    this._newHighScoreText.y = this._highScoreText.y - 100;
    this._newHighScoreText.setVisible(false);
    if (this._scoreValue > ls.getItem("high_score")) {
      this._newHighScoreText.setVisible(true);
      ls.setItem("high_score", this._scoreValue);
    }
  },
  initButtons: function () {
    this.again_button = ccui.Button.create(res.again_button_png);
    this.again_button.setTouchEnabled(true);
    this.again_button.x = this.winSize.width / 3 + 10;
    this.again_button.y = this._newHighScoreText.y - 100;
    this.again_button.addTouchEventListener(this.playAgain, this);
    this.addChild(this.again_button, 1);

    this.menu_button = ccui.Button.create(res.menu_button_png);
    this.menu_button.setTouchEnabled(true);
    this.menu_button.x = this.winSize.width - this.winSize.width / 3 - 10;
    this.menu_button.y = this._newHighScoreText.y - 100;
    this.menu_button.addTouchEventListener(this.goToMenu, this);
    this.addChild(this.menu_button, 1);
  },
  playAgain: function (pSender, type) {
    switch (type) {
      case ccui.Widget.TOUCH_BEGAN:
        break;
      case ccui.Widget.TOUCH_MOVED:
        break;
      case ccui.Widget.TOUCH_ENDED: {
        cc.LoaderScene.preload(
          g_mainmenu,
          function () {
            cc.director.runScene(new cc.TransitionFade(0.5, MainGame.scene()));
          },
          this
        );
        break;
      }
      case ccui.Widget.TOUCH_CANCELLED:
        break;
    }
  },
  goToMenu: function (pSender, type) {
    switch (type) {
      case ccui.Widget.TOUCH_BEGAN:
        break;
      case ccui.Widget.TOUCH_MOVED:
        break;
      case ccui.Widget.TOUCH_ENDED: {
        cc.LoaderScene.preload(
          g_mainmenu,
          function () {
            cc.director.runScene(new cc.TransitionFade(0.5, MenuScene.scene()));
          },
          this
        );
        break;
      }
      case ccui.Widget.TOUCH_CANCELLED:
        break;
    }
  },
});

GameOver.scene = function (arg) {
  var scene = new cc.Scene();
  var layer = new GameOver(arg);
  scene.addChild(layer);
  return scene;
};

var Shooter = cc.Node.extend({
    vx: -400,
    vy: 400,
    endVector: null,
    ctor: function() {
        this._super();
        this.init();
    },
    init: function(pos) {
        this._super();
        this.scheduleUpdate();
        this.pos = pos || {x: 305, y: 500};
        this.initMouse();
        this.winsize = cc.director.getWinSize();

        this.drawGun();
        var sprite = new cc.PhysicsSprite();
        sprite.initWithFile(res.projectile);
        // sprite.setPosition(cc.p(this.pos.x, this.pos.y));
        // sprite.body.setPos(cp.v(this.pos.x, this.pos.y));
        sprite.color = cc.color(255, 0, 0);
        // this.addChild(sprite);
    },
    initMouse: function() {
        var that = this;

        if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function(event) {
                    var start = cc.p(this.winsize.width / 2, 20);
                    var end = cc.p(event.getLocationX(), event.getLocationY());

                    if (this.laser) {
                        this.removeChild(this.laser);
                    }

                    this.laser = new cc.DrawNode();
                    this.laser.drawSegment(start, end, 15, cc.color(255, 0, 0));
                    this.addChild(this.laser);
                }.bind(this)
            }, this);
    },
    drawGun: function() {
        this.drawNode = new cc.DrawNode();
        this.drawNode.drawDot(cc.p(this.winsize.width / 2, 20), 10, cc.color(255, 0, 0));
        this.addChild(this.drawNode);

    },
    update: function() {
        this.drawNode
    }
});

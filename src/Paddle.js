var Paddle = cc.Node.extend({
    name: 'Paddle',
    ctor: function(leftOrRight) {
        this._super();
        this.leftOrRight = leftOrRight || 'left';
        this.pos = {x: 305, y: 500};

        this.init();
    },
    init: function() {
        this._super();
        this.winsize = cc.director.getWinSize();
        this.scheduleUpdate();
        // this.pos = pos || {x: 305, y: 500};
        // this.initMouse();
        // this.initKeyboard();
        this.drawPaddle();
        var sprite = new cc.PhysicsSprite();
        // sprite.body = Space.addBody(new cp.Body(1, cp.momentForSegment(1, cp.v(100, 100), cp.v(300, 300))));
        sprite.body = new cp.StaticBody();
        // sprite.initWithFile(res.projectile);
        // sprite.setPosition(cc.p(this.pos.x, this.pos.y));
        // sprite.body.setPos(cp.v(this.pos.x, this.pos.y));
        sprite.shape = Space
            .addStaticShape(new cp.SegmentShape(sprite.body,  cp.v(0, 100), cp.v(this.winsize.width - 50, 20), 10));
        sprite.body.setPos(cp.v(this.pos.x, this.pos.y));
        sprite.color = cc.color(255, 0, 0);
        sprite.shape.setCollisionType(SEGMENT_TYPE);
        this.addChild(sprite);
        // var debugNode = new cc.PhysicsDebugNode(Space);
        // debugNode.visible = true;
        // this.addChild(debugNode);
    },
    drawPaddle: function() {
        this.drawNode = new cc.DrawNode();
        this.drawNode.drawSegment(cp.v(0, 100), cp.v(this.winsize.width - 50, 20), 10, cc.color(255, 0, 255));
        this.addChild(this.drawNode);

    },
    updateLaser: function(event) {
        var start = cc.p(this.winsize.width / 2, 40);
        var end = cc.p(event.getLocationX(), event.getLocationY());

        if (this.laser) {
            this.removeChild(this.laser);
        }

        this.laser = new cc.DrawNode();
        this.laser.drawSegment(start, end, 10, cc.color(255, 0, 0));
        this.addChild(this.laser);
    },
    update: function(dt) {
        // console.log('updateingin shooter');
        // this.projectile.sprite
        //     .body
        //     .setVel(cp.v(this.projectile.vx, this.projectile.vy));

        // cc.log('[Bullets] this.projectile.vx: ', this.projectile.vx);
        // cc.log('[Bullets] this.projectile.vy: ', this.projectile.vy);

        Space.step(dt);
        // this.drawNode
    }
});

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
        this.winsize = cc.director.getWinSize();

        this.projectile = new Projectile(cc.p(this.winsize.width / 2, 20));
        // this.projectile.sprite.shape.setCollisionType(1000);

        this.scheduleUpdate();
        // this.pos = pos || {x: 305, y: 500};
        this.initMouse();

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
                // onMouseMove: this.updateLaser.bind(this),
                onMouseDown: function(event) {
                    cc.log('Mouse Down ?');

                    // if (this.projectile) {
                    //     this.removeChild(this.projectile);
                    // }
                    var proj = new Projectile({
                        x: this.winsize.width / 2,
                        y: 20
                    });

                    proj.start = cp.v(this.winsize.width / 2, 20);
                    proj.end = cp.v(event.getLocationX(), event.getLocationY());
                    var distance = cp.v.dist(proj.start, proj.end);
                    cc.log('distance: ', distance);

                    // cc.log('proj.end.x: ', proj.end.x);
                    proj.speed = 50;
                    proj.vx = (proj.end.x - proj.start.x);
                    proj.vy = (proj.end.y - proj.start.y);
                    // proj.sprite.shape.setCollisionType(NULL);
                    // proj.vx = event.getLocationX();
                    // proj.vy = event.getLocationY();
                    cc.log('proj.vx: ', proj.vx);
                    cc.log('proj.vy: ', proj.vy);
                    this.addChild(proj);
                    proj.sprite
                        .body
                        .setVel(cp.v(proj.vx, proj.vy));

                    this.projectile = proj;
                }.bind(this)
            }, this);
    },
    drawGun: function() {
        this.drawNode = new cc.DrawNode();
        this.drawNode.drawDot(cc.p(this.winsize.width / 2, 20), 10, cc.color(0, 0, 255));
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
        // cc.log('updateingin shooter');
        this.projectile.sprite
            .body
            .setVel(cp.v(this.projectile.vx, this.projectile.vy));

        // cc.log('[Bullets] this.projectile.vx: ', this.projectile.vx);
        // cc.log('[Bullets] this.projectile.vy: ', this.projectile.vy);

        Space.step(dt);
        // this.drawNode
    }
});

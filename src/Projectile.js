var Projectile = cc.Node.extend({
    vx: -400,
    vy: 400,
    ctor: function(pos) {
        this._super();

        this.pos = pos || {x: 305, y: 500};
        this.name = 'Projectile';
        // this.scheduleUpdate();

        var sprite = new cc.PhysicsSprite();
        // var sprite = new cc.Sprite();
        sprite.initWithFile(res.projectile);
        // sprite.body = Space.addBody(new cp.Body(100, Infinity));
        sprite.body = Space.addBody(new cp.Body(1, cp.momentForCircle(1, sprite.getContentSize().width, sprite.getContentSize().height, cp.vzero)));
        // // sprite.body = cp.StaticBody();
        sprite.body.setPos(cp.v(this.pos.x, this.pos.y));

        // Circular dependency
        sprite.body.sprite = sprite;

        sprite.shape = Space
            .addShape(new cp.CircleShape(sprite.body, sprite.getContentSize().width / 4, cp.vzero));
        sprite.setScale(.5);
        sprite.shape.layers = PROJECTILE_TYPE;
        sprite.shape.group = PROJECTILE_TYPE;

        this.sprite = sprite;
        this.addChild(sprite);
        this.sprite = sprite;

    },
    setAfterWallCollision: function(px, py, vx, vy) {
        this.sprite.setPosition(px, py);
        this.sprite.body.setPos(cp.v(px, py));
        this.vy = vy;
        this.vx = vx;
    }
});

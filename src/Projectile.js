var Projectile = cc.Node.extend({
    vx: -600,
    vy: 1200,
    ctor: function(pos) {
        this._super();

        this.pos = pos || {x: 305, y: 650};
        this.name = 'Projectile';
        this.scheduleUpdate();

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

        this.sprite = sprite;
        this.addChild(sprite);
        this.sprite = sprite;

    },
    /**
     * Overriden velocity_func
     * @param  {cp.Vect} gravity
     * @param  {Number} damping
     * @param  {Number} dt
     */
    updateProjectileVel: function (body, gravity, damping, dt) {
        debugger;
        gravity = cp.v(0, 0);
        damping = 1;
        var clamp = function(f, minv, maxv) {
            return Math.min(Math.max(f, minv), maxv);
        };
        //this.v = vclamp(vadd(vmult(this.v, damping), vmult(vadd(gravity, vmult(this.f, this.m_inv)), dt)), this.v_limit);
        var vx = body.vx * damping + (body.f.x * body.m_inv) * dt;
        var vy = body.vy * damping + (body.f.y * body.m_inv) * dt;

        //var v = vclamp(new Vect(vx, vy), body.v_limit);
        //body.vx = v.x; body.vy = v.y;
        var v_limit = body.v_limit;
        var lensq = vx * vx + vy * vy;
        var scale = (lensq > v_limit*v_limit) ? v_limit / Math.sqrt(lensq) : 1;
        body.vx = vx * scale;
        body.vy = vy * scale;

        var w_limit = body.w_limit;
        body.w = clamp(body.w*damping + body.t*body.i_inv*dt, -w_limit, w_limit);

        // body.sanityCheck();
    },
    setAfterWallCollision: function(px, py, vx, vy) {
        this.sprite.setPosition(px, py);
        this.sprite.body.setPos(cp.v(px, py));
        this.vy = vy;
        this.vx = vx;
    },
    update: function(dt) {
        // this.sprite.body.setAngVel(1000000);
        // this.w = 1000

        // Space.step(dt);
        // console.log(dt);
        // var currentPos = this.sprite.body.getPos();
        // console.log(this.sprite.body.getPos());
        // this.sprite.body.setVel(cp.v(0, 0));
        // this.sprite.body.setPos(cp.v(currentPos.x + 100 * dt, currentPos.y));
        // this.updateProjectileVel(this.sprite.body, 0, 1, dt)

    }
});

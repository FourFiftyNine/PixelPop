var Projectile = cc.Node.extend({
    ctor: function(pos) {
        this._super();

        this.pos = pos || {x: 100, y: 500};
        this.name = 'PixelSprite';
        // this.speed = .5;
        this.vx = 20;
        this.vy = -30;

        this.scheduleUpdate();
        console.log('after3');

        // ngs = no gravity space
        // Space = new cp.Space();
        // Space.iterations = 5;
        // Space.gravity = cp.v(0, 0);

        // var sprite = new cc.PhysicsSprite();
        var sprite = new cc.Sprite();
        sprite.initWithFile(res.projectile);
        // sprite.body = Space.addBody(new cp.Body(Infinity, Infinity));
        // // sprite.body = cp.StaticBody();
        // sprite.body.setPos(cp.v(this.pos.x, this.pos.y));
        sprite.setPosition(this.pos.x, this.pos.y);
        // sprite.setPosition(this.pos.x, this.pos.y);

        // sprite.shape = Space
        //     .addShape(new cp.CircleShape(sprite.body, sprite.getContentSize().width /  4, cp.vzero));
        // sprite.shape.setElasticity(0.2);
        // sprite.shape.setFriction(0.8);

        sprite.color = cc.color(255, 255, 255);
        sprite.setScale(.5);

        this.sprite = sprite;

        // console.log('this.sprite.body: ', this.sprite.body);
        // this.sprite.body.velocity_func = this.updateProjectileVel;
        // console.log('this.sprite.body.eachShape(): ', this.sprite.body.eachShape());
        // this.sprite.body.eachShape(function() {
        //     console.log('hassssss');
        // })
        // this.sprite.body.updateVelocity = function() {
        //     console.log('updating');
        // }
        // this.sprite.body.velocity_func = function (gravity, damping, dt) {
        //     gravity = cp.v(0, 0);
        //     damping = 1;
        //     // console.log('test');
        //     var clamp = function(f, minv, maxv) {
        //         return Math.min(Math.max(f, minv), maxv);
        //     };
        //     //this.v = vclamp(vadd(vmult(this.v, damping), vmult(vadd(gravity, vmult(this.f, this.m_inv)), dt)), this.v_limit);
        //     var vx = this.vx * damping + (this.f.x * this.m_inv) * dt;
        //     var vy = this.vy * damping + (this.f.y * this.m_inv) * dt;

        //     //var v = vclamp(new Vect(vx, vy), this.v_limit);
        //     //this.vx = v.x; this.vy = v.y;
        //     var v_limit = this.v_limit;
        //     var lensq = vx * vx + vy * vy;
        //     var scale = (lensq > v_limit*v_limit) ? v_limit / Math.sqrt(lensq) : 1;
        //     this.vx = vx * scale;
        //     this.vy = vy * scale;

        //     var w_limit = this.w_limit;
        //     this.w = clamp(this.w*damping + this.t*this.i_inv*dt, -w_limit, w_limit);

        //     this.sanityCheck();
        // };

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
    update: function(dt) {
        this.body.applyForce(cc.v(100, 100), cp.vzero)
        // Space.step(dt);
        // console.log(dt);
        // var currentPos = this.sprite.body.getPos();
        // console.log(this.sprite.body.getPos());
        // this.sprite.body.setVel(cp.v(0, 0));
        // this.sprite.body.setPos(cp.v(currentPos.x + 100 * dt, currentPos.y));
        // this.updateProjectileVel(this.sprite.body, 0, 1, dt)

    }
});

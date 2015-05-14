var PixelBlock = cc.PhysicsSprite.extend({
    ctor: function(pos, isStatic, mass, elasticity, friction) {
        var filename = res.PixelBlock_png;
        this.pos = pos;
        this.name = 'PixelBlock';
        this._super();
        this.initWithFile(filename);
        this.mass = mass || 1;

        if (isStatic) {
            this.body = new cp.StaticBody();
            // Circular reference
            this.body.sprite = this;
            this.body.setPos(cp.v(this.pos.x, this.pos.y));
            this.shape = Space.addStaticShape(new cp.BoxShape(this.body, this.getContentSize().width + 2, this.getContentSize().height + 2));
            this.shape.group = 0;
            this.shape.layers = BLOCK_TYPE;

        } else {
            this.body = Space.addBody(new cp.Body(this.mass, cp.momentForCircle(this.mass, this.getContentSize().width, this.getContentSize().height, cp.vzero)));

            this.body.setPos(cp.v(this.pos.x, this.pos.y));
            this.shape = Space.addShape(new cp.CircleShape(this.body, this.getContentSize().width / 2, cp.vzero));
            this.shape.setElasticity(1);
            this.shape.setFriction(friction || 0.8);
        }
        this.setCollisionRect();
    },
    setCollisionRect: function() {
        var shapeBB = this.shape.getBB();
        var width = shapeBB.r - shapeBB.l;
        var height = width;
        this.collisionRect = cc.rect(shapeBB.l, shapeBB.b, width, height);
    },
    setStatic: function() {

        var x = this.body.getPos().x;
        var y = this.body.getPos().y;
        this.body = new cp.StaticBody();
        this.body.setPos(cp.v(x, y));
        Space.removeShape(this.shape);
        this.shape = Space.addStaticShape(new cp.CircleShape(this.body, this.getContentSize().width / 2, cp.vzero));
    },
    removeStatic: function() {
        var x = this.body.getPos().x;
        var y = this.body.getPos().y;
        this.body = Space.addBody(new cp.Body(this.mass, cp.momentForBox(this.mass, this.getContentSize().width, this.getContentSize().height)));
        this.body.setPos(cp.v(x, y));
        Space.removeStaticShape(this.shape);
        this.shape = Space.addShape(new cp.BoxShape(this.body, this.getContentSize().width + 2, this.getContentSize().height + 2));
        this.shape.setSensor(true);
    }
});

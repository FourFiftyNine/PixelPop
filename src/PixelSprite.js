var PixelSprite = cc.PhysicsSprite.extend({
    ctor: function(pos, isStatic, mass, elasticity, friction) {
        var filename = res.pixel;
        this.pos = pos;
        this.name = 'PixelSprite';

        this._super();
        this.initWithFile(filename);
        this.mass = mass || 1;


        if (isStatic) {
            this.body = new cp.StaticBody();
            // Circular reference
            this.body.sprite = this;
            this.body.setPos(cp.v(this.pos.x, this.pos.y));
            this.shape = Space.addStaticShape(new cp.CircleShape(this.body, this.getContentSize().width / 2, cp.vzero));

        } else {
            this.body = Space.addBody(new cp.Body(this.mass, cp.momentForCircle(this.mass, this.getContentSize().width, this.getContentSize().height, cp.vzero)));
            // Circular reference
            this.body.sprite = this;
            this.body.setPos(cp.v(this.pos.x, this.pos.y));
            this.shape = Space.addShape(new cp.CircleShape(this.body, this.getContentSize().width / 2, cp.vzero));
            this.shape.setElasticity(elasticity || 0.2);
            this.shape.setFriction(friction || 0.8);
        }
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
        this.body = Space.addBody(new cp.Body(this.mass, cp.momentForCircle(this.mass, this.getContentSize().width, this.getContentSize().height, cp.vzero)));
        this.body.setPos(cp.v(x, y));
        Space.removeStaticShape(this.shape);
        this.shape = Space.addShape(new cp.CircleShape(this.body, this.getContentSize().width / 2, cp.vzero));
        this.shape.setSensor(false);
    }
});

var Projectile = cc.Node.extend({
    ctor: function(pos) {
        this._super();

        this.pos = pos || {x: 100, y: 400};
        this.name = 'PixelSprite';
        this.vx = 12;
        this.vy = 10;

        var sprite = new cc.Sprite();
        sprite.initWithFile(res.projectile);
        sprite.setPosition(this.pos.x, this.pos.y);
        sprite.color = cc.color(255, 255, 255);
        sprite.setScale(.5);
        this.sprite = sprite;
        this.addChild(sprite);

    },
    getVelocityBoundingBox: function() {
        var rect = cc.rect(0, 0, this.sprite.getContentSize().width + Math.abs(this.vx), this.sprite.getContentSize().height + Math.abs(this.vy));
        return cc._rectApplyAffineTransformIn(rect, this.sprite.getNodeToParentTransform());
    }
});

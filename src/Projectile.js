var Projectile = cc.Node.extend({
    ctor: function(pos) {
        this._super();

        this.pos = pos || {x: 100, y: 500};
        this.name = 'PixelSprite';
        this.vx = 11;
        this.vy = -20;

        var sprite = new cc.Sprite();
        sprite.initWithFile(res.projectile);
        sprite.setPosition(this.pos.x, this.pos.y);
        sprite.color = cc.color(255, 255, 255);
        sprite.setScale(.5);
        this.sprite = sprite;
        this.addChild(sprite);

    }
});

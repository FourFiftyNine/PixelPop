function testSprites() {
    var count = 1;
    var maxCount = num || 250;
    var interval = setInterval(function () {
        if (count === maxCount) {
            clearInterval(interval);
        }
        var r = 255 - count;
        var g = 255 - 2 * count;
        var b = 255 - 3 * count;
        var isStatic;
        // cc.log(r);

        if (count == 3 ) {
            var sprite = new PixelSprite({x: 500, y: 500}, false);
            // sprite.setStatic();
            // sprite.color = cc.color(255, g, b);
            setTimeout(function() {
                sprite.setStatic();
                // var debugNode = new cc.PhysicsDebugNode(Space);
                // debugNode.visible = true;
                // this.addChild(debugNode);

            }.bind(this), num * 9.8);
        } else {
            var xOffset = (count % 2) ? -(5) : 5;
            var sprite = new PixelSprite({x: 500 + xOffset, y: 500}, false);
            sprite.color = cc.color(r, g, b);
        }
        // if (isStatic) {
        //     cc.log('isStatic');

        //     var sprite = new PixelSprite({x: 200, y: 500}, false);
        //     sprite.color = cc.color(r, g, b);
        //     sprite.color = cc.color(r, 0, 0);

        //     sprite.setStatic();
        // }

        var rwallBB = this.rwall.getBB();
        var rwallRect = cc.rect(rwallBB.l, rwallBB.b, 10, rwallBB.t);
        // cc.log('rwallRect: ', rwallRect);

        var lwallBB = this.lwall.getBB();
        var lwallRect = cc.rect(lwallBB.r, lwallBB.b, 10, lwallBB.t);
        // cc.log('lwallRect: ', lwallRect);

        var floor = this.floor.getBB();
        var floorRect = cc.rect(floor.l, floor.b + 40, floor.r, 2);
        // cc.log('floorRect: ', floorRect);

        var ceilingBB = this.ceiling.getBB();
        var ceilingRect = cc.rect(ceilingBB.l, ceilingBB.t - 40, ceilingBB.r, 2);
        // cc.log('ceilingRect: ', ceilingRect);

        this.addChild(sprite);
        count++;
    }.bind(this), 10);
}
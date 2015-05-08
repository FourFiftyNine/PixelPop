var MyLayer = cc.LayerColor.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,
    init: function() {
        this._super(cc.color(42, 42, 42, 255));
        this.setBoundries(Space);
        this.scheduleUpdate();
        // this.testSprites(220);
        this.loadLevel(res.Level1_json);
        this.projectile = new Projectile();

        this.addChild(this.projectile);



        // console.log('this.projectile.sprite.getBoundingBox(): ', this.projectile.sprite.getBoundingBox());
        // console.log('this.projectile.sprite.getPosition(): ', this.projectile.sprite.getPosition());
        // console.log('haha2')
        // Space.setDefaultCollisionHandler(function(arb) {
        //     console.log('arb: ', arb);
        //     // console.log('projectile: ', projectile);
        //     console.log('arb.a: ', arb.a);
        //     var vx = arb.a.body.vx;
        //     var vy = arb.a.body.vy;
        //     console.log('vx: ', vx);
        //     arb.a.body.setVel(cp.v(vx * -1, vy));
        //     // console.log('a: ', a);
        //     // console.log('b: ', b);
        //     // console.log('c: ', c);
        //     // console.log('ajjajaja');

        //     return true;
        // })


    },
    loadLevel: function(resourceJson) {
        var level1 = ccs.load(resourceJson);
        var pixels = level1.node.getChildren();
        var sprites = [];
        for (var i = 0; i < pixels.length; i++) {
            var sprite = new PixelSprite({x: pixels[i].x, y: pixels[i].y}, true);
            sprite.color = pixels[i].color;
            sprites.push(sprite);
            this.addChild(sprite);
        }

        function fuckWithLevel() {
            setTimeout(function() {
                for (var i = 0; i < sprites.length; i++) {
                    sprites[i].removeStatic();
                }
                // setTimeout(function() {
                //     sprites[10].setStatic();
                //     sprites[40].setStatic();
                //     sprites[50].setStatic();
                //     sprites[60].setStatic();
                //     sprites[60].setStatic();
                // }.bind(this), 1200)
            }.bind(this), 1000);
        }

        // fuckWithLevel();
    },
    setBoundries: function (space) {
        var thickness = 20;
        //this.setTouchEnabled(true);
        //add floor
        var winWidth = cc.director.getWinSize().width;
        var winHeight = cc.director.getWinSize().height;

        var floor = Space.addShape(
            new cp.SegmentShape(
                Space.staticBody,
                cp.v(0, 0 - thickness),
                cp.v(winWidth, 0 - thickness),
                thickness
            ));

        var lwall = Space.addShape(
            new cp.SegmentShape(
                Space.staticBody,
                cp.v(0 - thickness, winHeight),
                cp.v(0 - thickness, 0), thickness
            ));

        var rwall = Space.addShape(
            new cp.SegmentShape(
                Space.staticBody,
                cp.v(winWidth + thickness, 0),
                cp.v(winWidth + thickness, winHeight), thickness
            ));

        var ceiling = Space.addShape(
            new cp.SegmentShape(
                Space.staticBody,
                cp.v(0, winHeight + thickness),
                cp.v(winWidth, winHeight + thickness),
                thickness
            ));

        floor.setElasticity(1);
        floor.setFriction(1);
        lwall.setElasticity(1);
        lwall.setFriction(1);
        rwall.setElasticity(1);
        rwall.setFriction(1);
        ceiling.setElasticity(1);
        ceiling.setFriction(1);

        this.lwall = lwall;
        this.rwall = rwall;
        this.floor = floor;
        this.ceiling = ceiling;
        // var debugNode = new cc.PhysicsDebugNode(Space);
        // debugNode.visible = true;
        // this.addChild(debugNode);

        var rwallBB = this.rwall.getBB();
        // console.log('rwallBB: ', rwallBB);
        var rwallRect = cc.rect(rwallBB.l, rwallBB.b, 10, rwallBB.t);
        // console.log('rwallRect: ', rwallRect);

        var lwallBB = this.lwall.getBB();
        // console.log('lwallBB ' , lwallBB);
        var lwallRect = cc.rect(lwallBB.r, lwallBB.b, 10, lwallBB.t);
        // console.log('lwallRect: ', lwallRect);

        var floor = this.floor.getBB();
        // console.log('floor ' , floor);
        var floorRect = cc.rect(floor.l, floor.b + 40, floor.r, 2);
        // console.log('floorRect: ', floorRect);

        var ceilingBB = this.ceiling.getBB();
        // console.log('ceilingBB ' , ceilingBB);
        var ceilingRect = cc.rect(ceilingBB.l, ceilingBB.t - 40, ceilingBB.r, 2);
        // console.log('ceilingRect: ', ceilingRect);
        this.setWallCollisions();
    },
    testSprites: function(num) {
        var count = 1;
        var maxCount = num || 250;
        var interval = setInterval(function () {
            if (count == maxCount) {
                clearInterval(interval);
            }
            var r = 255 - count;
            var g = 255 - 2 * count;
            var b = 255 - 3 * count;
            var isStatic;
            // console.log(r);

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
            //     console.log('isStatic');

            //     var sprite = new PixelSprite({x: 200, y: 500}, false);
            //     sprite.color = cc.color(r, g, b);
            //     sprite.color = cc.color(r, 0, 0);

            //     sprite.setStatic();
            // }

            var rwallBB = this.rwall.getBB();
            var rwallRect = cc.rect(rwallBB.l, rwallBB.b, 10, rwallBB.t);
            console.log('rwallRect: ', rwallRect);

            var lwallBB = this.lwall.getBB();
            var lwallRect = cc.rect(lwallBB.r, lwallBB.b, 10, lwallBB.t);
            console.log('lwallRect: ', lwallRect);

            var floor = this.floor.getBB();
            var floorRect = cc.rect(floor.l, floor.b + 40, floor.r, 2);
            console.log('floorRect: ', floorRect);

            var ceilingBB = this.ceiling.getBB();
            var ceilingRect = cc.rect(ceilingBB.l, ceilingBB.t - 40, ceilingBB.r, 2);
            console.log('ceilingRect: ', ceilingRect);

            this.addChild(sprite);
            count++;
        }.bind(this), 10);
    },
    setWallCollisions: function() {
        var rwallBB = this.rwall.getBB();
        this.rwallRect = cc.rect(rwallBB.l, rwallBB.b, 50, rwallBB.t);
        // console.log('rwallRect: ', rwallRect);
 
        var lwallBB = this.lwall.getBB();
        this.lwallRect = cc.rect(lwallBB.r, lwallBB.b, 10, lwallBB.t);
        // console.log('lwallRect: ', lwallRect);

        var floor = this.floor.getBB();
        this.floorRect = cc.rect(floor.l, floor.b + 30, floor.r, 20);
        // console.log('floorRect: ', floorRect);

        var ceilingBB = this.ceiling.getBB();
        this.ceilingRect = cc.rect(ceilingBB.l, ceilingBB.t - 50, ceilingBB.r, 20);

    },
    checkWallCollisions: function() {
        if (cc.rectIntersectsRect(this.projectile.sprite.getBoundingBox(), this.rwallRect)) {
            this.projectile.vx *= -1;
        }

        if (cc.rectIntersectsRect(this.projectile.sprite.getBoundingBox(), this.lwallRect)) {
            this.projectile.vx *= -1;
        }

        if (cc.rectIntersectsRect(this.projectile.sprite.getBoundingBox(), this.floorRect)) {
            this.projectile.vy *= -1;
        }

        if (cc.rectIntersectsRect(this.projectile.sprite.getBoundingBox(), this.ceilingRect)) {
            this.projectile.vy *= -1;
        }
    },
    update:function(dt){
        var curPos = this.projectile.sprite.getPosition();

        this.projectile.sprite.setPosition(curPos.x + this.projectile.vx, curPos.y + this.projectile.vy);
        this.checkWallCollisions();
        Space.step(dt);
    }
});

var HelloWorldScene = cc.Scene.extend({
    init: function() {
        // console.log('init');
    },
    onEnter:function () {
        console.log('onEnter123')
        this._super();
        console.log('onEnter22')
        var layer = new MyLayer();
        console.log('onEnter333')
        this.addChild(layer);
        console.log('onEnter443')
        layer.init();
    }
});
var MyLayer = cc.LayerColor.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,
    init: function() {
        this.projectile = new Projectile();
        this._super(cc.color(42, 42, 42, 255));
        this.setBoundries(Space);
        this.projectile.sprite.shape.setCollisionType(PROJECTILE_TYPE);
        this.ceiling.setCollisionType(WALL_TYPE);
        this.floor.setCollisionType(WALL_TYPE);
        this.rwall.setCollisionType(WALL_TYPE);
        this.lwall.setCollisionType(WALL_TYPE);
        this.blockLevel(res.Level1_json);
        this.projvy = 950;
        this.projvx = 320;
        this.removeEntitites = [];
        this.blockRemovalQueued = false;
        this.scheduleUpdate();


        // Space.setDefaultCollisionHandler(function(arb) {
        //     // cc.log('Space.setDefaultCollisionHandler: ', setDefaultCollisionHandler);
        // });

        this.blockCollisionHandler();
        // Wall Collision
        Space.addCollisionHandler(PROJECTILE_TYPE, WALL_TYPE, this.wallCollisionBegin.bind(this), null, null, null);

        // this.testSprites(220);
        // cc.log('this.projectile.sprite.getBoundingBox(): ', this.projectile.sprite.getBoundingBox());

        this.addChild(this.projectile);
        var debugNode = new cc.PhysicsDebugNode(Space);
        debugNode.visible = true;
        this.addChild(debugNode);
    },
    wallCollisionBegin: function(arb) {
        var n = arb.getNormal(0);
        if (Math.abs(n.y) > 0.7071) {
            if (Math.abs(n.y) >= 0) {
                // cc.log('up');
                // cc.log('this.projvy: ', this.projvy);
                    this.projvy *= -1;
                    // debugger;
            }
            // if (n.y <= 0) {
            //     cc.log('down');
            //         this.projvy *= -1;
            // }
        } else {
            if (Math.abs(n.x) >= 0) {
                // cc.log('right');
                    this.projvx *= -1;

            }
            // if (n.x <= 0) {
            //     cc.log('left');
            //         this.projvx *= -1;

            // }
        }
        return true;
    },
    postStepRemoveBlock: function(shapeToRemove) {
        cc.log('arguments: ', arguments);
        cc.log('postStepRemoveBlock');
        cc.log('shapeToRemove: ', shapeToRemove);
        shapeToRemove.body.sprite.removeStatic();
        // shapeToRemove.setSensor(true);
        // Space.removeBody(shapeToRemove.body);
        // debugger;
        // Space.removeShape(shapeToRemove);
        this.blockRemovalQueued = false;
        // debugger;
        // if (this.removeEntitites.length) {
        //     for (var i = 0; i < this.removeEntitites.length; i++) {
        //         cc.log(
        //             'this.removeEntitites[i]: ',
        //             this.removeEntitites[i]
        //         );

        //         Space.removeBody(this.removeEntitites[i].shape.body);
        //         Space.removeShape(this.removeEntitites[i].shape);
        //         // delete this.removeEntitites[i];
        //     };
        //     debugger;
        // }
    },
    blockCollisionHandler: function() {
        Space.addCollisionHandler(PROJECTILE_TYPE, BLOCK_TYPE,
            function begin(arbiter, space) {
                var normal = arbiter.getNormal(0);
                cc.log('arbiter.getShapes(): ', arbiter.getShapes());
                cc.log('[Block Collision] begin()---------------------');
                cc.log('[Block Collision] begin: arbiter: ', arbiter);
                cc.log('[Block Collision] begin: space: ', space);
                cc.log('[Block Collision] begin: normal: ', normal);
                cc.log('[Block Collision] this.blockRemovalQueued: ', this.blockRemovalQueued);
                // this.removeEntitites.push({
                //     shape: arbiter.b,
                //     body: arbiter.body_b
                // });
                //
                if (this.blockRemovalQueued === true) {
                    return false;
                }

                if (Math.abs(normal.y) === 1) {
                    this.projvy *= -1;
                    cc.log('[Block Collision] begin: normal.y is 1: ', normal.y);
                    Space.addPostStepCallback(this.postStepRemoveBlock.bind(this, arbiter.b));
                    this.blockRemovalQueued = true;
                    // debugger;
                    return false;
                } else if (Math.abs(normal.x) === 1) {
                    this.projvx *= -1;
                    cc.log('[Block Collision] begin: normal.x is 1: ', normal.x);
                    Space.addPostStepCallback(this.postStepRemoveBlock.bind(this, arbiter.b));
                    this.blockRemovalQueued = true;
                    // debugger;

                    return false;
                }
                return true;
                debugger;

                // debugger;
                // artbi
                // cc.log('n: ', n);
                if (normal.y === 1) {
                    cc.log('[Block Collision] begin: normal.y is 1: ', normal.y);
                }
                // if (Math.abs(n.y) > 0.7071) {
                if (Math.abs(normal.y) >= 0) {
                    this.projvy *= -1;
                    cc.log('[Block Collision: change y velocity]: ', this.projvy);
                    // return false;

                    // if (normal.y <= 0) {
                    //     cc.log('down');
                    //         this.projvy *= -1;

                    // }
                } else {
                    if (Math.abs(normal.x) >= 0) {
                        // cc.log('right');
                            this.projvx *= -1;

                    }
                    // if (normal.x <= 0) {
                    //     cc.log('left');
                    //         this.projvx *= -1;

                    // }
                }
                return true;

            }.bind(this),
            function preSolve(arb, space) {
                var n = arb.getContactPointSet()[0].normal;
                cc.log('[Block Collision] preSolve(arb, space)');
                cc.log('[Block Collision] preSolve: arb: ', arb);
                cc.log('[Block Collision] preSolve: space: ', space);
                cc.log('[Block Collision] preSolve: arb normal: ', n);
                // debugger;
                return true;
            },
            function postSolve(arb, space) {
                cc.log('[Block Collision] postSolve(arb, space)');
                cc.log('[Block Collision] postSolve: arb: ', arb);
                var n = arb.getContactPointSet()[0].normal;
                cc.log('[Block Collision] postSolve: arb normal: ', n);
                cc.log('[Block Collision] postSolve: space: ', space);
                // debugger;
                return true;
            },
            function separate(arb, space) {
                cc.log('[Block Collision] separate(arb, space)');
                cc.log('[Block Collision] separate: arb: ', arb);
                // var n = arb.getContactPointSet()[0].normal;
                // cc.log('[Block Collision] separate: arb normal: ', n);
                cc.log('[Block Collision] separate: space: ', space);
                // debugger;
                return true;
            }
        );
    },
    blockLevel: function(resourceJson) {
        var level1 = ccs.load(resourceJson);
        var pixels = level1.node.getChildren();
        var sprites = [];
        for (var i = 0; i < pixels.length; i++) {
            var sprite = new PixelSprite({x: pixels[i].x, y: pixels[i].y}, true);
            // var sprite = new PixelBlock({x: 300, y: 400}, true);
            sprite.color = pixels[i].color;
            sprite.shape.setCollisionType(BLOCK_TYPE)
            sprites.push(sprite);
            this.addChild(sprite);
            // break;
        }
        this.pixelBlocks = sprites;
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

        // function fuckWithLevel() {
        //     setTimeout(function() {
        //         for (var i = 0; i < sprites.length; i++) {
        //             sprites[i].removeStatic();
        //         }
        //         // setTimeout(function() {
        //         //     sprites[10].setStatic();
        //         //     sprites[40].setStatic();
        //         //     sprites[50].setStatic();
        //         //     sprites[60].setStatic();
        //         //     sprites[60].setStatic();
        //         // }.bind(this), 1200)
        //     }.bind(this), 1000);
        // }

        // fuckWithLevel();
    },
    setBoundries: function (space) {
        var thickness = 50;
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

        var rwallBB = this.rwall.getBB();
        // cc.log('rwallBB: ', rwallBB);
        var rwallRect = cc.rect(rwallBB.l, rwallBB.b, 10, rwallBB.t);
        // cc.log('rwallRect: ', rwallRect);

        var lwallBB = this.lwall.getBB();
        // cc.log('lwallBB ' , lwallBB);
        var lwallRect = cc.rect(lwallBB.r, lwallBB.b, 10, lwallBB.t);
        // cc.log('lwallRect: ', lwallRect);

        var floorBB = this.floor.getBB();
        // cc.log('floor ' , floor);
        var floorRect = cc.rect(floorBB.l, floorBB.b + 40, floorBB.r, 2);
        // cc.log('floorRect: ', floorRect);

        var ceilingBB = this.ceiling.getBB();
        // cc.log('ceilingBB ' , ceilingBB);
        var ceilingRect = cc.rect(ceilingBB.l, ceilingBB.t - 40, ceilingBB.r, 2);
        // cc.log('ceilingRect: ', ceilingRect);
        this.setWallCollisions();
    },
    testSprites: function(num) {
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
    },
    checkBlockCollisions: function() {
    },
    setWallCollisions: function() {
        var rwallBB = this.rwall.getBB();
        this.rwallRect = cc.rect(rwallBB.l, rwallBB.b, 50, rwallBB.t);
        // cc.log('rwallRect: ', rwallRect);

        var lwallBB = this.lwall.getBB();
        this.lwallRect = cc.rect(lwallBB.r, lwallBB.b, 10, lwallBB.t);
        // cc.log('lwallRect: ', lwallRect);

        var floor = this.floor.getBB();
        this.floorRect = cc.rect(floor.l, floor.b + 30, floor.r, 20);
        // cc.log('floorRect: ', floorRect);

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
        // cc.log('------------UPDATE------------');
        // cc.log('this.projvy: ', this.projvy);
        // arb.a.body.setVel(cp.v(vx, vy * -1));
        this.projectile.sprite.body.setVel(cp.v(this.projvx, this.projvy));
        // var curPos = this.projectile.sprite.getPosition();
        // this.checkBlockCollisions();
        // this.projectile.sprite.setPosition(curPos.x + this.projectile.vx, curPos.y + this.projectile.vy);
        this.checkWallCollisions();
        Space.step(dt);
    }
});

var HelloWorldScene = cc.Scene.extend({
    init: function() {
        // cc.log('init');
    },
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
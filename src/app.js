var MyLayer = cc.LayerColor.extend({
    lastWallCollision: null,
    lastProjectilePos: null,
    init: function() {
        this.projectile = new Projectile();
        this.projectile.sprite.shape.setCollisionType(PROJECTILE_TYPE);
        this.activeProjectiles = [];
        this.activeProjectiles.push(this.projectile);

        this.addChild(this.projectile);

        this._super(cc.color(42, 42, 42, 255));
        this.setBoundries(Space);
        this.ceiling.setCollisionType(WALL_TYPE);
        this.floor.setCollisionType(WALL_TYPE);
        this.rwall.setCollisionType(WALL_TYPE);
        this.lwall.setCollisionType(WALL_TYPE);

        this.blockLevel(res.Level1_json);

        this.removeEntitites = [];
        this.blockRemovalQueued = false;

        this.initMouse();
        // Spatial whatever
        // Space.setDefaultCollisionHandler(function(arb) {
        //     // cc.log('Space.setDefaultCollisionHandler: ', setDefaultCollisionHandler);
        // });

        this.blockCollisionHandler();

        // Wall Collision
        Space.addCollisionHandler(
            PROJECTILE_TYPE,
            WALL_TYPE,
            this.wallCollisionBegin.bind(this),
            null,
            null,
            null
        );

        // var debugNode = new cc.PhysicsDebugNode(Space);
        // debugNode.visible = true;
        // this.addChild(debugNode);

        this.scheduleUpdate();
    },
    // BROKE
    initMouse: function() {
        var that = this;
        if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function(event) {
                    cc.log('click');
                    that.projectile = new Projectile();
                    that.projectile.sprite.shape.setCollisionType(PROJECTILE_TYPE);
                    that.addChild(that.projectile);
                    that.activeProjectiles.push(that.projectile);
                },
                onMouseMove: function(event){
                }
            }, this);
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

                if (this.blockRemovalQueued === true) {
                    console.log('return false');
                    return false;
                }
                console.log('this.lastProjectilePos: ', this.lastProjectilePos);
                cc.log('this.projectile.vx: ', this.projectile.vx);
                cc.log('this.projectile.vy: ', this.projectile.vy);
                console.log('arbiter.getShapes()[0].body.getPos(): ', arbiter.getShapes()[0].body.getPos());
                var normal = arbiter.getNormal(0);
                var drawNode = new cc.DrawNode();
                console.log('normal: ', normal);
                cc.log('arbiter.getShapes()[0]: ', arbiter.getShapes()[0]);
                var center = this.lastProjectilePos;
                var start = cp.v(center.x, center.y)
                var segmentEndX = start.x + this.projectile.vx;
                var segmentEndY = start.y + this.projectile.vy;
                // drawNode.drawSegment(start, cp.v(segmentEndX, segmentEndY), 2, cc.color(255, 0, 255));
                // drawNode.drawDot(start, 2, cc.color(255, 255, 0));
                // console.log('drawNode: ', drawNode);
                // this.addChild(drawNode);
                var firstHitResult = false;
                var collisionNormal;
                space.segmentQuery(start, cp.v(segmentEndX, segmentEndY), -1, 0, function(queryResult, t, n) {
                    if (firstHitResult === false &&
                        queryResult.body.sprite &&
                        queryResult.body.sprite.name === 'PixelBlock') {
                        firstHitResult = queryResult;
                        collisionNormal = n;
                        console.log('firstHitResult: ', firstHitResult);
                        console.log('collisionNormal: ', collisionNormal);
                    }
                });
                if (firstHitResult === false) {
                    return false;
                }
                cc.log('firstHitResult: ', firstHitResult);
                if (firstHitResult.body.sprite) {
                    Space.addPostStepCallback(this.postStepRemoveBlock.bind(this, firstHitResult));
                    this.blockRemovalQueued = true;
                }
                if (collisionNormal.y === -1) {
                    cc.log('bottom of block');
                    this.projectile.vy = -Math.abs(this.projectile.vy);

                }
                if (collisionNormal.y === 1) {
                    cc.log('bottom of top');
                    this.projectile.vy = Math.abs(this.projectile.vy);

                }
                if (collisionNormal.x === 1) {
                    cc.log('right of block');
                    this.projectile.vx = Math.abs(this.projectile.vx);

                }
                if (collisionNormal.x === -1) {
                    cc.log('left of block');
                    this.projectile.vx = -Math.abs(this.projectile.vx);

                }
                // Set point of contact -- not last position
                this.projectile.sprite.setPosition(this.lastProjectilePos);
                this.projectile.sprite.body.setPos(cp.v(this.lastProjectilePos.x, this.lastProjectilePos.y));
                // debugger;
                return false;


                // firstHit.shape.body.sprite.color = cc.color(0, 255, 0);
                // space.segmentQuery(center, cp.v(segmentEndX, segmentEndY), -1, 0, function(a, b) {
                //     if (a.body.sprite) {
                //         a.body.sprite.color = cc.color(0, 255, 0);
                //         console.log('GOT a Sprite');
                //     }
                //     cc.log('param-a: ', a);
                //     cc.log('param-b: ', b);
                // });
                // debugger;
                // return;
                // space.pointQuery(cp.v(70, 990), -1, 0, function(a, b) {
                //     if (a.body.sprite) {
                //         a.body.sprite.color = cc.color(0, 255, 0);
                //         console.log('GOT a Sprite');
                //     }
                //     cc.log('param-a: ', a);
                //     cc.log('param-b: ', b);
                // });
                // cc.log('space.pointQuery(cp.v(100, 100)): ', space.pointQuery(cp.v(30, 30)));
                cc.log('arbiter.getShapes(): ', arbiter.getShapes());
                cc.log('[Block Collision] begin()-------------------------------------');
                cc.log('[Block Collision] begin: arbiter: ', arbiter);
                cc.log('[Block Collision] begin: arbiter.getNormal(0): ', arbiter.getNormal(0));
                cc.log('[Block Collision] begin: arbiter.getDepth(0): ', arbiter.getDepth(0));
                cc.log('[Block Collision] begin: arbiter.stamp: ', arbiter.stamp);
                cc.log('[Block Collision] begin: space: ', space);
                cc.log('[Block Collision] begin: normal: ', normal);
                cc.log('[Block Collision] this.blockRemovalQueued: ', this.
                    blockRemovalQueued);


                if (normal.y === 1) {
                    cc.log('bottom of block');
                    if (this.projectile.vy > 0) {
                        this.projectile.vy = -Math.abs(this.projectile.vy);
                        this.projectile.vx = this.projectile.vx;
                    }
                    if (this.projectile.vx > 0) {
                        cc.log('here');
                        this.projectile.vy = -Math.abs(this.projectile.vy);
                        this.projectile.vx = this.projectile.vx;
                    }

                }

                if (normal.x === 1) {
                    cc.log('right of block');
                    if (this.projectile.vx > 0) {
                        this.projectile.vy = -Math.abs(this.projectile.vy);
                        this.projectile.vx = this.projectile.vx;
                    }
                    if (this.projectile.vx < 0) {
                        this.projectile.vy = -Math.abs(this.projectile.vy);
                        this.projectile.vx = this.projectile.vx;
                    }

                }
                debugger;
                return true;
                // if (normal.x === -1) {
                //     cc.log('left of block');
                //     if (this.projectile.vx < 0) {
                //         this.projectile.vy = Math.abs(this.projectile.vy);
                //         this.projectile.vx = this.projectile.vx;
                //     }
                //     if (this.projectile.vx < 0) {
                //         this.projectile.vy = -Math.abs(this.projectile.vy);
                //         this.projectile.vx = this.projectile.vx;
                //     }

                // }
                if (normal.y === -1) {
                    cc.log('top');

                }
                if (normal.x === 1) {
                    cc.log('left')
                    if (this.projectile.vx < 0) {
                        this.projectile.vy = -Math.abs(this.projectile.vy);
                    }
                }
                if (normal.x === -1) {
                    cc.log('right')

                }
                debugger;
                // this.removeEntitites.push({
                //     shape: arbiter.b,
                //     body: arbiter.body_b
                // });
                //
                // debugger;
                // if (this.blockRemovalQueued === true) {
                //     return false;
                // }



                if (Math.abs(normal.y) === 1) {
                    this.projectile.vy *= -1;
                    cc.log('[Block Collision] begin: normal.y is 1: ', normal.y);
                    Space.addPostStepCallback(this.postStepRemoveBlock.bind(this, arbiter.b));
                    this.blockRemovalQueued = true;
                    // debugger;
                    return false;
                } else if (Math.abs(normal.x) === 1) {
                    this.projectile.vx *= -1;
                    cc.log('[Block Collision] begin: normal.x is 1: ', normal.x);
                    Space.addPostStepCallback(this.postStepRemoveBlock.bind(this, arbiter.b));
                    this.blockRemovalQueued = true;
                    // debugger;

                    return false;
                }
                return true;
                // debugger;

                // debugger;
                // artbi
                // cc.log('n: ', n);
                if (normal.y === 1) {
                    cc.log('[Block Collision] begin: normal.y is 1: ', normal.y);
                }
                // if (Math.abs(n.y) > 0.7071) {
                if (Math.abs(normal.y) >= 0) {
                    this.projectile.vy *= -1;
                    cc.log('[Block Collision: change y velocity]: ', this.projectile.vy);
                    // return false;

                    // if (normal.y <= 0) {
                    //     cc.log('down');
                    //         this.projectile.vy *= -1;

                    // }
                } else {
                    if (Math.abs(normal.x) >= 0) {
                        // cc.log('right');
                            this.projectile.vx *= -1;

                    }
                    // if (normal.x <= 0) {
                    //     cc.log('left');
                    //         this.projectile.vx *= -1;

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
            var sprite = new PixelBlock({x: pixels[i].x, y: pixels[i].y}, true);
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
        var thickness = 120;
        //this.setTouchEnabled(true);
        //add floor
        var winWidth = cc.director.getWinSize().width;
        var winHeight = cc.director.getWinSize().height;

        // Raised floor for debugging
        var floor = Space.addShape(
            new cp.SegmentShape(
                Space.staticBody,
                cp.v(0, 0, 500 + thickness),
                cp.v(winWidth, 0, 500 + thickness),
                500 + thickness
            ));

        // var floor = Space.addShape(
        //     new cp.SegmentShape(
        //         Space.staticBody,
        //         cp.v(0, 0 - thickness),
        //         cp.v(winWidth, 0 - thickness),
        //         thickness
        //     ));

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

        // var rwallBB = this.rwall.getBB();
        // cc.log('rwallBB: ', rwallBB);
        // var rwallRect = cc.rect(rwallBB.l, rwallBB.b, 10, rwallBB.t);
        // cc.log('rwallRect: ', rwallRect);

        // var lwallBB = this.lwall.getBB();
        // cc.log('lwallBB ' , lwallBB);
        // var lwallRect = cc.rect(lwallBB.r, lwallBB.b, 10, lwallBB.t);
        // cc.log('lwallRect: ', lwallRect);

        // var floorBB = this.floor.getBB();
        // cc.log('floor ' , floor);
        // var floorRect = cc.rect(floorBB.l, floorBB.b + 40, floorBB.r, 2);
        // cc.log('floorRect: ', floorRect);

        // var ceilingBB = this.ceiling.getBB();
        // cc.log('ceilingBB ' , ceilingBB);
        // var ceilingRect = cc.rect(ceilingBB.l, ceilingBB.t - 40, ceilingBB.r, 2);
        // cc.log('ceilingRect: ', ceilingRect);

        // this.createWallRects();
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
    createWallRects: function() {
        var rwallBB = this.rwall.getBB();
        this.rwallRect = cc.rect(rwallBB.l, rwallBB.b, 50, rwallBB.t);
        this.rwallRect.color = cc.color(255, 255, 0);
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
    wallCollisionBegin: function(arb) {
        var n = arb.getNormal(0);
        // debugger;
        var absDepth = Math.abs(arb.getDepth(0));
        cc.log('[Wall Collision] postSolve(): arb.getPoint(0): ', arb.getPoint(0));
        cc.log('[Wall Collision] postSolve(): arb.getDepth(0): ', arb.getDepth(0));
        cc.log('[Wall Collision] postSolve(): arb.getNormal(0): ', arb.getNormal(0));
        var curPos = this.projectile.sprite.getPosition();
        var sprite = this.projectile.sprite;

        // debugger;
        if (Math.abs(n.y) > 0.7071) {
            if (n.y >= 0) {
                cc.log('top');
                var wallPos = 'top';
                // if (wallPos === this.lastWallCollision) {
                    // return true;
                // }

                this.lastWallCollision = wallPos;
                this.projectile.setAfterWallCollision(
                    curPos.x,
                    curPos.y - absDepth,
                    this.projectile.vx,
                    -(Math.abs(this.projectile.vy))
                );

            }
            if (n.y < 0) {
                cc.log('bottom')
                var wallPos = 'bottom';
                // if (wallPos === this.lastWallCollision) {
                    // return true;
                // }
                this.lastWallCollision = wallPos;

                this.projectile.setAfterWallCollision(
                    curPos.x,
                    curPos.y + absDepth,
                    this.projectile.vx,
                    (Math.abs(this.projectile.vy))
                );
            }

        } else {
            if (n.x >= 0) {
                cc.log('right')
                var wallPos = 'right';
                // if (wallPos === this.lastWallCollision) {
                    // return true;
                // }
                this.lastWallCollision = wallPos;

                this.projectile.setAfterWallCollision(
                    curPos.x - absDepth,
                    curPos.y,
                    -(Math.abs(this.projectile.vx)),
                    this.projectile.vy
                );
            }
            if (n.x < 0) {
                cc.log('left')
                var wallPos = 'left';
                // if (wallPos === this.lastWallCollision) {
                    // return true;
                // }
                this.lastWallCollision = wallPos;

                this.projectile.setAfterWallCollision(
                    curPos.x + absDepth,
                    curPos.y,
                    (Math.abs(this.projectile.vx)),
                    this.projectile.vy
                );
            }
        }
        return true;
    },
    update:function(dt){
        cc.log('------------UPDATE------------');
        // debugger;
        // cc.log('this.projectile.vy: ', this.projectile.vy);
        // arb.a.body.setVel(cp.v(vx, vy * -1));
        for (var i = 0; i < this.activeProjectiles.length; i++) {
            this.activeProjectiles[i]
                .sprite
                .body
                .setVel(cp.v(this.activeProjectiles[i].vx, this.activeProjectiles[i].vy));
        };
        // this.projectile.
        this.lastProjectilePos = this.projectile.sprite.getPosition();
        // this.checkBlockCollisions();
        // this.projectile.sprite.setPosition(curPos.x + this.projectile.vx, curPos.y + this.projectile.vy);
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
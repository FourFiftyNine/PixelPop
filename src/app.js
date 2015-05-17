var MyLayer = cc.LayerColor.extend({
    lastWallCollision: null,
    lastBlockCollision: false,
    lastProjectilePos: null,
    init: function() {
        this.projectile = new Projectile();
        this.shooter = new Shooter();
        this.projectile.sprite.shape.setCollisionType(PROJECTILE_TYPE);
        this.activeProjectiles = [];
        this.activeProjectiles.push(this.projectile);
        this._super(cc.color(42, 42, 42, 255));
        this.setBoundries(Space);

        this.ceiling.setCollisionType(WALL_TYPE);
        this.floor.setCollisionType(WALL_TYPE);
        this.rwall.setCollisionType(WALL_TYPE);
        this.lwall.setCollisionType(WALL_TYPE);

        this.blockLevel(res.Level1_json);
        // this.blockLevel(res.Level2_json);

        // Add Projectile Above the level (to adjust overlaps)
        this.addChild(this.projectile);
        this.addChild(this.shooter);

        this.removeEntitites = [];
        this.blockRemovalQueued = false;
        this.initMouse();
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
                }
            }, this);
    },
    postStepRemoveBlock: function(shapeToRemove) {
        cc.log('arguments: ', arguments);
        cc.log('postStepRemoveBlock');
        cc.log('shapeToRemove: ', shapeToRemove);
        // shapeToRemove.body.sprite.removeStatic();
        shapeToRemove.setSensor(true);
        // Space.removeBody(shapeToRemove.body);
        // debugger;
        Space.removeShape(shapeToRemove);
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
                cc.log('[Block Collision Handler] Begin-----------------------------------------------')
                cc.log('arbiter.b: ', arbiter.b);

                if (this.blockRemovalQueued === true) {
                    cc.log('-----------------------------return false');
                    return false;
                }

                cc.log('this.lastProjectilePos: ', this.lastProjectilePos);
                cc.log('this.projectile.vx: ', this.projectile.vx);
                cc.log('this.projectile.vy: ', this.projectile.vy);
                // cc.log('arbiter.getShapes()[0].body.getPos(): ', arbiter.getShapes()[0].body.getPos());
                var normal = arbiter.getNormal(0);
                // cc.log('normal: ', normal);
                // cc.log('arbiter: ', arbiter);
                // cc.log('arbiter.getShapes()[1].group: ', arbiter.getShapes()[1].group);
                // cc.log('arbiter.getShapes()[1].layers: ', arbiter.getShapes()[1].layers);
                //
                cc.log('this.lastBlockCollision: ', this.lastBlockCollision);
                cc.log('this.lastBlockCollision: ', this.lastBlockCollision);

                if (this.lastBlockCollision != false) {
                    var lastPos = this.lastBlockCollision;
                } else {
                    cc.log('NO BLOCK');
                    cc.log('this.lastProjectilePos: ', this.lastProjectilePos);
                    var lastPos = this.lastProjectilePos;
                    cc.log('this.lastProjectilePos: ', this.lastProjectilePos);
                    cc.log('lastPos.x: ', lastPos.x);
                }
                cc.log('lastPos: ', lastPos);

                var start = cp.v(lastPos.x, lastPos.y)

                var segmentEndX1 = start.x + this.projectile.vx;
                var segmentEndY1 = start.y + this.projectile.vy;
                var end1 = cp.v(segmentEndX1, segmentEndY1);

                var segmentEndX2 = start.x - this.projectile.vx;
                var segmentEndY2 = start.y - this.projectile.vy;
                var end2 = cp.v(segmentEndX2, segmentEndY2);

                cc.log('end1: ', end1);
                cc.log('end2: ', end2);
                var drawNode = new cc.DrawNode();
                if (this.lastDrawNode) {
                    this.removeChild(this.lastDrawNode);
                }
                // drawNode.drawSegment(start, end1, 2, cc.color(255, 0, 255));
                // drawNode.drawSegment(start, end2, 2, cc.color(255, 0, 0));

                // drawNode.drawDot(start, 2, cc.color(255, 255, 255));
                // cc.log('drawNode: ', drawNode);
                this.lastDrawNode = drawNode;
                this.addChild(drawNode);

                var firstHitResult = false;
                var collisionNormal;
                var queryResult = Space.segmentQueryFirst(start, end1, PROJECTILE_TYPE, PROJECTILE_TYPE);
                if (queryResult) {
                    var n = queryResult.n;
                    var t = queryResult.t;
                } else {
                    return false;
                }

                if (queryResult.shape.bb_l === arbiter.b.bb_l &&
                    queryResult.shape.bb_t === arbiter.b.bb_t) {
                    cc.log('[Match] Positive')
                    // return true;
                } else {
                    cc.log('[Match] Negative')
                }

                cc.log('[Match] arbiter.b: ', arbiter.b);
                cc.log('[Match] queryResult: ', queryResult);
                cc.log('[Match] ------------------------------------ end')
                if (firstHitResult === false &&
                    queryResult.shape.type !== "segment" &&
                    queryResult.shape.body.sprite &&
                    queryResult.shape.body.sprite.name === 'PixelBlock') {
                    firstHitResult = queryResult.shape;
                    queryResult.shape.sensor = true;
                    collisionNormal = n;
                    var what = firstHitResult.segmentQuery(start, end1)
                    var enterPointVect = what.hitPoint(start, end1);
                    var exitPointVect = what.hitPoint(end1, start);
                    cc.log('enterPointVect: ', enterPointVect);
                    cc.log('exitPointVect: ', exitPointVect);
                    if (firstHitResult.body.sprite) {
                        Space.addPostStepCallback(this.postStepRemoveBlock.bind(this, firstHitResult));
                        // this.removeChild(firstHitResult.body.sprite);
                        firstHitResult.body.sprite.color = cc.color(0, 0, 255);
                        this.blockRemovalQueued = true;
                    }

                    // Set point of contact -- not last position
                    var finalCollisionPoint = enterPointVect;
                    this.lastBlockCollision = cp.v(finalCollisionPoint.x, finalCollisionPoint.y);
                    var newPositionX = finalCollisionPoint.x;
                    var newPositionY = finalCollisionPoint.y;

                    if (collisionNormal.y === -1) {
                        cc.log('bottom of block');
                        newPositionY -= 7.5;
                        this.projectile.vy = -Math.abs(this.projectile.vy);

                    }
                    if (collisionNormal.y === 1) {
                        cc.log('top of block');
                        newPositionY += 7.5;
                        this.projectile.vy = Math.abs(this.projectile.vy);

                    }
                    if (collisionNormal.x === 1) {
                        cc.log('right of block');
                        newPositionX += 7.5;
                        this.projectile.vx = Math.abs(this.projectile.vx);

                    }
                    if (collisionNormal.x === -1) {
                        cc.log('left of block');
                        newPositionX -= 7.5;
                        this.projectile.vx = -Math.abs(this.projectile.vx);

                    }

                    this.projectile.sprite.setPosition(cc.p(newPositionX, newPositionY));
                    cc.log('------------------------???---------------------------')
                    cc.log('new lastBlockCollision: ', this.lastBlockCollision)
                    this.projectile.sprite.body.setPos(cp.v(newPositionX, newPositionY));
                    var drawNode = new cc.DrawNode();
                    drawNode.drawDot(this.lastBlockCollision, 2, cc.color(0, 255, 0));
                    this.addChild(drawNode);
                    // debugger;
                    return true;

                }
            }.bind(this),
            function preSolve(arb, space) {
                // var n = arb.getContactPointSet()[0].normal;
                // cc.log('[Block Collision] preSolve(arb, space)');
                cc.log('[Block Collision Handler]  preSolve: <arb class="b"></arb>: ', arb.b);
                // cc.log('[Block Collision] preSolve: space: ', space);
                // cc.log('[Block Collision] preSolve: arb normal: ', n);
                // debugger;
                return true;
            },
            function postSolve(arb, space) {
                // cc.log('[Block Collision] postSolve(arb, space)');
                cc.log('[Block Collision Handler] postSolve: <arb class="b"></arb>: ', arb.b);
                // var n = arb.getContactPointSet()[0].normal;
                // cc.log('[Block Collision] postSolve: arb normal: ', n);
                // cc.log('[Block Collision] postSolve: space: ', space);
                // debugger;
                return true;
            },
            function separate(arb, space) {
                // cc.log('[Block Collision] separate(arb, space)');
                // cc.log('[Block Collision] separate: arb: ', arb);
                // var n = arb.getContactPointSet()[0].normal;
                // cc.log('[Block Collision] separate: arb normal: ', n);
                // cc.log('[Block Collision] separate: space: ', space);
                // debugger;
                return true;
            }
        );
    },
    blockLevel: function(resourceJson) {
        var level1 = ccs.load(resourceJson);
        // var what = ccs.load(res.Test);
        var pixels = level1.node.getChildren();
        var sprites = [];
        for (var i = 0; i < pixels.length; i++) {
            var sprite = new PixelBlock({x: pixels[i].x, y: pixels[i].y - 50}, true);
            sprite.color = pixels[i].color;
            sprite.shape.setCollisionType(BLOCK_TYPE)
            sprite.setRotation(pixels[i].getRotationX());
            sprites.push(sprite);
            this.addChild(sprite);
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
    },
    setBoundries: function (space) {
        var thickness = 120;
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

        floor.layers = PROJECTILE_TYPE;
        floor.setElasticity(1);
        floor.setFriction(1);
        lwall.layers = PROJECTILE_TYPE;
        lwall.setElasticity(1);
        lwall.setFriction(1);
        rwall.layers = PROJECTILE_TYPE;
        rwall.setElasticity(1);
        rwall.setFriction(1);
        ceiling.layers = PROJECTILE_TYPE;
        ceiling.setElasticity(1);
        ceiling.setFriction(1);

        this.lwall = lwall;
        this.rwall = rwall;
        this.floor = floor;
        this.ceiling = ceiling;
    },
    createWallRects: function() {
        var rwallBB = this.rwall.getBB();
        var lwallBB = this.lwall.getBB();
        var floor = this.floor.getBB();
        var ceilingBB = this.ceiling.getBB();

        this.lwallRect = cc.rect(lwallBB.r, lwallBB.b, 10, lwallBB.t);
        this.rwallRect = cc.rect(rwallBB.l, rwallBB.b, 50, rwallBB.t);
        this.floorRect = cc.rect(floor.l, floor.b + 30, floor.r, 20);
        this.ceilingRect = cc.rect(ceilingBB.l, ceilingBB.t - 50, ceilingBB.r, 20);
    },
    wallCollisionBegin: function(arb) {
        var n = arb.getNormal(0);
        var absDepth = Math.abs(arb.getDepth(0));
        var curPos = this.projectile.sprite.getPosition();
        var sprite = this.projectile.sprite;
        var wallPosName;

        if (Math.abs(n.y) > 0.7071) {
            if (n.y >= 0) {
                cc.log('top');
                wallPosName = 'top';
                this.projectile.setAfterWallCollision(
                    curPos.x,
                    curPos.y - absDepth,
                    this.projectile.vx,
                    -(Math.abs(this.projectile.vy))
                );
            }
            if (n.y < 0) {
                cc.log('bottom')
                wallPosName = 'bottom';

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
                wallPosName = 'right';
                this.projectile.setAfterWallCollision(
                    curPos.x - absDepth,
                    curPos.y,
                    -(Math.abs(this.projectile.vx)),
                    this.projectile.vy
                );
            }
            if (n.x < 0) {
                cc.log('left')
                wallPosName = 'left';
                this.projectile.setAfterWallCollision(
                    curPos.x + absDepth,
                    curPos.y,
                    (Math.abs(this.projectile.vx)),
                    this.projectile.vy
                );
            }
        }

        this.lastWallCollision = wallPosName;
        this.lastBlockCollision = false;
        return true;
    },
    update:function(dt){
        // cc.log('------------UPDATE------------');
        // debugger;
        for (var i = 0; i < this.activeProjectiles.length; i++) {
            this.activeProjectiles[i]
                .sprite
                .body
                .setVel(cp.v(this.activeProjectiles[i].vx, this.activeProjectiles[i].vy));
        };
        this.lastProjectilePos = this.projectile.sprite.getPosition();
        Space.step(dt);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
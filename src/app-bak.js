var Space = new cp.Space();
Space.iterations = 5;
Space.gravity = cp.v(0, -200);
var CPSprite = cc.Sprite.extend({
    ctor:function(filename, pos, mass, Elasticity, friction){
        this._super();

        this.initWithFile(filename);
        mass = mass || 5;
        var body = Space.addBody(new cp.Body(mass, cp.momentForBox(mass, this.getContentSize().width, this.getContentSize().height)));
        body.setPos(cp.v(pos.x, pos.y));
        var shape = Space.addShape(new cp.BoxShape(body, this.getContentSize().width, this.getContentSize().height));
        shape.setElasticity(Elasticity || 0.2);
        shape.setFriction(friction || 0.8);
        this.body = body;
        this.shape = shape;

    },
    visit:function(){
        console.log('visit');
        if(this.body)
        {
            var pos = this.body.p;
            this.setPosition(pos.x, pos.y);
            this.setRotation(cc.RADIANS_TO_DEGREES(-1*this.body.a));
        }
        else{
            console.log('no body?');
        }
        this._super();
    }
});

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        console.log('fuck you');
        //this.world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0,-10));
        //this.world.SetContinuousPhysics(true);

        var level = ccs.load(res.Level_json);
        this.addChild(level.node);
        //this.space = new cp.Space();
        ////2. setup the  Gravity
        //this.space.gravity = cp.v(0, -350);
        // 3. set up Walls
        var thickness = 50;
        //var lwall = this.space.addShape(new cp.SegmentShape(this.space.staticBody, cp.v(0-thickness,cc.director.getWinSize().height), cp.v(0-thickness,0), thickness));
        //lwall.setElasticity(1);
        //lwall.setFriction(1);
        //var children = level.node.getChildren();

        var yeoman = level.node.getChildByName('yeoman');
        var pixels = level.node.getChildByName('ProjectNode_1_0').getChildren();

        for(var i = 0; i < pixels.length; i++) {
            console.log(pixels[i]);
            //var box = new CPSprite("res/rr-pink-big.png", cc.p(cc.director.getWinSize().height / 2, cc.director.getWinSize().width/ 2));
            //var box = new CPSprite("res/rr-pink-big.png", cc.p(300, 300));
            ////box.setContentSize(cc.SizeMake(this.size,this.size));
            //this.addChild(box);
            //this.space.addBody(new cp.Body(5, ))
        }
        level.node.getChildByName('ProjectNode_1_0').visible = false;
        //var yeoman = cc.PhysicsSprite();

        //1. new space object
        //var wallBottom = new cp.SegmentShape(this.space.staticBody,
        //    cp.v(0, g_groundHeight),// start point
        //    cp.v(4294967295, g_groundHeight),// MAX INT:4294967295
        //    0);// thickness of wall
        //this.space.addStaticShape(wallBottom);


        var moveYeo = true;
        var box = new CPSprite("res/rr-pink-big.png", cc.p(-100, -400));
        //var box2 = cc.LayerColor.create(cc.c3b(255,255,0,255), 50, 50);
        //    box2.setContentSize(cc.SizeMake(this.size,this.size))
        //this.addChild(box2);
        this.addChild(box);
        box.x = 100;
        box.y = 400;
        if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function(event) {
                    moveYeo = !moveYeo;
                    console.log('click');
                },
                onMouseMove: function(event){
                    //debugger;
                    //event.getLocationX()
                    if (moveYeo) {
                        yeoman.x = event.getLocationX();
                        yeoman.y = event.getLocationY();
                    }
                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT) {
                        //event.getCurrentTarget().processEvent(event);
                        //console.log(event);
                    }
                }
            }, this);
        console.log('gimm it');
        this.scheduleUpdate();

        return true;
    },

    update: function(dt) {
        dt = dt>0.2? 0.1:dt;
        Space.step(dt);

        //this.world.Step(dt);
        //console.log('update');
    }
});

var HelloWorldScene = cc.Scene.extend({

    onEnter:function () {
        console.log('hasda')
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
        layer.init()
        ;        //console.log(cc.director.getWinSize().width)
        //this.addPhysicsBody(cc.p(cc.director.getWinSize().width/2, cc.director.getWinSize().height/2));

        //debugger;

    }
});

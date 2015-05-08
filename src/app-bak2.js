var Space = new cp.Space();
Space.iterations = 5;
Space.gravity = cp.v(0, -750);
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

var MyLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    init:function () {
        //cc.PhysicsSprite()
        this._super();

        this.scheduleUpdate();
        var level = ccs.load(res.Level_json);
        this.addChild(level.node);

        var pixels = level.node.getChildByName('ProjectNode_1_0').getChildren();
        var yeoman = level.node.getChildByName('yeoman');
        this.addClickMove(yeoman);

        //this.addYeoman(yeoman);
        this.addPhysicsStaticBody(cc.p(cc.director.getWinSize().width/2, cc.director.getWinSize().height/2 - 50));
        //this.addPhysicsBody();
        for(var i = 0; i < pixels.length * 3; i++) {
            console.log(i);
            //console.log(pixels[i]._name);
            //pixels[i].removeFromParent(true);
            //this.addChild(pixels[i]);
            //var ss = cc.PhysicsSprite.extend(pixels[i].create())
            //pixels[i].extend();
            this.addPhysicsBody(cc.p(cc.director.getWinSize().width/2 + i, cc.director.getWinSize().height/2));

            //this.addPhysicsBody(100);

            //var box = new CPSprite("res/rr-pink-big.png", cc.p(cc.director.getWinSize().height / 2, cc.director.getWinSize().width/ 2));
            //var box = new CPSprite("res/rr-pink-big.png", cc.p(300, 300));
            ////box.setContentSize(cc.SizeMake(this.size,this.size));
            //this.addChild(box);
            //this.space.addBody(new cp.Body(5, ))
        }
        return true;
    },
    addPhysicsStaticBody: function (pos) {

        this.sprite = new cc.PhysicsSprite.create('res/rr-pink-big.png')
        this.addChild(this.sprite);
        this.sprite.setScale(.5);

        var contentSize = this.sprite.getContentSize();

        this.body = Space.staticBody;
        this.body.setPos(pos);

        this.shape = new cp.BoxShape(this.body, contentSize.width / 2, contentSize.height / 2);

        Space.addShape(this.shape);
        this.sprite.setBody(this.body);

    },
    addPhysicsBody:function(pos) {
        this.sprite = new cc.PhysicsSprite.create('res/rr-pink-big.png')
        //this.sprite.x = 100;
        //this.sprite.y = 100;
        this.addChild(this.sprite);
        //this.sprite = new cc.PhysicsSprite("res/rr-pink-big.png");
        this.sprite.setScale(.5);
        ////this.sprite = new cc.PhysicsSprite.extend;
        //this.addChild(this.sprite);
        var contentSize = this.sprite.getContentSize();
        // 2. init the runner physic body
        this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width / 2, contentSize.height / 2));
        //this.body = Space.staticBody;
        //3. set the position of the runner
        this.body.setPos(pos);
        //4. apply impulse to the body
        //this.body.applyImpulse(cp.v(150, 0), cp.v(0, 0));//run speed
        //5. add the created body to spacew
        Space.addBody(this.body);
        //6. create the shape for the body
        this.shape = new cp.BoxShape(this.body, contentSize.width / 2, contentSize.height / 2);
        //this.shape
        //7. add shape to space
        Space.addShape(this.shape);
        //8. set body to the physic sprite
        this.sprite.setBody(this.body);
        this.sprite
        //var box = new CPSprite("res/rr-pink-big.png", cc.p(-100, -400));
        //box.x = 100;
        //box.y = 400;
        //this.addChild(box);
    },
    count:0,
    addClickMove: function (sprite) {
        var move = true;
        if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function(event) {
                    var target = event.getCurrentTarget();
                    var locationInNode = target.convertToNodeSpace(event.getLocation())
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    console.log(target.sprite._name);
                    console.log(locationInNode)
                    console.log(s) n
                    console.log(rect)
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        target.setOpacity(0);
                        console.log('what')
                        return true;
                    }
                    //debugger;
                    //event.getLocationX()

                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT) {
                        if (move) {
                            target.x = event.getLocationX();
                            target.y = event.getLocationY();
                        }
                        //event.getCurrentTarget().processEvent(event);
                        //console.log(event);
                    }
                },
                //onMouseMove: function(event){
                //    var target = event.getCurrentTarget();
                //    var locationInNode = target.convertToNodeSpace(event.getLocation())
                //    var s = target.getContentSize();
                //    var rect = cc.rect(0, 0, s.width, s.height);
                //    console.log(locationInNode)
                //    if (cc.rectContainsPoint(rect, locationInNode)) {
                //        target.setOpacity(0);
                //        console.log('what')
                //        return true;
                //    }
                //    //debugger;
                //    //event.getLocationX()
                //
                //    if(event.getButton() == cc.EventMouse.BUTTON_LEFT) {
                //        if (move) {
                //            target.x = event.getLocationX();
                //            target.y = event.getLocationY();
                //        }
                //        //event.getCurrentTarget().processEvent(event);
                //        //console.log(event);
                //    }
                //}
            }, this);
    },
    //addYeoman: function (yeomanSprite) {
    //    var moveYeo = true;
    //    yeomanSprite.setScale(.5);
    //    if ('mouse' in cc.sys.capabilities)
    //        cc.eventManager.addListener({
    //            event: cc.EventListener.MOUSE,
    //            onMouseDown: function(event) {
    //                moveYeo = !moveYeo;
    //                console.log('click');
    //            },
    //            onMouseMove: function(event){
    //                //debugger;
    //                //event.getLocationX()
    //                if (moveYeo) {
    //                    yeomanSprite.x = event.getLocationX();
    //                    yeomanSprite.y = event.getLocationY();
    //                }
    //                if(event.getButton() == cc.EventMouse.BUTTON_LEFT) {
    //                    //event.getCurrentTarget().processEvent(event);
    //                    //console.log(event);
    //                }
    //            }
    //        }, this);
    //},
    update:function(dt){

        //dt = dt>0.2? 0.1:dt;
        Space.step(dt);
    }

});

var HelloWorldScene = cc.Scene.extend({

    onEnter:function () {
        console.log('onEnter')
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init()
        ;        //console.log(cc.director.getWinSize().width)
        //this.addPhysicsBody(cc.p(cc.director.getWinSize().width/2, cc.director.getWinSize().height/2));

        //debugger;

    }
});
/**
 * Created by anthonysessa on 5/3/15.
 */

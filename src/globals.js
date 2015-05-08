var g_groundHeight = 57;
var g_runnerStartX = 80;

var Space = new cp.Space();
Space.iterations = 5;
Space.gravity = cp.v(0, -750);

// collision type for chipmunk
if(typeof SpriteTag == "undefined") {
    var SpriteTag = {};
    SpriteTag.yeoman = 0;
    SpriteTag.spec = 1;
};
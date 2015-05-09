var g_groundHeight = 57;
var g_runnerStartX = 80;

var Space = new cp.Space();
Space.iterations = 20;
Space.gravity = cp.v(0, -750);
// Space.useSpatialHash(40, 70);

// collision type for chipmunk
if(typeof SpriteTag == "undefined") {
    var SpriteTag = {};
    SpriteTag.yeoman = 0;
    SpriteTag.spec = 1;
};
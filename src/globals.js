var PROJECTILE_TYPE = 1;
var WALL_TYPE = 2;
var BLOCK_TYPE = 3;

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
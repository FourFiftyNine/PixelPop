var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    // pixel : "res/rounded-square.png",
    projectile : "res/circle-30x30.png",
    PixelBlock_png : "res/block-34x34.png",
    pixel : "res/circle-34x34.png",
    Row_json : "res/Row.json",
    Level1_json : "res/Level1.json",
    Level_json : "res/Level.json"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

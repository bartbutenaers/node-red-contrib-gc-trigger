module.exports = function(RED) {
    "use strict";

    function TriggerGarbageNode(config) {
        RED.nodes.createNode(this,config);

        var node = this;
        
        // To be able to use start the garbage collection programmatically, you should expose the 'gc'
        // functionality in the startup command: `node --expose-gc red.js`.
        // To avoid that, we will set the flags programmatically (https://github.com/nodejs/node/issues/16595).
        require("v8").setFlagsFromString('--expose_gc');
        global.gc = require("vm").runInNewContext('gc');
        
        this.on("input",function(msg) {      
            if (global.gc) {
                global.gc();
            } 
            else {
                console.warn('No GC hook! Start Node-Red as `node --expose-gc red.js`.');
            }
        });
    }

    RED.nodes.registerType("gc-trigger",TriggerGarbageNode);
}

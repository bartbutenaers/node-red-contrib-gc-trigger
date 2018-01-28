# node-red-contrib-gc-trigger
A Node Red node to trigger a garbage collection in V8. That V8 is Google's Javascript engine (written in C++), that is a.o. used to run Node.js.

## Install
Run the following npm command in your Node-RED user directory (typically ~/.node-red):
```
npm install node-red-contrib-gc-trigger
```

## Node Usage
In normal circumstances, the V8 engine will cleanup memory as soon as it is necessary.   When the memory exceeds some threshold, the V8 engine will trigger garbage collections.  This can be visualized in Node-Red using the [node-red-contrib-gc node](https://www.npmjs.com/package/node-red-contrib-gc):

![GC trigger monitor](https://raw.githubusercontent.com/bartbutenaers/node-red-contrib-gc-trigger/master/images/gc_trigger_monitor.png)

However it might happen in exceptional cases that the garbage collection doesn't run often enough, since the V8 engine isn't aware about the real amount of memory being used.  For example when native C++ code is being called from a NodeJS program, in some conditions NodeJs doesn't take into account all the native memory that is being used.  In such conditions it might be useful to force NodeJs to trigger a garbage collection.  Keep in mind that this is in fact only a workaround, and not a real solution of the problem!

The garbage collection could be triggered e.g. at fixed moments in time:

![GC trigger interval](https://raw.githubusercontent.com/bartbutenaers/node-red-contrib-gc-trigger/master/images/gc_trigger_interval.png)
```
[{"id":"f25703cc.accc","type":"interval","z":"96bd11be.2cff3","name":"interval","interval":"1","onstart":false,"msg":"ping","showstatus":false,"unit":"seconds","statusformat":"YYYY-MM-D HH:mm:ss","x":204,"y":624.9722290039062,"wires":[["a3ba42c3.c7e87"]]},{"id":"a3ba42c3.c7e87","type":"gc-trigger","z":"96bd11be.2cff3","display":true,"name":"","x":364.88547706604004,"y":624.3334522247314,"wires":[[]]}]
```

Or you could also trigger it when the memory usage exceeds some threshold (e.g. 90%):

![GC trigger threshold](https://raw.githubusercontent.com/bartbutenaers/node-red-contrib-gc-trigger/master/images/gc_trigger_threshold.png)
```
[{"id":"cb98f7ec.6b8a08","type":"Memory","z":"96bd11be.2cff3","name":"","x":284,"y":497,"wires":[["7c2d3760.aa1518"]]},{"id":"7c2d3760.aa1518","type":"jsonpath","z":"96bd11be.2cff3","expression":"memusage","split":true,"name":"Extract usage","x":457.99997329711914,"y":496.514009475708,"wires":[["dddd676c.1d5af8"]]},{"id":"87bf4a54.f6c6f8","type":"interval","z":"96bd11be.2cff3","name":"interval","interval":"1","onstart":false,"msg":"ping","showstatus":false,"unit":"seconds","statusformat":"YYYY-MM-D HH:mm:ss","x":137.28126525878906,"y":496.97222900390625,"wires":[["cb98f7ec.6b8a08"]]},{"id":"dddd676c.1d5af8","type":"switch","z":"96bd11be.2cff3","name":"> 90 %","property":"payload","propertyType":"msg","rules":[{"t":"gt","v":"90","vt":"num"}],"checkall":"true","outputs":1,"x":638.5001983642578,"y":496.3334445953369,"wires":[["d1c6f6a0.bab2d8"]]},{"id":"d1c6f6a0.bab2d8","type":"gc-trigger","z":"96bd11be.2cff3","display":true,"name":"","x":801.1667098999023,"y":496.3334045410156,"wires":[[]]}]
```

The memory consumption will look like this now:

![GC trigger monitor](https://raw.githubusercontent.com/bartbutenaers/node-red-contrib-gc-trigger/master/images/gc_trigger_threshold_graph.png)

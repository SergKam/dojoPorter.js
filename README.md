dojoPorter.js
=============

dojoPorter.js

   This simple script changes the old dojo namespace approach to new module orientated. 
It findes all names started from dojox. or dijit.
like dojox.someModule.SomeThing()  and change it to SomeThing(),
and then adds "dojox/someModule/SomeThing" to the requirements of current module.;
    
Usage: 
---------
```sh
node dojoPorter.js {inputfile}.js [{output}.js]
``` 
 output file name, if omited, will be the same as the input (rewrite mode);
 
Example
__________
before:

```javascript
define(["some"], function(some) {

    var s = new dojox.someModule.SomeThing();

});
```

after:

```javascript
define([
   "some",
   "dojox/someModule/SomeThing"
], function(
    some,
    SomeThing
) {

    var s = new SomeThing();

});
```

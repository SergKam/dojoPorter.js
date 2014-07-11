dojoPorter.js
=============

dojoPorter.js

   This script change the old namespace approach to new one, module orientated. 
It findes all dojox.someModule.SomeThing() (or dijit package) and change it to SomeThing(),
and then adds "dojox/someModule/SomeThing" to the requirements of module.;
    
Usage: node dojoPorter.js {inputfile}.js [{output}.js]
 
Example
__________
before:

define(["some"], function(some) {

var s = new dojox.someModule.SomeThing();

});

after:

define([
   "some",
   "dojox/someModule/SomeThing"
], function(
    some,
    SomeThing
) {

var s = new SomeThing();

});

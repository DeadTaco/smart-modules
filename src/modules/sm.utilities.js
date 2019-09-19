/* 
sm.utilities.js

A bunch of useful utilities for manipulating 2d and 3d graphics, as well as query selectors and routines

*/
// csec.showModuleInfo("sm.utlities.js", "General functions and utilities for the Cross Section Creator API.  Includes quick query selector '$'");

SmartModule.fn.module("utils", ({ 
    description : ["sm.utlities.js", "General functions and utilities for the Cross Section Creator API."],
    newSection() {
        processFile(this.root.blankSection);
        prepareCrossSection();
    }
}));


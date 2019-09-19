/* 
sm.console.js

Used to maintain compatibility across all versions of CSEC as new features are added and the CSEC JSON save
files are modified.  Remaps missing/changed items to where they need to be.

*/

SmartModule.fn.module("console", ({ 
    description : ["sm.console.js", "Ends loading of modules and ends the console grouping.  Should be last on this list."],
}));

delete SmartModule.fn.console; // The console was only temporary for showing the final message on the modules list.  We can delete it since we don't need it any longer.

console.log("%cNote: Asterisks denote that a module is not API ready!", "color:red;font-weight:bold;padding:5px;");
console.groupEnd(); // Done grouping the modules loaded list

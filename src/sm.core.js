/* --------------------------------------------------------------------------------------------------------------------------------
sm.core.js
Smart Modules - Core functionality

Written By Devin Crowley

-------------------------------------------------------------------------------------------------------------------------------- */

"use strict";
const SmartModule = (function() {

    // Options
        
    let allowMultipleInstances = false; // Set to true if you want to allow multiple instances of this library to be available.
    let collapseLoader = false; // Collapses the loaded modules into a single line in the console - Set to false for debugging issues
    let instances = 0;          // PRIVATE -- Tell us if smartModule is already instantiated
    let activeInstance = null;  // If we only a allow a single instance of this library and an instance already exists, return it instead of creating a new instance
    let version = "1.0.0" ;
    
    // The root functionality of the smartModule object - Please note the uppercase vs lowercase names for the API vs the loader
    function smartModule(options) {
        
        if(!options) options = {};
        let useExistingReference = options.useExistingReference;
        let initFunction = options.init;

        // useExistingReference tells us to return an already existing reference to this API if it exists
        instances++;
        if(instances > 1 && !allowMultipleInstances) {
            if(!useExistingReference) console.warn(`Attempted to create multiple SmartModule API instances.  Multiple instances are currently disabled.`);
            instances = 1;
            return activeInstance;
        }
        activeInstance = this;
        const $root = this;
        this.blankSection = "";
        this.blankSection = ""; // Defines a blank cross section variable to be used for the "New" menu item
        this.version = version;
        this.instances = instances;
        this.description = `Smart Modules v${this.version} loaded`;

        // Show a description of this application in the console window (Optional)
        if(this.description) console.info(`%c${this.description}`, "font-size:1.0em;font-weight:bold;background-color:black;color:yellow;padding:10px;min-width:500px;line-height:0.25em;text-align:center;");        
        // If collapseLoader is true, all of the loaded modules and their info will be grouped in the console
        if(collapseLoader) console.groupCollapsed("%cClick Here to View Loaded Cross Section Modules","border-radius:5px;padding:5px; background-color:blue;color:white"); // Groups the loading of modules into a single group to prevent cluttering the console.

        // Begin initialization after DOM is fully loaded

        document.onreadystatechange = function () {
            if (document.readyState == "complete") {
                loadModules();
                if(initFunction) initFunction();
            }
        }

        smartModule.fn = smartModule.prototype;   // Make it easier to design prototypes via simple fn (function)

        // For NON-API Modules: A function to quickly explain the purpose of each loaded file in the console for debugging and development purposes
        this.showModuleInfo = function(filename, description) {
            filename = filename.padEnd(25, " ");           // Filename is always set characters minimum in length so there's equal spacing between comments
            description = "* " + description;
            description = description.padEnd(105, " ");    // Description is always 105 characters minimum in length so there's equal spacing between comments
            console.log(`%cLoaded%c${filename}%c${description}`, `padding:3px; background-color:rgb(155,0,0); color:white; display:inline-block;`,`font-weight:bold;padding:3px; background-color:rgb(0,150,255); color:yellow; display:inline-block; min-width:25%;`, `padding:3px; background-color:rgb(0,50,155); color:white; display:inline-block;min-width:50%`);
        }

        // For API Modules: A function to quickly explain the purpose of each loaded sm.*.js file in the console for debugging and development purposes
        this.showModuleInfoApi = function(filename, description) {
            filename = filename.padEnd(25, " ");           // Filename is always set characters minimum in length so there's equal spacing between comments
            description = description.padEnd(105, " ");    // Description is always 105 characters minimum in length so there's equal spacing between comments
            console.log(`%cLoaded%c${filename}%c${description}`, `padding:3px; background-color:rgb(155,0,0); color:white; display:inline-block;`,`font-weight:bold;padding:3px; background-color:rgb(0,150,255); color:yellow; display:inline-block; min-width:25%;`, `padding:3px; background-color:rgb(0,50,255); color:white; display:inline-block;min-width:50%`);
        }    

        function loadModules() {
            SmartModule.modules.map(module=>{
                addModule(module.moduleName, module.moduleFunction);
            })
        }
        
        // Add modules to this API and still have access to root variables, objects, prototypes, and functions.
        // Checks for dependencies during the module loading process to make sure they're available, regardless
        // of which modules are loaded first
        function addModule(mod, fn) {
            if(smartModule.prototype[mod]) throw new Error(`Warning!  A module with the name ${mod} already exists!  `);
            smartModule.prototype[mod] = fn;
            smartModule.prototype[mod].root = $root;
            smartModule.prototype[mod].moduleName = mod;
            // Dependency check
            if(fn.requires) {
                fn.requires.map(r=>{
                    if(!smartModule.prototype[r] && SmartModule.moduleNames.indexOf(r) == -1) {
                        console.warn(`Module Dependency Issue:  Module "${mod}" requires module "${fn.requires}" which is wasn't found.  This may cause errors to be thrown!`)
                    }
                });
            }
            if(fn.description && options.showModuleInfo === true) {
                $root.showModuleInfoApi(fn.description[0], fn.description[1]);
            } else if (options.showModuleInfo === true) {
                $root.showModuleInfoApi(mod, "Single-function Module Loaded");
            }
        }
    }
    
    if(instances > 0 && !allowMultipleInstances) {
        return activeInstance;
    } else {
        return smartModule;
    }
    
})();

SmartModule.addModule = function(moduleName, moduleFunction) {
    if(!this.modules) { this.modules = []; this.moduleNames = []; }
    this.modules.push({ moduleName : moduleName, moduleFunction : moduleFunction});
    this.moduleNames.push(moduleName);
};

// Tip for newer developers:
// You can also define a module without using the module function by passing SmartModule
// to itself and telling it to use its reference with a boolean operator
/*
SmartModule.fn.myRandomModule = function(root) {
    let $root = root(true);
    function getRoot() { console.log("OK"); return $root; }
    let myInternalFunctions = ({
        get $root() { return $root },
        getThis() {return $root},
        getRoot() { return getRoot();}
    });
    myInternalFunctions.root = this;
    return myInternalFunctions;
}(SmartModule)
*/
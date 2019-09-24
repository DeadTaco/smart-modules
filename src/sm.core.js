/* --------------------------------------------------------------------------------------------------------------------------------
sm.core.js
Smart Modules - Core functionality

Written By Devin Crowley

-------------------------------------------------------------------------------------------------------------------------------- */

"use strict";
const SmartModule = (function() {

    // Options

    // Module States

    let allowMultipleInstances = false; // Set to true if you want to allow multiple instances of this library to be available.
    let collapseLoader = false; // Collapses the loaded modules into a single line in the console - Set to false for debugging issues
    let instances = 0;          // PRIVATE -- Tell us if smartModule is already instantiated
    let activeInstance = null;  // If we only a allow a single instance of this library and an instance already exists, return it instead of creating a new instance
    let version = "1.0.0" ;
    
    // The root functionality of the smartModule object - Please note the uppercase vs lowercase names for the API vs the loader
    function smartModule(options) {
        SmartModule.STATE_UNKNOWN = -1;
        SmartModule.STATE_IDLE = 0;
        SmartModule.STATE_GETFILE = 1;
        SmartModule.STATE_BUSY = 2;
        SmartModule.STATE_AWAIT = 3;        

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
        this.modulesLoaded = [];
        this.state = SmartModule.STATE_IDLE;        // States allow us to know what the smart module is currently doing, such as waiting on async functions to complete
        // Number of active async functions
        Object.defineProperty(this, "activeAsync", 
        { 
            get: function() { return this.value },
            set : function(val) { 
                this.value = val;
                if(this.value > 0) {
                    $root.state = SmartModule.STATE_AWAIT;
                } else {
                    $root.state = SmartModule.STATE_IDLE;
                }
            }
        });
        this.activeAsync = 0;
        

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
       //  smartModule.fn = smartModule.prototype;   // Make it easier to design prototypes via simple fn (function)


        // For NON-API Modules: A function to quickly explain the purpose of each loaded file in the console for debugging and development purposes
        this.showModuleInfo = function(filename, description) {
            filename = filename.padEnd(25, " ");           // Filename is always set characters minimum in length so there's equal spacing between comments
            description = "* " + description;
            description = description.padEnd(105, " ");    // Description is always 105 characters minimum in length so there's equal spacing between comments
            console.log(`%cModule%c${filename}%c${description}`, `padding:3px; background-color:rgb(155,0,0); color:white; display:inline-block;`,`font-weight:bold;padding:3px; background-color:rgb(0,150,255); color:yellow; display:inline-block; min-width:25%;`, `padding:3px; background-color:rgb(0,50,155); color:white; display:inline-block;min-width:50%`);
        }

        // For API Modules: A function to quickly explain the purpose of each loaded sm.*.js file in the console for debugging and development purposes
        this.showModuleInfoApi = function(filename, description) {
            filename = filename.padEnd(25, " ");           // Filename is always set characters minimum in length so there's equal spacing between comments
            description = description.padEnd(105, " ");    // Description is always 105 characters minimum in length so there's equal spacing between comments
            console.log(`%cModule%c${filename}%c${description}`, `padding:3px; background-color:rgb(155,0,0); color:white; display:inline-block;`,`font-weight:bold;padding:3px; background-color:rgb(0,150,255); color:yellow; display:inline-block; min-width:25%;`, `padding:3px; background-color:rgb(0,50,255); color:white; display:inline-block;min-width:50%`);
        }

        // Loads a module from a file/URL
        // Note that this is a separate function from the SmartModule.loadModule function!  This one only becomes available after
        // the smart module is initialized as a new object.         
        this.loadModule = function(moduleName, noPath) {
            if(!moduleName) throw "loadModule(moduleName): A module name or path is required but was not given!"
            const rootPath = SmartModule.rootPath;
            let path = null;
            if(moduleName.search(".js") !== -1) path = moduleName;  // If a URL is given, load that.  If not, use the modules/sm.modulename.js location
            if(!path) path= `${rootPath}modules/sm.${moduleName}.js`;
            var scriptTag = document.createElement("script"), // create a script tag
            firstScriptTag = document.getElementsByTagName("script")[0]; // find the first script tag in the document
            scriptTag.src = path; // set the source of the script to your script
            firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag); // append the script to the DOM
            scriptTag.onload = (s=>{
                let thisModule = SmartModule.modules.slice(-1).pop();           // Get the last loaded script
                addModule(thisModule.moduleName, thisModule.moduleFunction);    // Activate the module.  Not to be confused with the public "this.addModule"!
            });
        }

        // Public access to the addModule function.  
        // Note that this is a separate function from the SmartModule.addmodule function!  This one only becomes available after
        // the smart module is initialized as a new object.        
        this.addModule = function(moduleName, fn) {
            addModule(moduleName, fn);
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

            if(typeof fn === "object") {
                smartModule.prototype[mod].root = $root; // Assign a root variable to any collection modules
                smartModule.prototype[mod].moduleName = mod; // Assign a module name variable to any collection modules
            }
            
            // Dependency check
            if(fn.requires) {
                fn.requires.map(r=>{
                    if(!smartModule.prototype[r] && SmartModule.moduleNames.indexOf(r) == -1) {
                        console.warn(`Module Dependency Issue:  Module "${mod}" requires module "${r}" which is wasn't found.  This may cause errors to be thrown!`)
                    }
                });
            }
            if(fn.description && options.showModuleInfo === true) {
                $root.showModuleInfoApi(fn.description[0], fn.description[1]);
                $root.modulesLoaded.push(`${mod} : ${fn.description[1]}`);
            } else if (options.showModuleInfo === true) {
                $root.showModuleInfoApi(mod, "Single-function Module Loaded");
                $root.modulesLoaded.push(`${mod} : Untitled Single-function Module`);
            } else {
                $root.modulesLoaded.push(`${mod} : No description`);
            }
        }
    }
    
    if(instances > 0 && !allowMultipleInstances) {
        return activeInstance;
    } else {
        return smartModule;
    }
    
})();

// ---------------------- CORE MODULES ------------------------- //

// Adds modules to a module array which will be parsed after everything else is done loading.
// This allows us to check dependencies between modules to be sure they're available after all
// module files are done loading.
SmartModule.addModule = function(moduleName, moduleFunction) {
    if(!this.modules) { this.modules = []; this.moduleNames = []; }
    if(this.moduleNames.includes(moduleName)) {
        throw `Module ${moduleName} tried to load but it conflicts with an already loaded module with the same name!`;
    }
    this.modules.push({ moduleName : moduleName, moduleFunction : moduleFunction});
    this.moduleNames.push(moduleName);
};

// Loads a module file from the modules directory or the path given (BEFORE initialization!)
SmartModule.loadModule = function(moduleName) {
    // If we have an array of files to load, cycle through and load all of them.
    if(Array.isArray(moduleName)) {
        moduleName.map(m=>SmartModule.loadModule(m));
        return;
    }
    if(!moduleName) throw "SmartModule.loadModule(): A module name or path is required but was not given!"
    const rootPath = SmartModule.rootPath;
    let path = null;
    if(moduleName.search(".js") !== -1) path = moduleName;  // If a URL is given, load that.  If not, use the modules/sm.modulename.js location
    if(!path) path= `${rootPath}modules/sm.${moduleName}.js`;
    var scriptTag = document.createElement("script"), // create a script tag
    firstScriptTag = document.getElementsByTagName("script")[0]; // find the first script tag in the document
    scriptTag.src = path; // set the source of the script to your script
    firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag); // append the script to the DOM
}

// This let's us know the root path to sm.core.js for getting relative paths to the modules directory
SmartModule.rootPath = (()=> {
    var scripts= document.getElementsByTagName('script');
    var path= scripts[scripts.length-1].src.split('?')[0];
    var mydir= path.split('/').slice(0, -1).join('/')+'/';
    return mydir;
})();

// File reading and writing
SmartModule.addModule("fileio", ({
        description : ["fileio", "File Controller: input and output (Built-in module)"],
        // Retrieves a file, then runs the function assigned to fn
        getFile : function(path, fn) {
            this.root.currentState = SmartModule.STATE_LOADFILE; // APP STATES
            this.root.activeAsync++;    // Let's us know we have an active async/promise running
            let $this = this;
            path = path + "?nocache=1";
            let promise = new Promise((resolve, reject) => {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        if(fn) fn(this.responseText);
                        $this.root.activeAsync--;  
                        resolve(this.responseText);
                    } else {
                        
                    }
                };
                xhttp.open("GET", path, true);
                xhttp.send();    
            });
            return promise;     
        }
    })
);




// Tip for newer developers:
// You can also define a module without using the addModule function by passing SmartModule
// to itself and telling it to use its reference with a boolean operator
// Note that this does NOT add a module to the SmartModule.modules list!  It is still
// accessible with the this.root variable in your custom modules, however

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
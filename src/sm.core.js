/* --------------------------------------------------------------------------------------------------------------------------------
sm.core.js
Version 0.1 Alpha
Smart Modules - Core functionality

Written By Devin Crowley
devin [at] devincrowley [dot] com

-------------------------------------------------------------------------------------------------------------------------------- */

"use strict";
const SmartModule = (function() {

    let allowMultipleInstances = false; // Set to true if you want to allow multiple instances of this library to be available.
    let collapseLoader = false; // Collapses the loaded modules into a single line in the console - Set to false for debugging issues
    let instances = 0;          // PRIVATE -- Tell us if smartModule is already instantiated
    let activeInstance = null;  // If we only a allow a single instance of this library and an instance already exists, return it instead of creating a new instance
    let version = "0.0.1a" ;
    
    // The root functionality of the smartModule object - Please note the uppercase vs lowercase names for the API vs the loader
    function smartModule(options) {
        SmartModule.STATE_UNKNOWN = -1;
        SmartModule.STATE_IDLE = 0;
        SmartModule.STATE_GETFILE = 1;
        SmartModule.STATE_BUSY = 2;
        SmartModule.STATE_AWAIT = 3;

        if(!SmartModule.instances) SmartModule.instances = 0;
        SmartModule.instances++;
        instances = SmartModule.instances;  // Private variable - We need to know how many instances are running prior to initialization.  Passed back to the pre-initialized state.

        // Custom (optional) options provided by the user
        if(!options) options = {};  // Rather than work with "undefined", let's work with an empty object
        let useExistingReference = options.useExistingReference;    // If we are trying to create another instance of the API, this tells us to return the original instance instead of creating a new one
        if(options.allowMultipleInstances) allowMultipleInstances = true; // Potentially hazardous:  Allows multiple instances of the API to run at the same time.
        let initFunction = options.init;
        SmartModule.rootPath = options.rootPath || SmartModule.rootPath;
        SmartModule.moduleDirectory = options.moduleDirectory || "modules";
        // Make sure we have appropriate slashes within the full module path
        if(SmartModule.moduleDirectory.charAt(SmartModule.moduleDirectory.length-1) == "/")  SmartModule.moduleDirectory = SmartModule.moduleDirectory.slice(0 ,SmartModule.moduleDirectory.length-1);
        if(SmartModule.rootPath.charAt(SmartModule.rootPath.length-1) != "/")  SmartModule.rootPath += "/";
        SmartModule.moduleAbsolutePath = SmartModule.rootPath + SmartModule.moduleDirectory + "/";

        // Allows accessing the active smart module session from any module as an alternative to the "moduleName.root" variable.  
        // Note that this variable will break if you allow multiple instances of the API to be running simultaneously! 
        SmartModule.activeInstance = this;   
        
        // Load any modules that are being requested with the "include" argument
        if(options.modules) {
            SmartModule.loadModule(options.modules);
        }

        // useExistingReference tells us to return an already existing reference to this API if it exists
        if(SmartModule.instances > 1 && !allowMultipleInstances) {
            if(!useExistingReference) console.warn(`Attempted to create multiple SmartModule API instances.  Multiple instances are currently disabled.`);
            SmartModule.instances = 1;  // We are passing the original instance back instead of creating a new one, so keep instances at 1
            instances = 1;
            return activeInstance;
        }
        activeInstance = this;
        const $root = this;
        this.blankSection = "";
        this.blankSection = ""; // Defines a blank cross section variable to be used for the "New" menu item
        this.version = version;
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

        this.activeAsync = 0; // Active number of asynchonous things happening in the background

        // Show a description of this application in the console window (Optional)
        if(this.description) console.info(`%c${this.description}`, "font-size:1.0em;font-weight:bold;background-color:black;color:yellow;padding:10px;min-width:500px;line-height:0.25em;text-align:center;");        
        // If collapseLoader is true, all of the loaded modules and their info will be grouped in the console
        if(collapseLoader) console.groupCollapsed("%cClick Here to View Loaded Cross Section Modules","border-radius:5px;padding:5px; background-color:blue;color:white"); // Groups the loading of modules into a single group to prevent cluttering the console.

        // Begin initialization after DOM is fully loaded

        document.onreadystatechange = function () {
            if (document.readyState == "complete") {
                loadModules();
                if(initFunction) initFunction($root);
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
        this.loadModule = function(moduleName) {
            if(!moduleName) throw "loadModule(moduleName): A module name or path is required but was not given!"
            let path = null;
            if(moduleName.search(".js") !== -1) path = moduleName;  // If a URL is given, load that.  If not, use the modules/sm.modulename.js location
            if(!path) path= SmartModule.moduleAbsolutePath + `sm.${moduleName}.js`;
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
        this.addModule = function(moduleName, moduleFunction, moduleInfo) {
            moduleInfo = moduleInfo || {};
            // Check if we have any descriptions, versions, or dependency requirements info for this module
            if(typeof moduleFunction == object) {
                moduleInfo.description = moduleFunction.description || moduleInfo.description;
                moduleInfo.version = moduleFunction.version || moduleInfo.version;
                moduleInfo.requires = moduleFunction.requires || moduleInfo.requires;
            }            
            addModule(moduleName, moduleFunction, moduleInfo);
        }

        // When the API is first initialized, see which modules have been requested for loading and load each one
        function loadModules() {
            SmartModule.modules.map(module=>{
                addModule(module.moduleName, module.moduleFunction, module.moduleInfo);
            })
            if(SmartModule.moduleExtensions) {
                SmartModule.moduleExtensions.map(module=>{
                    addModule(module.moduleName, module.moduleFunction, module.moduleInfo, true);
                })            
            }
        }
        
        // Add modules to this API and still have access to root variables, objects, prototypes, and functions.
        // Checks for dependencies during the module loading process to make sure they're available, regardless
        // of which modules are loaded first.  Description is optional and may be passed in the 'fn' arg instead.
        // If appendToModule is true, this module will extend an existing module and add functionality to it
        function addModule(mod, fn, modInfo, appendToModule = false) {
            
            modInfo = modInfo || {};
            let description = modInfo.description || false;
            
            let requirements = modInfo.requires;
            if(!appendToModule) {
                if(smartModule.prototype[mod]) throw new Error(`Warning!  A module with the name ${mod} already exists!  `);
                smartModule.prototype[mod] = fn;
                if(typeof fn === "object") {
                    smartModule.prototype[mod].root = $root; // Assign a root variable to any collection modules
                    smartModule.prototype[mod].moduleName = mod; // Assign a module name variable to any collection modules
                }
            } else {
                // We're extending an already existing module (appending to the module object).
                if(!smartModule.prototype[mod]) {
                    throw `Cannot extend module "${mod}" since it's not defined or loaded!  The extension description is: ${modInfo.description[0]}, ${modInfo.description[1]}`;
                }
                if(typeof smartModule.prototype[mod] == "object") {
                    smartModule.prototype[mod] = { ...smartModule.prototype[mod], ...fn };
                } else {
                    throw `Cannot extend module "${mod}" since it's not a collection!  The extension description is: ${modInfo.description[0]}, ${modInfo.description[1]}`;
                }
            }
            // Dependency check
            if(requirements) {
                requirements.map(r=>{
                    if(!smartModule.prototype[r] && SmartModule.moduleNames.indexOf(r) == -1) {
                        console.warn(`Module Dependency Issue:  Module "${mod}" requires module "${r}" which is wasn't found.  This may cause errors to be thrown!`);
                    }
                });
            }
            if(description && options.showModuleInfo === true) {
                $root.showModuleInfoApi(description[0], description[1]);
                $root.modulesLoaded.push(`${mod} : ${description[1]}`);
            } else if (options.showModuleInfo === true) {
                $root.showModuleInfoApi(mod, "Single-function Module Loaded");
                $root.modulesLoaded.push(`${mod} : Untitled Single-function Module`); {}
            } 
            else {
                $root.modulesLoaded.push(`${mod} : No description`);
            }            
        }
    }

    // Completed, pass back the smart module instance
    if(instances > 1 && !allowMultipleInstances) {
        return activeInstance;
    } else {
        return smartModule;
    }
    
})();

// ---------------------- CORE MODULES ------------------------- //

// Adds modules to a module array which will be parsed after everything else is done loading.
// This allows us to check dependencies between modules to be sure they're available after all
// module files are done loading.
SmartModule.addModule = function(moduleName, moduleFunction, moduleInfo) {
    moduleInfo = moduleInfo || {};
    // Check if we have any descriptions, versions, or dependency requirements info for this module
    if(typeof moduleFunction == "object") {
        moduleInfo.description = moduleFunction.description || moduleInfo.description;
        moduleInfo.version = moduleFunction.version || moduleInfo.version;
        moduleInfo.requires = moduleFunction.requires || moduleInfo.requires;
    }
    if(!this.modules) { this.modules = []; this.moduleNames = []; }
    if(this.moduleNames.includes(moduleName)) {
        throw `Module ${moduleName} tried to load but it conflicts with an already loaded module with the same name!`;
    }
    this.modules.push({ moduleName : moduleName, moduleFunction : moduleFunction, moduleInfo : moduleInfo});
    this.moduleNames.push(moduleName);
};

// Extends an already defined module by appending to the existing module if it's an object
SmartModule.extendModule = function(moduleName, moduleFunction, moduleInfo) {
    moduleInfo = moduleInfo || { description : [moduleName, "No Module Extension description given"] };
    // Check if we have any descriptions, versions, or dependency requirements info for this module
    if(typeof moduleFunction == "object") {
        moduleInfo.description = moduleFunction.description || moduleInfo.description;
        moduleInfo.version = moduleFunction.version || moduleInfo.version;
        moduleInfo.requires = moduleFunction.requires || moduleInfo.requires;
    }
    if(!this.moduleExtensions) { this.moduleExtensions = []; }
    this.moduleExtensions.push({ moduleName : moduleName, moduleFunction : moduleFunction, moduleInfo : moduleInfo});
};

// This let's us know the root path to sm.core.js for getting relative paths to the modules directory
SmartModule.rootPath = (()=> {
    var scripts= document.getElementsByTagName('script');
    var path= scripts[scripts.length-1].src.split('?')[0];
    var mydir= path.split('/').slice(0, -1).join('/')+'/';
    return mydir;
})();

// Load required styles for modal dialogs and other smart module related HTML
// Get the path to the sm.core.js file so we can find its relative CSS file
let link = document.createElement("link");
link.rel = "stylesheet";
link.href=SmartModule.rootPath + "css/style.css";
document.querySelector("head").append(link);

// Absolute path to modules:  This can be changed by the user with an option during the initialization of the API
SmartModule.moduleAbsolutePath = SmartModule.rootPath + "modules/";

// Loads a module file from the modules directory or the path given (BEFORE initialization!)
SmartModule.loadModule = function(moduleName) {
    // If we have an array of files to load, cycle through and load all of them.
    if(Array.isArray(moduleName)) {
        moduleName.map(m=>SmartModule.loadModule(m));
        return;
    }
    if(!moduleName) throw "SmartModule.loadModule(): A module name or path is required but was not given!"
    let path = null;
    if(moduleName.search(".js") !== -1) path = moduleName;  // If a URL is given, load that.  If not, use the modules/sm.modulename.js location
    if(!path) path= `${SmartModule.rootPath}modules/sm.${moduleName}.js`;
    var scriptTag = document.createElement("script"); // create a script tag
    scriptTag.src = path; // set the source of the script to your script
    var scriptContainer = document.getElementsByTagName("script")[0].parentElement;    
    scriptContainer.append(scriptTag); // append the script to the DOM
}

// File reading and writing
SmartModule.addModule("fileio", ({
        description : ["fileio", "[Native Module] File Controller: input and output"],
        version : "1.0",
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

// Animate any value over the given time with a simple animation controller
SmartModule.addModule("animate", ({
        description : ["animate", "[Native Module] Animation Controller: Sets the value any given variable over time"],
        version : "1.0",
        // Retrieves a file, then runs the function assigned to fn
        run(options = {}) {
            // options: sourceElement, sourceVariable, from, to, easing, type, tick, appendString
            // Easing is not yet implemented but will be soon!
            let appendString = options.appendString || 0;
            let totalTime = options.time;
            let timeStart = Date.now();
            let timeNow = Date.now();
            let stop = false;
            let variable;
            function Animate() {
                self = this;
                runFrame();
                function runFrame() {
                    timeNow = Date.now();
                    let lerp = (timeNow - timeStart) / totalTime;   // Figure out what percentage of the animation is completed
                    self.percentComplete = lerp;
                    if(lerp > 1) stop = true;                       // 100% animation completed
                    variable = (options.from + ((options.to - options.from) * lerp)) + appendString;
                    if(options.tick) options.onFrame(tick);
                    if(!stop) {
                        requestAnimationFrame(runFrame);
                    } else {
                        variable = options.to;
                    }
                    if(options.sourceElement) {
                        options.sourceElement[options.sourceVariable] = variable;
                    } else {
                        sourceVariable = variable;
                    }        
                }
            }
            return new Animate();
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
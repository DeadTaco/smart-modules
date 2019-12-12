// Quick access to a query selector with chaining.  Can pass an optional function that maps to each returned element.  Can also pass it an existing node list

// This single-function module is accessed with "$" but is loaded from "sm.query.js"

SmartModule.addModule("$", function(querySelector) {
    let thisNode = null;
    if(typeof querySelector == "string") {
        thisNode = document.querySelectorAll(querySelector);
    } else  {
        thisNode = querySelector;
    }
    function $($root, node){
        let self = this;
        this.first = node[0];
        this.last = node[node.length-1];
        this.nodes = node;
        let nodeArray = Array.from(node);
        this.description = ["query", "Tools for document element queries"];
        this.version = "1.0";
        // Hide an element
        this.hide = function() { 
            Array.from(node).map(e => {
                if(e.style.display != "none") e.defStyle = e.style.display;
                e.style.display="none";
            });
            return new $($root, node);
        }
        // Show and element
        this.show = function() { 
            Array.from(node).map(e => {
                if(e.defStyle) { e.style.display = e.defStyle } else { e.style.display="inline"; }
            });
            return new $($root, node);
        }
        // Run a function on each returned element
        this.each = function(fn) { 
            Array.from(node).map(e => { fn(e); });
            return new $($root, node);
        }
        // Add an event to an element
        this.on = function(evt, fn) {
            Array.from(node).map(e => {
                e.addEventListener(evt, fn);
            });
        }
        this.hasClass = function(className) {
            return node[0].classList.contains(className);
        }
        this.toggleClass = function(className) {
            nodeArray.map(n=>{
                if(n.classList.contains(className)) {
                    n.classList.remove(className);
                } else {
                    n.classList.add(className);
                }
            });
            return new $($root, node);
        }
        this.removeClass = function(className) {
            nodeArray.map(n=>{
                n.classList.remove(className);
            });
            return new $($root, node);
        }
        this.addClass = function(className) {
            nodeArray.map(n=>{
                n.classList.add(className);
            });
            return new $($root, node);
        }                   

        // Set a DOM element value
        this.val = function(setValueTo) {
            if(setValueTo) {
                Array.from(node).map(e => {
                    e.value = setValueTo;
                });                
            } else {
                return node[0].value;
            }
            return new $($root, node);
        }
        // Set a DOM attribute value
        this.attr = function(attr, val) {
            if(val !== undefined) {
                Array.from(node).map(e => {
                    e.setAttribute(attr, val);
                });                
            } else {
                return node[0].attributes[attr];
            }
            return new $($root, node);
        }        
        this.width = function(setValueTo) {
            if(setValueTo) {
                Array.from(node).map(e => {
                    if(Number(setValueTo).toString() == "NaN") {
                        e.style.width = setValueTo;
                    } else {
                        e.style.width = setValueTo  + "px";
                    }
                });                
            } else {
                return node[0].clientWidth;
            }
            return new $($root, node);
        } 
        this.height = function(setValueTo) {
            if(setValueTo) {
                Array.from(node).map(e => {
                    if(Number(setValueTo).toString() == "NaN") {
                        e.style.height = setValueTo;
                    } else {
                        e.style.height = setValueTo  + "px";
                    }
                });                
            } else {
                return node[0].clientHeight;
            }
            return new $($root, node);
        }               
        this.append = function(doc) {
            node[0].append(doc);
            return new $($root, node);
        }
        // Appends html from a remote URL
        this.appendHtmlFromUrl = function(path) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
               node[0].innerHTML = this.responseText;
              }
            };
            xhttp.open("GET", path, true);
            xhttp.send();
            return new $($root, node);       
        }
        this.link = function(keyName, setterFunction) {
            
            // Links a variable to a UI element and vice-versa.  Only the first item from a query selector will be used.
            // An optional custom function (fn) may be passed to the setter so a function is run instead of setting its value
            // How does this work exactly?  You link a DOM element (input, checkbox, or other form element) to a SmartModule variable value.
            // If the SmartModule variable value changes, it changes the value in the DOM element as well.  This also works vice-versa.  If the DOM
            // element value changes, the SmartModule.links[keyName].value variable value also changes.

            // The SmartModule variable to watch is:  SmartModule.links[keyName].value

            $root.links = $root.links || {};                // Linked variables to DOM elements - If a linked value changes, the DOM element it's connected to will auto-update
            $root.linkedEvent = $root.linkedEvent || {};    // A list of all DOM elements which are linked to variables in some way.  For event tracking.
            let fn = setterFunction;
            let val = keyName;
            let domNode = node[0];
            if(typeof $root.links[val] != "undefined") {
                throw `Cannot redefine the linked variable named "${val}"!  Unlink the variable first.`;
            }
            $root.links[val] = {};
            $root.links[val].value = {};
            $root.links[val].unlink = function() { $($root, node).unlink(val) };// Allows you to quickly unlink a linked value by calling the unlink function on that value
            // The UI element will automatically change the linked variable value if it changes
            $root.linkedEvent[domNode] = {};
            $root.linkedEvent[domNode].node = domNode;
            $root.linkedEvent[domNode].evt = function() {
                $root.links[val].value = domNode.value;
            };
            domNode.addEventListener("change", $root.linkedEvent[domNode].evt);
            
            // Getters and setters to control I/O - This adds an object that cannot be removed, so be aware!
            Object.defineProperty($root.links[val], "value", {
                get() {
                    return domNode.value;
                },
                set(value) {
                    // Check if an event is mapped to this variable.  If so, trigger it.
                    if($root.events[val]) {
                        $root.events.map(evt => evt(domNode, value));
                    }
                    domNode.value = value;
                }
            });
        }

        this.unlink = function(val) {
            // An alternative to the Csec.links[val].unlink function - Deletes a link between a variable and its UI component
            let domNode = document.querySelector(querySelector);
            $root.linkedEvent[domNode].node.removeEventListener("change", $root.linkedEvent[domNode].evt);
            delete $root.links[val];
            delete $root.linkedEvent[domNode];
        }
    };
    let $root = this;
    return new $($root, thisNode);
},{ description : ["query", "Tools for document queries, accessed via '$'"], requires : null, version : "1.0" });


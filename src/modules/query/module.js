// Quick access to a query selector with chaining.  Can pass an optional function that maps to each returned element.  Can also pass it an existing node list

// This single-function module is accessed with "$" but is loaded from "sm.query.js"

SmartModule.addModule("$", function(querySelector) {
    function sm$(selector){
        this.description = ["query", "Tools for document element queries"];
        this.version = "1.0";        
        this.selector = selector;
        this.element = null;
        let self = this;
        this.nodes = [];
        
        // Initialization - If no element exists, create it.
        this.init = function() {
            // Check for an opening html tag.  If one exists, we are creating an element.
            if(!this.selector) return false;
            switch (this.selector[0]) {
                case '<':
                  var matches = this.selector.match(/<([\w-]*)>/);
                  if (matches === null || matches === undefined) {
                    throw 'Invalid Selector or Node';
                  }
                  var nodeName = matches[0].replace('<', '').replace('>', '');
                  // Adding the new element to a document fragment, in case we want to add a large chunk of HTML with many elements
                  let frag = document.createDocumentFragment();
                  let fragBody = document.createElement("div");
                  frag.append(fragBody);
                  fragBody.innerHTML = this.selector;
                  this.nodes = Array.from(fragBody.childNodes); // Each element from the HTML blob is placed into the nodes array
                  this.last = this.nodes[0];
                  this.first = this.nodes[0];
                  this[0] = this.nodes[0];
                  return this;
                default:
                  this.element = document.querySelectorAll(this.selector); // Element is an array of returned elements from the query
                  this.first = this.element[0]
                  this.nodes = Array.from(this.element);
                  for(let i = 0; i < this.nodes.length; i++) { this[i] = this.nodes[i]; }
                  this.last = this.nodes[this.nodes.length-1];
                  return this.nodes;
              }
        }
        // Hide an element
        this.hide = function() { 
            self.nodes.map(e => {
                if(e.defStyle) { e.style.display = e.defStyle } else { e.style.display="none"; }                
            });
            return self;
        }
        // Show an element
        this.show = function() { 
            self.nodes.map(e => {
                if(e.defStyle) { e.style.display = e.defStyle } else { e.style.display="inline"; }                
            });
            return self;
        }
        // Set the element's inner HTML
        this.html = function(html) {
            if(html) {
                self.nodes.map(e => {
                    e.innerHTML = html;               
                });
                return self;
            } else {
                return e.innerHTML;
            }
        }
        // Run a function on each returned element
        this.each = function(fn) { 
            self.nodes.map(e => { fn(e); });
            return self;
        }
        // Add an event to an element
        this.on = function(evt, fn) {
            self.nodes.map(e => {
                e.addEventListener(evt, fn);
            });
        }
        this.hasClass = function(className) {
            return self.first.classList.contains(className);
        }
        // Toggle, add, and remove classes from the element.  Multiple classes can be passed, separated with spaces
        this.toggleClass = function(classNames) {
            className = classNames.split(" ");
            className.map(c => {
                self.nodes.map(n=>{
                    if(n.classList.contains(c)) {
                        n.classList.remove(c);
                    } else {
                        n.classList.add(c);
                    }
                });
            });
            return self;
        }
        this.removeClass = function(classNames) {
            className = classNames.split(" ");
            className.map(c => {
                self.nodes.map(n=>{
                    n.classList.remove(c);
                });
            });
            return self;
        }
        this.addClass = function(classNames) {
            className = classNames.split(" ");
            className.map(c => {
                self.nodes.map(n=>{
                    n.classList.add(c);
                });
            });
            return self;
        }
        // Set a DOM element value
        this.val = function(setValueTo) {
            if(setValueTo) {
                self.nodes.map(e => {
                    e.value = setValueTo;
                });                
            } else {
                return self.first.value;
            }
            return self;
        }
        // Set a DOM attribute value
        this.attr = function(attr, val) {
            if(val !== undefined) {
                self.nodes.map(e => {
                    e.setAttribute(attr, val);
                });                
            } else {
                return self.first.attributes[attr];
            }
            return self;
        }        
        this.width = function(setValueTo) {
            if(setValueTo) {
                self.nodes.map(e => {
                    if(Number(setValueTo).toString() == "NaN") {
                        e.style.width = setValueTo;
                    } else {
                        e.style.width = setValueTo  + "px";
                    }
                });                
            } else {
                return self.first.clientWidth;
            }
            return self;
        } 
        this.height = function(setValueTo) {
            if(setValueTo) {
                self.nodes.map(e => {
                    if(Number(setValueTo).toString() == "NaN") {
                        e.style.height = setValueTo;
                    } else {
                        e.style.height = setValueTo  + "px";
                    }
                });                
            } else {
                return self.first.clientHeight;
            }
            return self;
        } 
        // Appends HTML or another sm.$ query object to the given element              
        this.append = function(elem) {
            if(elem.constructor.name == "sm$") {
                elem.nodes.map(n=>{
                    self.first.append(n);
                });
            } else {
                self.first.append(elem);
            }
            return self;
        }
        // Appends html from a remote URL
        this.appendHtmlFromUrl = function(path) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
               this.first.innerHTML = this.responseText;
              }
            };
            xhttp.open("GET", path, true);
            xhttp.send();
            return self;       
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
            let domNode = self.first;
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
        return this;
    };
    let elem = new sm$(querySelector);
    elem.init();
    return elem;
},{ description : ["query", "Tools for document queries, accessed via '$'"], requires : null, version : "1.0" });


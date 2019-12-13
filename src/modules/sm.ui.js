"use strict";
SmartModule.addModule("ui", ( 
    {
        description : ["sm.ui.js", "User interface: Dynamic HTML, text popups, and user interface objects"],
        requires : ["fileio"],
        version : "1.0",
        
        // Adds a tooltip to a DOM element/node for mouseover events
        addTooltip : function(element, tooltip) {
            tooltip = tooltip || element.getAttribute("tooltip");
            element.addEventListener('mouseenter', e=>{
                this.showTooltip(e);
            });
            element.addEventListener('mouseleave', e=>{
                this.hideTooltip();
            });            
        },
        showTooltip : function(element) {
            console.log("Show a tooltip for this element", element);
        },
        hideTooltip : function() {
            console.log("Hide a tooltip for this element.");
        },        

        // Loads a template html file and appends it to the dialog variable "template".  This returns a promise, so you can use the ().then operator for async operations
        loadTemplate : function(templateName) {
            let root = this.root;
            let $this = this;
            if(!this.template) this.template = {};
            return root.fileio.getFile(`${templateName}`, (template) => {
                let fragment = document.createDocumentFragment();
                let body = document.createElement("body");
                body.innerHTML = template;
                fragment.appendChild(body);
                let templates = fragment.querySelectorAll("template");
                Array.from(templates).map(t=>{
                    $this.template[t.getAttributeNames()[0]] = t.content;
                });
            });
        },

        // Process a template and assign variables to it.  Return a new document fragment with the template variables replaced with actual values.
        // This will NOT modify the template itself and only return a clone of it.
        htmlFromTemplate(templateName, values) {
            let $this = this;
            if(!this.template) return false;  // Templates are loaded and defined within the API init() function.  Don't proceed if they don't exist!
            if(!this.template[templateName]) {
                throw new Error(`in SmartModule "${this.moduleName}" -- Cannot find a template named "${templateName}"`);
            }

            let newFragment = this.template[templateName].cloneNode(1);    // Duplicate the template node so we don't affect the template itself
            
            // Go through each node in the template and process it.  Duplicate the node if it's being passed an array value
            function parseNode(newNode) {
                if(newNode.childNodes.length > 0) {
                    Array.from(newNode.childNodes).map(e=>parseNode(e));
                } else {
                    parseLocalNode(newNode);
                   
                    function parseLocalNode(thisNode) {
                        var searchNode = thisNode.textContent;
                        var regexp = /\{\{.*?}}/g;
                        var match, matches = [];                         
                        // Let's look for ALL variables defined in the template with {{variablename}} and assign their values.
                        // Let's also allow dotted variable names, such as {{myVariable.length}} for arrays and text
                        while ((match = regexp.exec(searchNode)) != null) {
                            matches.push(match.index);
                            var val = match[0];
                            var dotVal;
                            val = val.replace("{{", "").replace("}}", "");  // Get rid of any brackets around the variable
                            var dotSplit = val.split(".");  // Split the variable if it has a dot value and get that dot value to pass to the main variable
                            if(dotSplit.length > 1) {
                                dotVal = values[dotSplit[0]][dotSplit[1]];
                            } else {
                                dotVal = values[dotSplit[0]];
                            }
                            var replaceVar = new RegExp( match[0], "g");
                            // If the variable is an array, duplicate the node for each value in that array
                            if(Array.isArray(dotVal)) {
                                dotVal.map(v=>{
                                    var clonedNode = thisNode.parentNode.cloneNode();
                                    clonedNode.innerHTML = thisNode.textContent.replace(replaceVar, v);
                                    if(!thisNode.parentNode.parentNode) {
                                        throw new Error(`in SmartModule "${$this.moduleName}", nodeFromTemplate() Error -- The template array named "${[dotSplit[0]]}" must be contained within a tag or it has another array defined within the same tag.`);
                                    }                                    
                                    thisNode.parentNode.parentNode.insertBefore(clonedNode, thisNode.parentNode);   
                                    parseNode(clonedNode);                                    
                                });
                                if(thisNode.parentNode) thisNode.parentNode.remove();   // Remove the template node placeholder since we cloned it
                            } else {    
                                searchNode = searchNode.replace(replaceVar, dotVal);
                                thisNode.textContent = searchNode;          // Set the new HTML to swap out variable placeholders with actual variable values
                            }
                            
                        }      
                    }              
                }
                return newNode;
            }

            // All done, return the new document fragment with the applied values
            return parseNode(newFragment);
            
        },
        // Make an element draggable via clicked position, optional dragElement selects the element that allows the dragging to take place.  Options is an object containing options
        // Options are currently: container -> Lock this draggable element to inside this element, don't allow the dragged element to go outside of it
        draggable(domElement, dragElement = false, options = {}) {
            if(typeof domElement == "string") {
                domElement = document.querySelector(domElement);
            }
            if(typeof dragElement == "string") {
                dragElement = document.querySelector(dragElement);
            }
            options = options || {};
            options.container = options.container || window;
               if(typeof domElement == "string") {
                domElement = document.querySelector(domElement);
            }            
            if(typeof options.container == "string") {
                options.container = document.querySelector(options.container);
            }
            if(options.keepOnTop) domElement.style.zIndex = 10000;   // Keep modal dialogs always on top
            let movementLocked = [false,false]; // Mouse is outside the container.  Don't allow movement.
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            let startPos = [0,0];    // Starting offset position of mouse
            if (dragElement) {
              // if present, the header is where you move the DIV from:
              dragElement.onmousedown = dragMouseDown;
            } else {
              // otherwise, move the DIV from anywhere inside the DIV:
              domElement.onmousedown = dragMouseDown;
            }
          
            function dragMouseDown(e) {
              e = e || window.event;
              e.preventDefault();
              // get the mouse cursor position at startup:
              movementLocked = [false,false]
              pos3 = e.clientX;
              pos4 = e.clientY;
              startPos = [e.clientX - domElement.offsetLeft, e.clientY - domElement.offsetTop];
              document.onmouseup = closeDragElement;
              // call a function whenever the cursor moves:
              document.onmousemove = elementDrag;
            }
          
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();

                // Make sure the mouse is still within the container element.  If not, abort the operation.
                if(e.clientX < options.container.offsetLeft || e.clientX < 0) {
                    return false;
                }
                if(e.clientY < options.container.offsetTop || e.clientY < 0) {
                    return false;
                }
                if(e.clientX > (options.container.offsetLeft + options.container.clientWidth) || e.clientX > window.innerWidth) {
                    return false;
                } 
                if(e.clientY > (options.container.offsetTop + options.container.clientHeight) || e.clientY > window.innerHeight) {
                    return false;
                }                                          

                // An option can be passed to lock the element into a container
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;

                // Make sure we stay in the given container or window
                let sourceSize = [domElement.clientWidth, domElement.clientHeight];
                let sourceOffset = [domElement.offsetLeft, domElement.offsetTop];
                let containerSize = [], containerOffset = [];
                if(options.container == window) {
                    containerSize = [window.innerWidth, window.innerHeight];
                    containerOffset = [0,0];
                } else {
                    containerSize = [options.container.clientWidth, options.container.clientHeight];
                    containerOffset = [options.container.offsetLeft, options.container.offsetTop];
                }
                if(sourceSize[0] + sourceOffset[0] > containerSize[0] + containerOffset[0]) {
                    domElement.style.left = (containerSize[0] + containerOffset[0]) - sourceSize[0] + "px";
                    movementLocked[0] = true;
                }
                if(sourceSize[1] + sourceOffset[1] > containerSize[1] + containerOffset[1]) {
                    domElement.style.top = (containerSize[1] + containerOffset[1]) - sourceSize[1] + "px";
                    movementLocked[1] = true;
                }
                if(sourceOffset[0] < containerOffset[0]) {
                    domElement.style.left = containerOffset[0] + "px";
                    movementLocked[0] = true;
                }
                if(sourceOffset[1] < containerOffset[1]) {
                    domElement.style.top = containerOffset[1] + "px";
                    movementLocked[1] = true;
                }               
                pos3 = e.clientX;
                pos4 = e.clientY;              
                // set the element's new position:
                domElement.style.top = (domElement.offsetTop - pos2) + "px";
                domElement.style.left = (domElement.offsetLeft - pos1) + "px";  
        
            }
          
            function closeDragElement() {
              // stop moving when mouse button is released:
              document.onmouseup = null;
              document.onmousemove = null;
              startPos = [0,0];
            }

        },
        // Centers an element in the window, or center it to the given element
        center(domElement, centerTo) {
            if(typeof domElement == "string") {
                domElement = document.querySelector(domElement);
            }
            // Get window dimensions
            let sourceHalfSize = [domElement.clientWidth/2, domElement.clientHeight/2];
            let targetSize = [window.innerWidth,window.innerHeight];
            let targetOffset = [0,0];
            if(centerTo) {
                if(typeof centerTo == "string") {
                    centerTo = document.querySelector(centerTo);
                }
                targetSize = [centerTo.clientWidth, centerTo.clientHeight];
                targetOffset = [centerTo.offsetLeft, centerTo.offsetTop];
            }
            let targetCenter = [(targetSize[0]/2) - targetOffset[0], (targetSize[1]/2) - targetOffset[1]];
            domElement.style.left = targetCenter[0] - sourceHalfSize[0] + "px";
            domElement.style.top = targetCenter[1] - sourceHalfSize[1] + "px";
        },
        // Converts an element into a modal/draggable window
        makeModal(domElement, dragElement = null, container = null) {
            if(typeof domElement == "string") {
                domElement = document.querySelector(domElement);
            }
            if(typeof dragElement == "string") {
                dragElement = document.querySelector(dragElement);
            }
            if(typeof container == "string") {
                container = document.querySelector(container);
            }
            this.draggable(domElement, dragElement, { "container" : container, "keepOnTop" : true });
            domElement.style.position = "absolute";
            domElement.style.width = "200px";
            domElement.style.height = "200px";
            this.center(domElement, container);
            return domElement;
        },

        // Creates a dialog box object with provided options
        createDialog(options = {}) {
            /*
            showDialog options object Example:  -> MOVE TO MARKDOWN DOCUMENT!
            ({ title : "Some title", 
               buttons : [
                    "ok" : someFunctionWhenClicked,
                    "cancel" : someotherFunction
               ],
               html : "My text content or HTML here",
               width : 100,
               height : 100
               classes : "dialogclass otherclass",
               onClose : function() {} // Function that runs when the dialog is closed
            });   
            */         
            let title = options.title || "Title";
            let html = options.html || "Empty";
            let width = options.width || 300;
            let height = options.height || 300;
            let newDialogBox;
            if(Number(width).toString() != "NaN") width = width + "px";
            if(Number(height).toString() != "NaN") height = height + "px";
            let classes = false;
            if(typeof options.classes == "string") {
                classes = options.classes.split(" ");
            } else {
                classes = false;
            }
            // Generate the dialog framework - Not using a SmartModule template file since they may not be available
            let newDialogHTML = `
                <div class="title">
                    <span class="title_text">Dialog Title</span>
                    <span class="closedialog">X</span>
                </div>
                <div class="content">
                    Dialog Content
                </div>
                <div class="footer">

                </div>
            `;
            let dBox = document.createElement("div");
            dBox.classList.add("sm-dialog");
            dBox.innerHTML = newDialogHTML;
            document.body.append(dBox);
            this.makeModal(dBox, dBox.querySelector(".title"), document.body);  // Make this a floating, draggable modal dialog
            
            // Apply HTML content from options
            dBox.querySelector(".title_text").innerHTML = title;
            dBox.querySelector(".content").innerHTML = html;

            // Dialog X button event
            dBox.querySelector(".closedialog").onclick = function(){ newDialogBox.remove(); }

            // Add buttons and their events to the dialog if they're defined.
            let footer = dBox.querySelector(".footer");
            if(options.buttons) {
                Object.keys(options.buttons).map( key=>{
                    let button = document.createElement("button");
                    footer.append(button);
                    button.innerHTML = key;
                    button.classList.add("sm-button");
                    button.addEventListener("click", ()=>options.buttons[key](newDialogBox));
                });
            } else {
                // Default "OK" button if not other buttons are defined
                let button = document.createElement("button");
                footer.append(button);
                button.innerHTML = "Ok";
                button.addEventListener("click", function(){
                    newDialogBox.remove();
                });
            }
            // We have a dialog to work with, so get it prepared
            // Use internal resizeDialog function to set the dialog size
            resizeDialog(dBox, options.width, options.height);

            // Resizes the given dialog box and recenters it back to its original position.  This function is called in a few places.
            function resizeDialog(dialogBox, width, height) {
                if(Number(width).toString() != "NaN") width = width + "px"; 
                if(Number(height).toString() != "NaN") height = height + "px";
                // Calculate offsets for the newly sized dialog
                let oldHeight = dialogBox.clientHeight;
                let oldWidth = dialogBox.clientWidth;
                let oldOffsetLeft = dialogBox.offsetLeft;
                let oldOffsetTop = dialogBox.offsetTop;
                // Apply new values and offsets to the main dialog box
                dialogBox.style.height = height;
                dialogBox.style.width = width;
                dialogBox.style.left = (oldOffsetLeft - ((dialogBox.clientWidth - oldWidth)/2)) + "px";
                dialogBox.style.top = (oldOffsetTop - ((dialogBox.clientHeight - oldHeight)/2)) + "px";
                // Resize and position the title, contents, and footer
                let dialogTitle = dialogBox.querySelector(".title");
                let dialogContent = dialogBox.querySelector(".content");
                let dialogFooter = dialogBox.querySelector(".footer");
                let dialogBoxHeight = dialogBox.clientHeight;
                let titleHeight = dialogTitle.clientHeight;
                let footerHeight = dialogFooter.clientHeight;
                dialogContent.style.height = (dialogBoxHeight-(titleHeight + footerHeight)) + "px";
            }

            // Add any classes from options.classes.  Remove any previously added classes just in case
            // dBox.classList.forEach(e=>dBox.classList.remove(e))
            // dBox.classList.add("sm-dialog");
            if(classes) {
                classes.map(cls => {
                    dBox.classList.add(cls);
                });
            }
            // Dialog Boxes are their own object and have their own internal methods.  Dialog() is used as a class object
            function Dialog(box) {
                let self = this;
                this.node = box;
                this.hide = function() {
                    if(options.onClose) options.onClose(self);
                    self.node.style.display = "none";
                    return self;
                }
                this.show = function() {
                    self.node.style.display = "block";
                    return self;
                }
                this.resize = function(width,height) {
                    resizeDialog(self.node, width, height);
                    return self;
                }
                this.html = function(html) {
                    if(html) { self.node.querySelector(".content").innerHTML = html; return self; }
                    else return self.node.querySelector(".content").innerHTML;
                }
                this.title = function(html) {
                    if(html) { self.node.querySelector(".title").innerHTML = html; return self; }
                    else return self.node.querySelector(".title").innerHTML;                    
                }
                this.footer = function(html) {
                    if(html) { self.node.querySelector(".footer").innerHTML = html; return self; }
                    else return self.node.querySelector(".footer").innerHTML;                    
                }
                this.remove = function() {
                    if(options.onClose) options.onClose(self);
                    self.node.parentNode.removeChild(self.node);
                    delete this;    // This most likely does nothing.  Any variables pointing to this dialog need to be nullified.
                }           
            }
            newDialogBox = new Dialog(dBox);
            return newDialogBox;
        }

    }
));
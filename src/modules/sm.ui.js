"use strict";
SmartModule.addModule("ui", ( 
    {
        description : ["sm.ui.js", "User interface: Dynamic HTML, text popups, and user interface objects"],
        requires : ["fileio"],
        version : "1.0",
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
            let root = this.root;
            let $this = this;
            if(!this.template) return false;  // Templates are loaded and defined within the API init() function.  Don't proceed if they don't exist!
            if(!this.template[templateName]) {
                throw new Error(`in SmartModule "${this.moduleName}" -- Cannot find a template named "${templateName}"`);
                return false;
            }

            let newFragment = this.template[templateName].cloneNode(1);    // Duplicate the template node so we don't affect the template itself
            
            // Go through each node in the template and process it.  Duplicate the node if it's being passed an array value
            function parseNode(newNode) {
                if(newNode.childNodes.length > 0) {
                    Array.from(newNode.childNodes).map(e=>parseNode(e));
                } else {
                    let newContent = newNode.textContent;
                    
                    //  Object.keys(values).map(val => {
                    //     parseKey(val);
                    // });
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
    }
));
SmartModule.addModule("dialog", ( 
    {
        description : ["sm.dialogs.js", "API Dialogs, text popups, and user interface objects"],
        requires : ["fileio"],
        // Show a progress bar for the given linked variable
        getElement(elementType) {
            let root = this.root;
            if(root.domElements[elementType]) return root.domElements[elementType]; // If the element already exists, just return it as-is

            // Element didn't exist, so figure out which element we need to create and pass it back
            if(elementType == "progressbar") {
                console.log("Create a progress bar!");  
            }

            return false; // No elements of the given type are defined!  Return false.
        },
        // Loads a template html file and appends it to the dialog variable "template"
        loadTemplate : function(templateName) {
            let root = this.root;
            let $this = this;
            if(!this.template) this.template = {};
            return root.fileio.retrieveFile(`${templateName}`, (template) => {
                
                if(!this.root.templates) this.root.templates = {};
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
        nodeFromTemplate(templateName, values) {
            let root = this.root;
            let $this = this;
            if(!root.templates) return false;  // Templates are loaded and defined within the API init() function.  Don't proceed if they don't exist!
            if(!root.templates[templateName]) {
                throw new Error(`in SmartModule "${this.moduleName}" -- Cannot find a template named "${templateName}"`);
                return false;
            }
            let newFragment = root.templates[templateName].cloneNode(1);
            
            // Go through each node in the template and process it.  Duplicate the node if it's being passed an array value
            function parseNode(node) {
                if(node.childNodes.length > 0) {
                    Array.from(node.childNodes).map(e=>parseNode(e));
                } else {
                    let newContent = node.textContent;
                    
                    Object.keys(values).map(val => {
                        parseKey(val);
                    });

                    function parseKey(val) {
                        var reg = new RegExp('{{' + val + '}}');
                        var isArray = Array.isArray(values[val]);
                        var containsPlaceholder = newContent.search(reg) > -1;
                        if(isArray && containsPlaceholder) {
                            try {
                                values[val].map(v=>{
                                    
                                        var clonedNode = node.parentNode.cloneNode();
                                    
                                        clonedNode.innerHTML = node.textContent.replace(reg, v);
                                        if(!node.parentNode.parentNode) {
                                        throw new Error(`in SmartModule "${$this.moduleName}", nodeFromTemplate() Error -- The array named {{${val}}} must be contained within a tag or it has another array defined within the same tag.`);
                                        }
                                        node.parentNode.parentNode.insertBefore(clonedNode, node.parentNode);                                    
                                        parseNode(clonedNode);


                                });
                                if(node.parentNode) node.parentNode.remove();
                            } catch(e) {
                                console.error(e.name + " " + e.message);
                                return node;
                            }                            
                        } else {
                            newContent = newContent.replace(reg, values[val]);
                        }                    
                        node.textContent = newContent;
                    }
                }
                return node;
            }

            // All done, return the new document fragment with the applied values
            return parseNode(newFragment);
            
        },
    }
));
"use strict";
SmartModule.addModule("fileio", ({
        description : ["sm.filecontrol.js", "File reading and parsing"],
        // Retrieves a file, then runs the function assigned to fn
        retrieveFile : function(path, fn) {
            let promise = new Promise((resolve, reject) => {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        if(fn) fn(this.responseText);
                        resolve(this.responseText);
                    } else {
                        // reject("Unsuccessful");
                    }
                };
                xhttp.open("GET", path, true);
                xhttp.send();    
            });
            return promise;     
        },
        // Loads a template html file and appends it to the API root variable "templates"
        loadTemplate : function(templateName) {
            let root = this.root;
            return this.retrieveFile(`${templateName}`, (template) => {
                
                if(!this.root.templates) this.root.templates = {};
                let fragment = document.createDocumentFragment();
                let body = document.createElement("body");
                body.innerHTML = template;
                fragment.appendChild(body);
                let templates = fragment.querySelectorAll("template");
                Array.from(templates).map(t=>{
                    root.templates[t.getAttributeNames()[0]] = t.content;
                });
            });
        },
    })
);

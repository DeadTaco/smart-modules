"use strict";
SmartModule.addModule("fileio", ({
        description : ["sm.fileio.js", "File Controller: input and output"],
        // Retrieves a file, then runs the function assigned to fn
        retrieveFile : function(path, fn) {
            path = path + "?nocache=1";
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
    })
);

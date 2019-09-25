# **The Smart Modules API**
### *API Version 1.0.0 -- Documentation version 1.0*

The Smart Module API is a small ES6+ Javascript framework for quickly binding multiple modules into a single package.  Each module has access to other modules that are loaded, as well as any variables within the API itself.

## Getting Started
You will need to have the sm.core.js script loaded into your page.  It controls the loading of all other modules.
To load modules, you can add their script to your page with a script source tag, or by using the Smart Module loader.

Activate the smart module API with the `new` syntax.  There are some optional parameters that may be passed to the API, as seen here:
```JAVASCRIPT
const sm = new SmartModule({
    init: ()=> { 
        doThings();     // Run a function after initialization
    },
    showModuleInfo: true   // Show info for loaded modules in the console,
});
```

* `init` : *fn* -- will run the given function after the API is fully initialized
* `showModuleInfo` : *bool* -- If true, this will show the loaded modules and their information in the browser console for debugging purposes
* `moduleDirectory` -- *Default is "modules"* Sets the directory name of your modules directory if it is different from the default `./modules` location
* `rootPath` -- *Default is the absolute path to sm.core.js* - Sets the path to check for resources such as templates and modules.  If `moduleDirectory` isn't set by the user, the path to modules will be `rootPath/modules`.  Note that the `rootPath` variable always ends itself with a slash, even if you didn't add it at yourself.

A variable named `SmartModule.moduleAbsolutePath` will be generated once the API has been initialized.  This will give you the absolute path to the modules directory should you need it.

---
### **Using the Smart Modules loader**
You will need a `modules` directory placed in the same location as the sm.core.js file unless you want to manually assign a path to your modules.  All of your modules should be placed into that directory if you want to use the modules loader without using the optional `path` parameter.

It's not mandatory for modules to be located in the modules directory, but makes it easier to organize the modules.

To load a module, *prior to initializing the API with `new`* you will need to use the `SmartModule.addModule` function.  The Smart Module will check the modules directory for a file titled `sm.modulename.js` where modulename is the module name.  Be sure your module name is titled the same as the filename between sm. and .js
```JAVASCRIPT
SmartModule.loadModule("mymodule"); // Loads modules/sm.mymodule.js
```

**Optionally, a full path can be provided to the module file you wish to load.  For example:**
```JAVASCRIPT
SmartModule.loadModule("https://somedomain.com/sm.modulename.js");
 ```

 The SmartModule API has a variable available for you named `SmartModule.rootPath` to get the absolute path to the sm.core.js file.  This can be used to place your modules into your own custom directory located relative from the sm.core.js file.  Please note that if you loaded the sm.core.js file through an ajax or dynamic load script call, the `SmartModule.rootPath` variable may be incorrect.  This will also affect loading modules without providing a full path to the module file as the `SmartModule.rootPath` is used to locate the modules directory.

*Note: For debugging, during development time it may be preferable to load your module with a `<script>` tag. Errors may not show which line they occurred on in a dynamically loaded script*

---
### **Creating Modules**

#### Adding modules *before* creating a new smart module instance
It is best practice to load all modules *before initializing the API with the `new` operator*.  This allows all modules to run dependency checks prior to loading.  

The following steps are for creating new modules *only* if you have not yet added an instance of the Smart Module API to your project with the `new` operator.  To define a new module, use `SmartModule.addModule(moduleName, moduleFunction, `*<`optional`*>` moduleInfoObject)`.
- `moduleName` is the object name that will be used to access the module.  For example, assuming `sm` is the variable name given to your instance of the SmartModule and `moduleName` is "mymodule", then you would access it and its functions with `sm.mymodule`
- `moduleFunction` defines the object that defines the functionality of the module.  It can be a single function, a *collection* of functions and items (a javascript object), a string, a number, etc.
- `moduleInfoObject` is an optional object that you can pass to the function that describes your module.  
    - The parameters that may be passed are as follows:
    ```JAVASCRIPT
    { 
        description : ["module name", "A description of my module"],
        requires : ["fileio", "ui", "anothermodule"],
        version : "1.0"
    }
    ```
    **_An explanation of these variables is found in the next section.  If you are using a *collection* object you can define these from inside the object instead as seen in the next section as well._**
    
Modules are typically collections of functions, variables, and objects, but they can also be a single function or other element.  
To define a *collection*, the syntax is fairly basic:
```JAVASCRIPT
SmartModule.addModule("mymodule", ({
        description : ["My Module", "This is my custom smart module!"],
        requires : ["fileio", "dialog"],
        version : "1.0",
        add : function(a,b) {
            return a + b; 
        },
        subtract : function(a,b) {
            return a-b;
        }
    })
);
```

Notice the optional `description`, `requires`, and `version` variables:
- `description` *array* : (Optional) This passes a description of the module to the console, as well as to the `SmartModule.modules` variable so you can see which modules have been loaded, mainly for debugging purposes.  The first value is the module name, and the second is the description.
- `requires` *array* : (Optional) A list of module dependencies for this module to run properly.  If your module requires functionality from another module, add it to the list.  A warning will be given if a module is loaded and none of its dependencies can be found.
- `version` *string* : The current version of this module.  This may become important if another module relies on the use of this module, but needs a version older or newer than the current version.

When you create a new instance of the API with a `new` operator, your modules added with the `SmartModule.addModule` function will load and initialize.  You cannot add new modules with the `SmartModule.addModule` function after creating a new instance of the API.  Instead, you will have to use the post-initialized functionality as seen here:

#### Adding modules after the API has already been initalized with the `new` operator
If you've already initialized the API, you'll lose access to the SmartModule.addModule function.  Instead, you will have to rely on the instance of the API you defined with the `new` operator and use its `addModule` function.  It works exactly the same way as the `SmartModule.addModule` function, but if you have dependencies, they will have to be loaded in the order of their needs.  It is always best to load the modules **before** initializing the API.  For example:
```JAVASCRIPT
    const sm = new SmartModule();
    sm.addModule("mymodule", ({
            description : ["My Module", "This is my custom smart module!"],
            requires : ["fileio", "dialog"],
            add : function(a,b) {
                return a + b; 
            },
            subtract : function(a,b) {
                return a-b;
            }
        })
    );
```

#### Accessing other modules and their variables/functions from your collection

When you define a new module as a collection, it is given its own variable named `root`.  This gives you access to the core smart module definition and any modules it has loaded.  Take a look at the following:
```JAVASCRIPT
SmartModule.addModule("mymodule", ({
        description : ["My Module", "This is my custom smart module!"],
        requires : ["fileio", "dialog"],
        logFileContent : function(path) {
            this.root.fileio.readfile(path, fileContent => {
                console.log(fileContent);
            }); 
        },
        echoToConsole : function(text) {
            console.log(text);
        }
    })
);
```
`this.root.fileio.readfile` is accessing the fileio module and utilizing its `readFile` function.  It is always preceded with `this` since it is a variable assigned only to your module.  You will always need to use the `this.root` variable in a collection of functions if you want access to other modules.

*Can't I just grab functions from the `SmartModule.modules` array?*  
You can, but that is an array without any direct pointers to the module functions.  You'd have to access the modules index number and then its function, such as `SmartModule.modules[0].moduleFunction.someFunction`.  Having `this.root` available to you makes it much easier.

#### Creating a `single function` or `single value` module
You can pass any type of element to the `SmartModule.addModule` function.  This includes a single function or even just a variable or object.
```JAVASCRIPT
const description = ["some variable", "This is just a variable.  Not much more."];
SmartModule.addModule("somevar", "This module is just a string!", description);
```
---
## Core and Included Modules

Smart Module includes some core modules to help you get started.  They are:
### **`fileio`** &nbsp; (built-in)
A collection of file reading tools.  At this time it has only a file reading function.  For file writing, you would need to have server get/put functionality, so this is not included in `fileio`.
- `fileio.readFile(url, fn)` *async function* : Reads the file at the given URL and optionally runs a function on the returned data.  This function uses `promise` syntax and can therefore also utilize the `.then()` operator, ie:
    ```JAVASCRIPT
    sm.fileio.readFile("/files/myfile.txt").then( data => console.log(data) );
    ```

### **`ui`** &nbsp;  (sm.ui.js)
A collection of tools for parsing HTML templates, showing modal dialogs, and doing basic HTML manipulation.  **See the "Using Templates" section below for details on how to utilize templates to speed up your page designs.**
* `ui.loadTemplate(path)` Gets all templates defined in the given template file and adds them to the sm.ui.template definitions variable.
* `ui.htmlFromTemplate(templateName, values)` Parses the given template and assigns values to its variable placeholders within that template\

<b style='color:red'>ui functions Currently in development</b>
* `ui.showModalWindow({options})` Show a modal window
* `ui.showProgressBar()` Shows a progress bar with given values
* `ui.jsonToFormValues()` Reads JSON and assigns form values based on the key names in the JSON object\
There are more that will also be added as time goes on.

### `$` &nbsp; (sm.query.js)
A query tool for quickly finding elements in a document.  Uses standard query syntax, such as $("#someid .someclass").  Similar to frameworks such as jQuery, you can chain query functions together.
* `$(query)` returns elements in the given query
* `$(query).first` Gets the first element in a query
* `$(query).last` Gets the last element in a query
* `$(query).nodes` Gets a node list of elements returned in a query
* `$(query).link(keyName, `*`setterFunction`*`)` Links a variable to the element's value so if either one changes, it also changes the value of its linked counterpart.  An optional `setterFunction` allows you to run a function when a value for the variable is set.
* `$(query).unlink(keyName)` Unlinks a variable from the element's value
* `$(query).hide()` Hides an element
* `$(query).show()` Shows an element
* `$(query).each(fn)` Runs a function on all returned elements in a query
* `$(query).on(event, fn)` Adds an event to a DOM element
* `$(query).val(value)` Assigns a value to a DOM element or gets the value if no arguments are given
* `$(query).append(element)` Appends an element
* `$(query).appendHtmlFromUrl(url)` Gets HTML from the given URL and appends it to the element\

Many more query functions are being developed.

---

## Using Templates and Template Files
Templates can be used to quickly append HTML to an element.  With the ui module, you can also fill placeholders with variable values within the template itself.  All templates are defined in HTML with `<template>` tags and all variable placeholders are defined with double brackets: `{{somevariable}}`

Let's take a look at the default template.html (*Figure A*) file located in the templates directory.
```HTML
<!-- Figure A: template.html -->
<template testtemplate>
    <h1>
        {{title}}
    </h1>
    A list with {{list.length}} items!
    <ul>
        <li>{{container}}{{list}}</li>
    </ul>
</template>

<template my_template_name>
    You should see some HTML here
    {{html}}
</template>
```

You'll see that each template has its name included in the tag.  This is the template name that will be defined in the Smart Module's `ui.template` object.

### **Loading template files**

Templates are not loaded by default.  You will have to load them with the `ui` module.  Here's an example:
```JAVASCRIPT
const sm = new SmartModule();
sm.ui.loadTemplate(SmartModule.rootPath + "templates/template.html").then(()=>{
    document.body.append(sm.ui.htmlFromTemplate('testtemplate', { 
        title : 'Loaded Successfully!', 
        container : '<span class="myclass">', 
        list : ["dog","cat","gorilla","snake","aardvark"]
    }));
});
```

You may notice that the `ui.loadTemplate` function has a `.then()` operator.  This is because the `loadTemplate` function is asynchronous and returns a `promise`.  This is useful so you can tell it to load multiple templates in sequence or use `async wait` to wait until all templates are loaded before progressing.

After your template is loaded, you can use the `ui.htmlFromTemplate(templateName, values)` function to pass it values for its variable placeholders.  Using the template HTML example above, let's pull out the code from our `.then()` operator in the first example, *Figure B*.
```JAVASCRIPT
// Figure B
document.body.append(sm.ui.htmlFromTemplate('testtemplate', { 
    title : 'Loaded Successfully!', 
    container : '<span class="myclass">', 
    list : ["dog","cat","gorilla","snake","aardvark"]
});
```

Notice that the value names in the second argument match the names in the HTML template.  This is so they are mapped to eachother.  You may also notice that we have an array being passed to the `list` variable as `["dog","cat","gorilla","snake","aardvark"]`.  When an array is passed as a value to a template, it will duplicate whatever element holds the variable and add each array index value in sequence to the duplicated elements.

For example, take a look at this line: `<li>{{container}}{{list}}</li>`\
We'll get to the `{{container}}` variable in a second.  Let's focus on `{{list}}`

The `{{list}}` variable will be passed each of the values in the `list` array.  As each value is passed, its containing `<li>` element will be duplicated, along with any other variables that may be included within the same tag.  The template will show: 
```HTML
<h1>Loaded Successfully!<h1>
A list with 5 items!
<ul>
    <li><span class="myclass">dog</span></li>
    <li><span class="myclass">cat</span></li>
    <li><span class="myclass">gorilla</span></li>
    <li><span class="myclass">snake</span></li>
    <li><span class="myclass">aardvark</span></li>
</ul>
```
Notice how the `<li>` tag was duplicated to show each value of the `list` array.  It also duplicated the `{{container}}` variable's value, which happens to be `<span class="myclass">`.  Let's take a look at that `{{container}}` variable.

Take a look back at *Figure B*.  If you have a variable defined as an HTML tag, it will add that tag and include any subsequent variables into it.\
`<li>{{container}}{{list}}</li>` is replacing `{{container}}` with a `<span>` and also including the `{{list}}` variable within the `<span>`.  

One thing you cannot do, however, is have two array variables within the same tag.  For example, if we had:
```HTML
<li>{{somelist}}{{list}}</li>
```
If `{{somelist}}` was an array, and `{{list}}` was also an array, you'd get an error.  It would cause an infinite loop since each would be passing an array into each of the duplicated items over and over again.  The `ui` module won't allow that and will throw an error at you to let you know you have two arrays within the same tag.

### Dot values in a template
In *Figure A* you may have noticed that we have a variable in the template named `{{list.length}}`.  You can pass a dotted value to a template for quick access to things such as array lengths.  Note that you can only have a single dotted value and you cannot pass a dotted value as a function such as `myvariable.toString()`.  Adding this capability would be a potential security issue if it were to be evaluated with an `eval` function.

## States

The SmartModule API has predefined states that you can use to determine what the current process is.  Those states are:
* SmartModule.STATE_UNKNOWN : -1
* SmartModule.STATE_IDLE : 0
* SmartModule.STATE_GETFILE : 1
* SmartModule.STATE_BUSY : 2
* SmartModule.STATE_AWAIT : 3

States can be retrieved with your `new` Smart Module object.
```JAVASCRIPT
const sm = new SmartModule();
sm.ui.loadTemplate(SmartModule.rootPath + "templates/template.html");
console.log(sm.state);  // Should return 1 (STATE_GETFILE) since we're still retrieving the file
```
You can also get the active number of promises by getting `sm.activeAsync`

## Examples
See the examples directory to see how to use templates and map them to variables which are passed to them.









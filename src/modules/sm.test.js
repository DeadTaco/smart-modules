// This is a test module that can be loaded with a <script> tag or with SmartModule.loadModule("test"), 

SmartModule.addModule("test", ({
        description : ["Test Module", "This is merely a template for dynamic loading of modules"],
        test : function() {
            return "This test function works."  ; 
        },
        testFunc2 : function() {
            return "This is another test function.";
        }
    })
);
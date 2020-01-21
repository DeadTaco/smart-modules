"use strict";
SmartModule.addModule("math", ( 
    {
        description : ["math", "Extended Math Functions"],
        requires : [],
        version : "1.0",
// NUMERIC FUNCTIONS
    
    abs(num) {
        return Math.abs(num);
    },

    rnd(num) {
        return Math.random() * num;
    },

    rndRange(min, max) {
        return (Math.random() * (max - min)) + min;
    },
    // Return a random integer from <min> to <max>
    rndRangeInt(min, max) {
        return Math.round((Math.random() * (max - min)) + min);
    },
    // Return a random integer from 0 to <num>
    rndInt(num) {
        num = num || 100000;
        return Math.round(Math.random() * num);
    },

    // Round a number to the nth place (precision).  Use negative precision to round by whole numbers instead of by decimal
    round(number, precision) {
        precision = precision || 0;
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    },

    // Convert Degrees to radians
    degToRad(deg) {
        return deg * (Math.PI / 180);
    },

    // Pad a number with leading zeroes to force it to a certain string size.  Size is the minimum string length.
    pad(num, size) {
        var s = "00000" + num;
        return s.substr(s.length - size);
    },
        
          
    }
));
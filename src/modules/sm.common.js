csecLib.showModuleInfo("sm.common.js", "All common functions, such as math.  Many have been made redundant via ES2015+ and can be removed.");	

/* Clean all null or other values out of an array */
var cleanArray = function(arr, deleteValue) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == deleteValue) {         
      arr.splice(i, 1);
      i--;
    }
  }
  return arr;
};		

/* Convert an SQL formatted date (dashes) to a date with slashes */
function dateConvert(dateString) {
    if(dateString.length > 0) {
        var dateconf = dateString.split("-");
        if(dateconf.length == 1) return dateString;
        return dateconf[1] + "/" + dateconf[2] + "/" + dateconf[0]
    }
    return "";
}	
    
function debug(html) {
    $("#debug").html($("#debug").html() + "<br/>" + html);
    var objDiv = document.getElementById("debug");
    objDiv.scrollTop = objDiv.scrollHeight;			
}    

/* Validate a file or directory name */
function validate(elem){
    var alphaExp = /^[ \[\]0-9\.a-zA-Z_-]+$/; 
    if(elem.value.length < 1) return true;
    if(elem.value.match(alphaExp)){
        return true;
    }else{
      //  alert("That is not a proper file name.  Don't use \' / \" \\ ? * \' in the name!");
        elem.focus();
        return false;
    }
}    

/* Dynamically resize an object if the browser window size changes */
function updatePageSize(options) {
    var jqueryobj = options.jqueryobject;
    var pageHeight = $(window).height();
    var pageWidth = $(window).width();
    if(!options.marginright) { options.marginright = 0; }
    if(!options.marginleft) { options.marginleft = 0; }
    if(options.top) { $(jqueryobj).css({ top: options.top + 'px' }); }
    if(options.left) { $(jqueryobj).css({ left: options.left + 'px' }); }
    var position = $(jqueryobj).position();
    if(!options.top) { $(jqueryobj).height(pageHeight - position.top - 10) ; } else { $(jqueryobj).height(pageHeight - options.top); }
    if(!options.left) { $(jqueryobj).width(pageWidth - position.left - options.marginright) ; } else { $(jqueryobj).width(pageWidth - options.left - options.marginright); }
    
    if(options.maxwidth) { if($(jqueryobj).width() > options.maxwidth) { $(jqueryobj).width(options.maxwidth); }}
    if(options.maxheight) { if($(jqueryobj).height() > options.maxheight) { $(jqueryobj).height(options.maxheight); }}
    if(options.minwidth) { if($(jqueryobj).width() < options.minwidth) { $(jqueryobj).width(options.minwidth); }}
    if(options.minheight) { if($(jqueryobj).height() < options.minheight) { $(jqueryobj).height(options.minheight); }}
    
}
    
// Basic math functions, shortened.
function sin(num) { return Math.sin(num); }
function cos(num) { return Math.cos(num); }		
function tan(num) { return Math.tan(num); }	
function asin(num) { return Math.asin(num); }	
function acos(num) { return Math.acos(num); }	
function atan(num) { return Math.atan(num); }	
function sqrt(num) { return Math.sqrt(num); }	
function log(num) { return Math.log(num); }	
function abs(num) { return Math.abs(num); }	
function ceil(num) { return Math.ceil(num); }	
function floor(num) { return Math.floor(num); }	
function round(num) { return Math.round(num); }	
function exp(num) { return Math.exp(num); }	
function rnd(num) {	return Math.random() * num; }

// Return a random number in a range
function rng(min, max) {
	return (Math.random() * (max-min))+min;
}		

// Return a random integer
function rndi(num) {
	return Math.round(Math.random() * num);
}	

// Return a random integer in a range
function rngi(min, max) {
	return Math.round((Math.random() * (max-min))+min);
}	

// Convert Degrees to radians
function degToRad(deg) {
	return deg * (Math.PI / 180);
}

    
/**
 * Return an Object sorted by it's Key
 */
var sortObjectByKey = function(obj){
    var keys = [];
    var sorted_obj = {};

    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            keys.push(key);
        }
    }

    // sort keys
    keys.sort();

    // create new array based on Sorted Keys
    jQuery.each(keys, function(i, key){
        sorted_obj[key] = obj[key];
    });

    return sorted_obj;
};    

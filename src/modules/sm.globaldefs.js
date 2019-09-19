// Global definitions for Sectionmaker
csecLib.showModuleInfo("sm.globaldefs.js", "Global variable definitions and settings");

var recentFiles = [];
var coordinates = [];

// Data for all leaders in this section
var leaderData = {
    lastPoint : {},     // Last clicked point while creating a leader
    leaders : [],       // Array of all custom leaders
    gap : 10,           // Gap between the text and the landing
    landingSize : 30 
};
var mode3d = false;         // Are we in 3d mode?
var drawingLeader = false;  // Are we currently drawing a leader?
var svgPattern;             // A list of pattern definitions (materials)
var pattern;                // A list of pattern definitions (materials)
var gridLayer; // Layer for grid
var dimLayer; // Layer for dimensions and text
var skyLayer; // Layer for sky
var globalScale = 11; // Pixels per foot
var crossSection = []; // Contains all of the internal code to tell it how to draw the section (for saving and editing purposes)
var sprite;
var svgDraw;
var draw;
var activeGroup; // The current segment group being drawn to - For keeping each segment separated by groupings - Added Nov 6 2018
var activeSprite; // The current sprite that's being edited in the sprite edit window
var activeSpriteMoveIcon; // The icon that goes over the active sprite to move it around
var toolItemCount = 0;
var toolItem = [];
var browser = browserName();
if (browser.indexOf("IE") > -1) {
    var isIE = true;
}
var isIE = false;
var svgPadding = 10;
var svgDefaultHeight = 300; // Default height for SVGs.  This is subtracted from svgHeightAdjustment to get final svgHeight
var svgHeightAdjustment = 0;    // Allows the user to adjust the height of the SVG - The value is in inches, but the text input is in feet (on purpose)
var svgHeight = svgDefaultHeight + svgHeightAdjustment;    // Current section height.  For getting proper viewport and vertical dimension lines
var filter = [];    // An array holding all of the filters for the section
var autoUpdate = true;
var showGrid = false;
var totalWidth = 0;
var filechanged = false;
var svgJson;
var waitingForInput = false;
var sectionInput = [];
var customDimension = [];
var skyImage = "sky_cloudy1.jpg";
var skyFade = "linear";
var skyOffset = 0;
var menuActive = false;
var loadingFile = false;
var clickRegions = [];          // An array of clickable red rectangles overlaid on the section (appear when mouse moves over them)
var hasLaneMarkings = false;
var laneMarkingPosition = 400; // The Y location of the lowest lane marking
var titlePositionOffset = 5; // How far down to move the title if lane markings are detected.  Gets the lane marking Y coord and adds to it
var currentSpriteForEdit;
var loadingError = false; // Throws a loading error if images aren't loaded on time during a file load, so it refreshes
var totalSprites = 0;
var spriteLookup = [];
var nodefs = require("fs");
var currentCard; // ID of the last selected card
var clipboard = []; // For copy/pasting card data
var disableFilters = false; // Allow filters?
var zoomOverride = false;   // The user is manually zooming, so don't auto zoom as the svg dimensions change
var currentScale = 1;       // Current scale of the svg
var pzController;       // Pan/Zoom events controller
var svgTitle = "";
var arrowScale = 1;
var arrowStyle = {};
var autoScale = true;   // Automatically scale the SVG to fit the window
var currentArrowStyle = "archtick";
var oldLeaderData;  // When redefining a leader or moving it, we need the old leader data to fill in the values in the leader editor
var ditchType = {};
var bermType = {};
/* Get list of recently opened / saved files */
if (typeof localStorage.recentFiles != "undefined" && localStorage.recentFiles.length > 0) {
    recentFiles = JSON.parse(localStorage.recentFiles);
}

coordinates.x = 0;
coordinates.y = 0;
var debugMode = false; // Turn on all debugging if true
var currentFileName = "";
var version = nw.App.manifest.version;
var zoomlevel = 1;
var devlib = new DevLib();
var tempPath = process.cwd() + "\\resources";
var convertExe = process.cwd() + "\\resources\\convert\\convert.exe";   // Using Imagemagick's converter for SVG to JPG
var inkscapeExe = process.cwd() + "\\resources\\convert\\inkscape.exe"; // Inkscape is currently not being used, but it would be handy for SVG editing later
var gui = require('nw.gui');
var stateUndo = []; // Undo and redo buffers for undoing and redoing stuff
var stateRedo = []; // Undo and redo buffers
var globalDimensionOptions = { fontSize : 16, tickStyle : "archtick" };
if(!localStorage.noArgs) {
	var startupArgs = gui.App.argv;
} else {
	localStorage.noArgs = "";
	var startupArgs = null;
}


var reset = function() {
    gui.Window.get().reload()
}

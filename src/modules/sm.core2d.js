/* --------------------------------------------------------------------------------------------------------------------------------
sm.core2d.js
Sectionmaker - 2D Core functionality
This module is currently being redesigned to be locked into its own namespace for the sake of organization and better practices.
Most of this code was written in 2009 and needs a major overhaul to reach ES2015+ standards and functionality

Future modules will NOT be IE compatible as there is no way to get proper 3d libraries to work in IE.
-------------------------------------------------------------------------------------------------------------------------------- */
csecLib.showModuleInfo("sm.core2d.js", "Core 2D Functions - Slowly being converted to a library");

let firstRun = true; // App is just starting up, so some things are drawn differently in the beginning

// Window resizing needs to update the cross section
$(window).resize(function () {
    setCanvasDimensions();
    if(mode3d) { csecLib.section3d.resize(); $("canvas").show(); } else { $("canvas").hide(); }
});

// STARTUP!
// Main startup functionality - Runs only once!
SmartModule.fn.module("startup", function() {
     $("html").show(); // Content is loaded.  Show the HTML.
    // if (!csecLib.section3d.initialized) return; // Don't progress until we're fully initialized
    if(!mode3d) csecLib.section3d.pause();
    populateRecentFileMenu(); // Adds files to the recent file menu    
    makeCanvas(); // Prepares the SVG canvas
    definePatterns(); // Defines materials for each segment
    defineSprites(); // Prepares the sprites (objects) to place above ground
    preCacheSprites(); // Get all of the sprites into memory, so loading a cross section doesn't bog down the system.        
    defineArrows(); // Defines the arrows for dimensions
    defineNonBoxes(); // Defines the SVG code for each ditch and berm type (non boxes = non box surface type)
    addToolItem(); // Adds the first segment
    addMenuFunctions(); // Prepares menu functionality
    setupQuickKeys(); // Sets up quick keys for the application, such as left/right arrows
    setCanvasDimensions(); // Sets the dimensions of the DIV holding the SVG
    setupDragDrop(); // Sets up drag and drop file capability
    defineMenus(); // Defines menus in the menu bar
    setupSubSurfaces(); // Sets up the dialog and UI for sub surface settings
    setupMouseWheel(); // Sets up the zooming and panning capability of the mouse wheel  
    versionCheck(); // Checks if a new version of the application is available.  If so, download it.
    $("body").show(); // Don't show the body until everything is loaded, otherwise you get a crap ton of text all over the place before it initializes
    $("html").on("contextmenu", function (e, ui) { // Disable right-click for general blank areas
        e.preventDefault();
    });



    $(window).resize(); // Force the SVG to fit into its container div        

    var checkDebugMode = devlib.fileSystem.readFile(devlib.fileSystem.getPath(process.execPath) + "debug_mode");
    if (checkDebugMode) debugMode = true;

    if (debugMode) {
        curWin.showDevTools();
    }

    var curWin = nw.Window.get();
    curWin.on('close', function (e) {
        nw.App.quit();
        require('nw.gui').App.quit();
    });

    // Check if we have a file to load on startup.  If so, load and parse it with loadSectionFile()
    startupArgs = startupArgs || [];
    if (startupArgs.length > 0) {
        console.log("Startup argument: Load file -> " + startupArgs);
        var file = startupArgs.toString();
        if (devlib.fileSystem.getFileExtension(file) == "csec") loadSectionFile(file);
    }

    fixMenuOffsets(); // Places menu items under their respective parents properly
    prepareCrossSection();
    csecLib.blankSection = csecLib.fileControl.getSaveData();  // Defines what a "New" section would look like as a blank section - For "NEW" menu item
});

// -- Checks if a new version of the application is available.  If so, download it.  This is NOT a saved CSEC File Check!
function versionCheck() {
    var dataDir = "J:\\apps\\SectionMaker";
    var newestVersion = devlib.fileSystem.readFile(dataDir + "\\bin\\" + "version.txt");
    var thisVersion = devlib.fileSystem.readFile(devlib.fileSystem.getPath(nw.process.execPath) + "\\version.txt");
    console.log(`Newest Available Version is: \t${newestVersion}Current Version is: \t\t\t${thisVersion}`);
    if (Number(newestVersion) > Number(thisVersion)) {
        var spawn = require('child_process').spawn;
        console.log("Version Mismatch!  A new version is probably available.");
        popup({
            width: 400,
            height: 250,
            title: "You are using an old version",
            html: "A new version of this app is available.  Do you want to update?",
            buttons: {
                "No": closePopup,
                "Yes": function () {
                    console.log("Spawning Child");
                    require('child_process').exec('cmd /c start "" cmd /c ' + dataDir + "\\installer\\install.bat silent", function () {
                        console.log("DONE!");
                    });
                    setTimeout(function () {
                        nw.App.quit();
                    }, 100); // Close the app, we have the installer running now.

                }
            }
        });
    }
}

// Switch between 2d and 3d modes
function switchMode() {
    mode3d = !mode3d;
    if(mode3d) {
        $("canvas").show();
        csecLib.section3d.unpause();
        csecLib.section3d.resize();
        $("#mode3d").text("Switch to 2D View");
        $("#zoomwindow").hide();
        if(Object.entries(csecLib.section3d.modelLibrary).length === 0 && csecLib.section3d.modelLibrary.constructor === Object) csecLib.section3d.cacheModels();
    } else {
        $("canvas").hide();
        $("#zoomwindow").show();
        csecLib.section3d.pause(); 
        $("#mode3d").text("Switch to 3D View");
    }
    prepareCrossSection();
}

// Put all sprites into memory so we don't have to load them as they're needed - prevents lag and performance issues
function preCacheSprites() {
    var spritesToCache = [];

    Object.keys(sprite.sprites).forEach(function (key) {
        spritesToCache.push(sprite.sprites[key].sprite);
    });

    var totalSprites = spritesToCache.length;

    var img = [];
    var imgcachedcount = 0;


    for (var i = 0; i < totalSprites; i++) {
        img[i] = $("<img>");
        img[i].hide();
        img[i].width(10);
        img[i].attr("src", "sprites/" + spritesToCache[i]);
        img[i].on('load', function (e) {});
        $("body").append(img[i]);
        // console.log(`Loading sprite ${i} of ${totalSprites}`);
    }
}


// Puts a sprite editor dialog over a card when the sprite editor is active
function liveSpriteTweak(slider) {
    updateSpriteValues(slider, true);
    var sdata = currentSpriteForEdit.value.split(",");

    var img = spriteLookup[sdata[5]];
    var foundIndex = 0;
    // Get parent card info for thickness calcs
    var parentCard = getCardAtIndex(getCardIndex($("#spriteeditbox").attr("activecard")));
    var toolid = $(parentCard).attr("toolindex");
    var spriteGroup = draw.select(`[spritegroupid='${toolid}']`).members[0]; // Get the sprite group holding this sprite
    var spriteid = $(`[uid='${sdata[5]}']`).attr("id");
    if (spriteid) {
        activeSprite = spriteGroup.select(`#${spriteid}`).members[0];
    }

    var thickness = Number($(parentCard).children("[toolid=thickness]").val()); // The thickness of the section this sprite is attached to

    if (activeSprite) {
        sdata[1] = Number(sdata[1]) || 0; // cx
        sdata[2] = Number(sdata[2]) || 0; // cy
        sdata[3] = Number(sdata[3] * 0.01 || 0); // scale
        sdata[4] = Number(sdata[4]) || 0; // rotate
        sdata[2] -= ((thickness - 1) / 2) * gs(1); // Adjust sprite position when thickness is not default
        // sdata[5] is the sprite id
        activeSprite.rotate(0);
        activeSprite.cx(activeSprite.base.x + sdata[1]);
        activeSprite.cy(activeSprite.base.y - (activeSprite.bbox().height / 2) + sdata[2]);
        activeSprite.width(activeSprite.base.width * (1 + sdata[3]));
        activeSprite.height(activeSprite.base.height * (1 + sdata[3]));
        activeSprite.center(activeSprite.base.x + sdata[1], activeSprite.base.y - (activeSprite.bbox().height / 2) + sdata[2]);
        activeSprite.rotate(sdata[4]);

    } else {
        if (autoUpdate) {
            // This was causing issues after putting all sprite items into a sprite group, parented by a segment group
            // prepareCrossSection();
        }
    }
}

// For the live sprite tweak function above, this will set the values of the sprite editor to match the active sprite's settings
function updateSpriteValues(obj, noUpdate) {

    var action = $(obj).attr("editsprite");
    if (action == "slider_offsetx") $("#sprite_offsetx").val($(obj).val());
    if (action == "slider_offsety") $("#sprite_offsety").val($(obj).val());
    if (action == "slider_scale") $("#sprite_scale").val($(obj).val());
    if (action == "slider_rotate") $("#sprite_rotate").val($(obj).val());

    $("#slider_offsetx").val($("#sprite_offsetx").val());
    $("#slider_offsety").val($("#sprite_offsety").val());
    $("#slider_scale").val($("#sprite_scale").val());
    $("#slider_rotate").val($("#sprite_rotate").val());

    var spritedata = currentSpriteForEdit.value.split(",");
    spritedata[1] = $("#sprite_offsetx").val();
    spritedata[2] = -$("#sprite_offsety").val();
    spritedata[3] = $("#sprite_scale").val();
    spritedata[4] = $("#sprite_rotate").val() || 0;
    if (spritedata[3] < -99) {
        spritedata[3] = -99;
        $("#sprite_scale").val(-99);
    }
    currentSpriteForEdit.value = spritedata.join(",");

}


// Begin loading a section file (.csec)
function loadSectionFile(file) {
    var fileData = devlib.fileSystem.readFile(file);
    if (!fileData) {
        alert("File error or file not found.");
        return;
    }
    clearAll("toolbar");
    file = file || $("#input_loadfile");
    window.document.title = "CSEC " + version + " - " + file;
    // Add the file to the recent file list for the file menu
    addFileToRecent(file);
    currentFileName = file;
    processFile(fileData);
    closePopup();
    stateUndo = []; // Clear the Undo and redo buffers for undoing and redoing stuff
    stateRedo = []; // Clear the Undo and redo buffers  
    resetView(); // Zoom to extents
}

// After a section file is loaded, begin parsing it
function processFile(file) {
    csecLib.fileControl.processFile(file); // [ISSUE C0004] PUSHING TO API
}


// -- One of the most important functions, this will update the SVG with the current data in the cards.  It's run any time a change is made to the section
function updateSVG(new_section) {
    svgHeight = svgDefaultHeight + svgHeightAdjustment;
    hasLaneMarkings = false; // Reset the lane marking check, so it can re-determine if lane markings are still visible
    laneMarkingPosition = 400; // The Y location of the lowest lane marking.  Starts at 500
    clickRegions = [];
    svgJson = new_section;
    /* Prepare the SVG canvas and definitions.  If we're in 3d mode, it skips this part */
    if (!mode3d) {

        draw.clear();
        definePatterns();
        defineSprites();
        defineArrows();
        defineFilters();

        if (showGrid) {
            drawGrid();
        }
        dimLayer = draw.group(); // A group that holds all of the dimensions
        skyLayer = draw.group(); // A group that holds the sky and its gradients    
        var height = draw.bbox().height;

        moveTo(svgPadding, svgHeight); // Move the entire drawing to the bottom of the SVG viewport


        drawCrossSection(new_section); // Draw the section

        // draw.fixSubPixelOffset();

        dimLayer.front();

        if (showGrid) {
            gridLayer.opacity(0.4);
            gridLayer.front();
        } // Make this a number to show the grid layer

        var height = draw.bbox().y2;
        // draw.size(gs(totalWidth) + (svgPadding * 2), height); // This appears to have zero bearing on the actual height...
        drawSky();
        drawLeaders();


        /* Keep all click regions in the foreground! */
        for (var i = 0; i < clickRegions.length; i++) {
            clickRegions[i].front();
            clickRegions[i].height(svgHeight + 100);
        }

        // draw.height(draw.bbox().height); // This appears to have zero bearing on the actual height...
        setCanvasDimensions(); // Sets the dimensions of the DIV holding the SVG
    } else {
        csecLib.section3d.drawCrossSection(new_section); // Begin drawing the section in 3d
    }
      
}


// Draw the sky background for the section
function drawSky() {
    var verticalOffset = gs(-csecLib.$("#raisesky").val());
    var width = draw.bbox().width - 20;
    // var height = dimLayer.rbox().height * 1;
    var sectionWidth = gs(totalWidth) + 20;

    var scale = 0.44;
    var scalex = scale + 0.04;

    var img = skyLayer.image("sprites/" + skyImage).loaded(function (loader) {
        if (!img.parent) return; // Don't try to draw the sky if the section is still being drawn in another routine
        if (skyFade == "radial") {
            var gradient = skyLayer.gradient('radial', function (stop) {
                stop.at({
                    offset: 0,
                    color: '#fff'
                });
                stop.at({
                    offset: 0.7,
                    color: '#aaa'
                });
                stop.at({
                    offset: 1,
                    color: '#000'
                });
            });
            gradient.from(0.5, 0.5).to(0.5, 0.5).radius(0.5);
            var ellipse = skyLayer.ellipse(width + 20, svgHeight).move(10, gs(0)).fill({
                color: gradient
            });
            img.maskWith(ellipse);
            ellipse.scale((1 / scale), (1 / scale));
            ellipse.back();
        }

        if (skyFade == "linear") {
            var gradient = skyLayer.gradient('linear', function (stop) {
                stop.at({
                    offset: 0,
                    color: '#fff',
                    opacity: 0
                });
                stop.at({
                    offset: 0.9,
                    color: '#fff',
                    opacity: 1
                });
            });
            gradient.from(0.5, 0).to(0.5, 1);
            var rect = skyLayer.rect(draw.bbox().width * 2, svgHeight + 20);
            rect.attr({
                fill: gradient,
                'fill-opacity': 1,
                stroke: "#000",
                'stroke-width': 0,
                x: 0,
                y: 0
            });
            rect.move(0, 0);
            rect.back();
            img.back();
            //  if(rect && img) img.maskWith(rect);
        }

        img.scale(scalex, scale * (svgHeight / 300));
        img.opacity(1);
        if (skyFade == "all") img.opacity(0.4);
        img.back();
        img.cx(-84);
        img.cy(-100 );
        img.transform({
            x: 0,
            y: 0
        });
        img.center(0, 0);
        img.move(0, 0);
        if ((img.bbox().width * scale) < sectionWidth) {
            img.scale(draw.width() / img.width(), 0.44 * (svgHeight / 300));
            img.transform({
                x: 0,
                y: 0
            });
            img.center(0, 0);
            img.move(0, 0);
            return;
        }

    });
    // skyLayer.move(0, verticalOffset);
    skyLayer.transform({
        x: 0,
        y: verticalOffset
    });
}

// Goes through each card and begins drawing its section data to the section
function drawCrossSection(data) {
    if (!data) {
        popup("No cross section data was received.  Can't draw anything!");
        return;
    }
    for (var i = 0; i < data.length; i++) {
        var type = data[i].type;
        var texture = false;
        var yoffset = 0;
        activeGroup = draw.group(); // A group that holds all of the items for a segment
        texture = data[i].texture;

        var label = data[i].label;

        // Presets for default section piece type
        if (texture && !(type == "median" && data[i].elevated === true) && type != "ditch" && type != "berm") {
            drawPiece(data[i], "blank");
        } else
            // Elevated medians are drawn in a special way.  Call the 'draw median' function
            if (texture && type == "median" && data[i].elevated === true) {
                drawPiece(data[i], "median");
            } else
                /* Ditches are another special circumstance.  Draw it in a ditch drawing function */
                if (texture && type == "ditch") {
                    drawPiece(data[i], "ditch");
                }
        if (texture && type == "berm") {
            drawPiece(data[i], "berm");
        }

        /* Add a global dimension line if requested */
        if ($("#checkbox_width").is(':checked')) {
            addWidthDim($("#textbox_width").val());
        }


    }

    // If we have defined custom dimensions, let's draw them up!
    if (customDimension.length > 0) {
        addCustomDimensions();
    }
    addTitle($("#textbox_title").val());

}

// Draw a single section piece
function drawPiece(option, preset) {
    var x;
    var y;
    var toolid = option.toolid;
    var leftmost = false;
    var rightmost = false;
    if (svgJson[0].toolid == toolid) {
        var leftmost = true;
    }
    if (svgJson[svgJson.length - 1].toolid == toolid) {
        var rightmost = true;
    }
    var width = option.width;
    var widthvaries = option.widthvaries;
    var texture = pattern[option.texture];
    var addSprite = option.sprite;
    var offset = option.offset;
    if (!offset) {
        offset = 0;
    }
    option.curb = option.side || false;
    var fadeout = option.fadeout;
    var blur = option.blur;
    var spritesbehind = option.spritesbehind;
    var subsurface = option.subsurface;
    var opacity = 1;
    var thickness = option.thickness || 1;
    var thickOffset = (thickness - 1) + (thickness / 2);
    var label = option.label;
    var rightheight = gs(Number(option.rightheight));
    var leftheight = gs(Number(option.leftheight));
    var ditchdepth = gs(Number(option.ditchdepth));
    var ditchtype = option.ditchtype;
    var bermheight = gs(Number(option.bermheight));
    var bermtype = option.bermtype;
    thickness = Number(option.thickness); /* Already has GS (Global Scale) applied later */
    var hidedim = option.hidedim;
    var rollcurb = option.rollcurb;
    var dirtbase = gs(4);
    var centerX, centerY;
    var skewableObject; // This is the final surface object that can be skewed to match the surface elevation slope
    var targetHeight = gs(4) + gs(offset);

    if (preset == "median") {
        /* Draw Dirt */
        if (offset == 0) {
            var rect = drawBox(coordinates.x, coordinates.y + thickness - gs(offset), gs(width), dirtbase + gs(offset), pattern.dirt, 0);
        } else {
            var rect = drawBox(coordinates.x + gs(1), coordinates.y + thickness - gs(offset), gs(width) - gs(2), dirtbase + gs(offset), pattern.dirt, 0); // Dirt directly underneath center of median
            var rect = drawBox(coordinates.x, coordinates.y + thickness - gs(offset) + gs(thickness / 2), gs(width), dirtbase + gs(offset) - gs(thickness / 2), pattern.dirt, 0); // Dirt that spans entire width of the median, but is under the asphalt lip bottom
        }
        /* Draw Median */
        var rect = drawBox(coordinates.x + gs(1), coordinates.y - gs(offset), gs(width) - gs(2), gs(thickness), texture, 1); // Median center with custom material
        skewFeature(rect);
        rect.attr({
            opacity: opacity
        });
        centerX = rect.cx();
        centerY = rect.cy();
        /* Draw Median Curb, left side */
        var rect = drawBox(coordinates.x + gs(0.5), coordinates.y + (thickness - 1) - gs(offset) - leftheight, gs(0.5), gs(thickness) + leftheight + gs(0.5), pattern.concrete, 1); // Concrete curb
        rect.attr({
            opacity: opacity
        });
        var rect = drawBox(coordinates.x, coordinates.y + (thickness - 1) - gs(offset) - leftheight + gs(0.5), gs(0.5), gs(thickness), pattern.asphalt, 1); // Asphalt lip
        rect.attr({
            opacity: opacity
        });
        /* Draw Median Curb, right side */
        var rect = drawBox(coordinates.x + gs(width) - gs(1), coordinates.y + (thickness - 1) - gs(offset) - rightheight, gs(0.5), gs(thickness) + rightheight + gs(0.5), pattern.concrete, 1); // Concrete curb
        rect.attr({
            opacity: opacity
        });
        var rect = drawBox(coordinates.x + gs(width) - gs(0.5), coordinates.y + (thickness - 1) - gs(offset) - rightheight + gs(0.5), gs(0.5), gs(thickness), pattern.asphalt, 1); // Asphalt Lip
        rect.attr({
            opacity: opacity
        });

    } else if (preset == "ditch") {

        // Draw A Ditch.  yes, we're copying code from drawing a ditch, so this should probably be duplicated

        var ditchHeight = ditchdepth || gs(1); // Ditch Depth
        var ditchData = ditchType[ditchtype] || ditchType.Default;
        var ditchElevationAdjustment = 0; // Calculated later - left height and right height difference
        var yAdjust = ditchHeight;
        // If there's a slope, adjust its height to match
        if ((rightheight) > (leftheight)) {
            ditchElevationAdjustment = (leftheight);
        } else {
            ditchElevationAdjustment = (leftheight);
        }
        // ditchElevationAdjustment -= ditchElevationAdjustment * 0.09;  // There's a slight lip that needs to be adjusted to match adjacent ditchs
        // Gets the ground plane UNDER the ditch
        var bground = addGroundPlane({
            nosurface: true,
            noskew: true,
            elevation: -thickness - (ditchHeight / gs(1)) + 1
        });
        var ditchGroup = activeGroup.group();

        var groundPlane = drawBox(
            coordinates.x, coordinates.y - gs(offset) + yAdjust,
            gs(width), gs(thickness), texture, 1
        );
        groundPlane.stroke({
            width: 0
        });
        ditchGroup.add(groundPlane);
        groundPlane.dmove(0, ditchElevationAdjustment);


        // Note:  This sucks, but I have to create a workaround for waterway surfaces since the surface needs to be FLAT while it will
        // be curved underneath.  Warning:  This is not yet set up in 3D!  The 3D view will still have a curved top surface!!!
        // It goes against standard convention, but as this app is being converted to a web app, this hack will have to remain for now.
        
        
        if(ditchtype == "Waterway") { 
            // Waterway hack (My apologies)
            var ditch = ditchGroup.path("M 0,59 V 0 H 0.46875 98.53125 99 v 59");
        } else {
            // Draw the ditch underside
            var ditch = ditchGroup.path(ditchData);
        }
        ditch.attr({
            fill: texture,
            'fill-opacity': 1,
            stroke: "#000",
            'stroke-width': 1,
        });

        ditch.width(gs(width));
        ditch.height(ditchHeight);
        ditch.move(coordinates.x, coordinates.y - gs(offset) - (ditchHeight) + yAdjust);

        // Draw the ditch subsurface under the top surface - v in the formula below controls the ditch surface bottom height (larger = lower)
        // Draw the ditch underside

        var ditch = ditchGroup.path(ditchData);
        ditch.attr({
            fill: pattern.dirt,
            'fill-opacity': 1,
            stroke: "#000",
            'stroke-width': 1,
        });

        ditch.width(gs(width));
        ditch.height(ditchHeight);
        ditch.move(coordinates.x, coordinates.y - gs(offset) - (ditchHeight) + yAdjust);
        ditch.dmove(0, gs(thickness));
        ditch.dmove(0, ditchElevationAdjustment);

        centerX = ditch.cx();
        centerY = ditch.cy();
        skewFeature(ditchGroup);

    } else if (preset == "berm") {

        // Draw a berm

        var bermHeight = bermheight || gs(1); // This needs to be dynamic - right now defaulting to 1 ft
        var bermData = bermType[bermtype] || bermType.Default;
        var bermElevationAdjustment = 0;
        // If there's a slope, adjust its height to match
        if ((rightheight) > (leftheight)) {
            bermElevationAdjustment = (leftheight);
        } else {
            bermElevationAdjustment = -(leftheight);
        }
        // bermElevationAdjustment -= bermElevationAdjustment * 0.09;  // There's a slight lip that needs to be adjusted to match adjacent berms
        // Gets the ground plane UNDER the berm
        var bground = addGroundPlane({
            nosurface: true,
            noskew: true,
            elevation: -(thickness) + 1
        });
        var bermGroup = activeGroup.group();
        var groundPlane = drawBox(
            coordinates.x, coordinates.y - gs(offset),
            gs(width), gs(thickness), texture, 1
        );
        groundPlane.stroke({
            width: 0
        });
        bermGroup.add(groundPlane);
        groundPlane.dmove(0, bermElevationAdjustment);

        // Draw the berm underside
        var berm = bermGroup.path(bermData);
        berm.attr({
            fill: texture,
            'fill-opacity': 1,
            stroke: "#000",
            'stroke-width': 1,
        });

        var bermWidth = berm.bbox().width;
        berm.width(gs(width));
        berm.height(bermHeight);
        berm.move(coordinates.x, coordinates.y - gs(offset) - (bermHeight));
        berm.dmove(0, bermElevationAdjustment);

        // Draw the berm surface - v in the formula below controls the berm surface bottom height (larger = lower)
        // Draw the berm underside
        var berm = bermGroup.path(bermData);
        berm.attr({
            fill: pattern.dirt,
            'fill-opacity': 1,
            stroke: "#000",
            'stroke-width': 1,
        });
        //var bermHeight = berm.bbox().height;
        var bermWidth = berm.bbox().width;
        berm.width(gs(width));
        berm.height(bermHeight);
        berm.move(coordinates.x, coordinates.y - gs(offset) - (bermHeight));
        berm.dmove(0, gs(thickness));
        berm.dmove(0, bermElevationAdjustment);

        centerX = berm.cx();
        centerY = berm.cy();
        skewFeature(bermGroup);


    } else if (option.curb != null && option.rollcurb == true) {
        addRollCurb();

    } else {
        /* Default section piece rectangle */
        addGroundPlane();
        if (option.curb == "left") {
            var rect = drawBox(coordinates.x, coordinates.y - gs(0.5) - gs(offset) - leftheight, gs(0.5), gs(thickness) + gs(0.5), texture, 1);
        }
        if (option.curb == "right") {
            var rect = drawBox(coordinates.x + gs(width) - gs(0.5), coordinates.y - gs(0.5) - gs(offset) - rightheight, gs(0.5), gs(thickness) + gs(0.5), texture, 1);
        }

        addSubSurfaces();
    }

    function addSubSurfaces(options) {
        if (subsurface) {
            var subsurfaces = JSON.parse(subsurface);
            var currentLevel = gs(thickness);
            for (var i = 0; i < subsurfaces.length; i++) {
                texture = pattern[subsurfaces[i].material];
                thickness = subsurfaces[i].thickness;
                var thisPlane = addGroundPlane({
                    nounderground: true
                }); // nounderground:true -> Prevent the addGroundPlane function from drawing the underground dirt for sublayers
                thisPlane.dmove(0, currentLevel);
                currentLevel += gs(subsurfaces[i].thickness); // subsurfaces[i].thickness;
            }
        }
    }

    function addGroundPlane(options) {
        options = options || {};
        options.elevation = gs(options.elevation) || 0;
        y = coordinates.y - gs(offset) - options.elevation;
        x = coordinates.x;
        var l1 = (leftheight * -1) + y;
        var l2 = (leftheight * -1) + gs(thickness) + y;
        var r1 = (rightheight * -1) + y;
        var r2 = (rightheight * -1) + gs(thickness) + y;
        var x1 = x;
        var x2 = x + gs(width);
        var groundPlane = activeGroup.group();
        /* Draw the dirt base first */
        if (options.nounderground != true) {
            var slopedirt = groundPlane.path("m " + x1 + "," + (l1 + gs(1)) + " L " + x1 + "," + (coordinates.y + gs(4)) + " L " + x2 + "," + (coordinates.y + gs(4)) + " L " + x2 + "," + (r1 + gs(1))); // ADD THIS TO CLOSE IT:  + " z"
            slopedirt.attr({
                fill: pattern.dirt,
                'fill-opacity': 1,
                stroke: "#000",
                'stroke-width': 1,
            });


        }

        if (options.nosurface != true) {
            /* Now draw the surface plane */
            var slope = groundPlane.path("m " + x1 + "," + l1 + " L " + x1 + "," + l2 + " L " + x2 + "," + r2 + " L " + x2 + "," + r1 + " z");
            slope.attr({
                fill: texture,
                'fill-opacity': 1,
                stroke: "#000",
                'stroke-width': 1,
                objtype: "surface" // This is just so the returned ground plane has a reference to this object as the ground plane
            });
            centerX = slope.cx();
            centerY = slope.cy();
        }

        return groundPlane;

    }

    /* Skews the object passed to it by the left and right slope difference */
    function skewFeature(ent) {
        y = coordinates.y - gs(offset);
        x = coordinates.x;
        centerX = ent.cx();
        centerY = ent.cy();
        if (leftheight - rightheight < 0) {
            ent.skew(0, (leftheight - rightheight) / 2.1, x, y);
        } else {
            ent.skew(0, (leftheight - rightheight) / 2.1, gs(width), y);
        }
    }

    function addRollCurb() {
        // A roll curb was requested
        addGroundPlane();

        // Roll curb
        if (option.curb == "left") {
            /* Draw Left Side Rollcurb */
            var curb = activeGroup.path("m 368.96875,540.625 0,-16.5 c 8.15143,-0.0867 5.11059,5.1689 12.0809,5.33768");
            curb.attr({
                fill: texture,
                'fill-opacity': 1,
                stroke: "#000",
                'stroke-width': 1,
            });

            var curbHeight = curb.bbox().height;
            curb.move(coordinates.x, coordinates.y - gs(offset) - gs(0.5) - leftheight);
            curb.width(gs(1.5));
        }
        if (option.curb == "right") {
            /* Draw Left Side Rollcurb */
            var curb = activeGroup.path("m 381.04965,540.625 0,-16.5 c -8.15143,-0.0867 -5.11059,5.1689 -12.0809,5.33768");
            curb.attr({
                fill: texture,
                'fill-opacity': 1,
                stroke: "#000",
                'stroke-width': 1,
            });

            var curbHeight = curb.bbox().height;
            curb.move(coordinates.x + gs(width) - gs(1.5), coordinates.y - gs(offset) - gs(0.5) - rightheight);
            curb.width(gs(1.5));
        }
    }



    addDimension(width, label, widthvaries, hidedim);

    if (option.centerline == true) {
        addCenterline(coordinates.x + (gs(width) / 2));
    }
    centerY -= gs(0);

    /* Add optional sprites to section piece */
    if (addSprite) {
        var spriteGroup = activeGroup.group();
        spriteGroup.addClass("spritegroup");
        spriteGroup.attr("toolid", toolid);
        spriteGroup.attr("spritegroupid", toolid);

        for (var ii = 0; ii < addSprite.length; ii++) {
            (function () {
                var spritedata = addSprite[ii].split(",");
                var imgSprite = sprite.sprites[spritedata[0]] || "";
                if (imgSprite.group == "markings") {
                    hasLaneMarkings = true;
                }
                var img = [];
                var matchtest = devlib.math.rndRangeInt(0, 1000);
                window.totalSprites++;
                var i = window.totalSprites;
                if (imgSprite.sprite == undefined) return;
                if (imgSprite.sprite) spriteLookup[spritedata[5]] = spriteGroup.image("sprites/" + imgSprite.sprite);
                img[i] = spriteLookup[spritedata[5]];

                img[i].uid = spritedata[5];
                img[i].spritedata = spritedata;
                var matchtest = centerX;
                img[i].matchtest = matchtest;



                img[i].on("load", function () {
                    var currentImage = this;
                    $(currentImage.node).attr("spriteobject", "1");
                    $(currentImage.node).attr("uid", spritedata[5]);
                    var originalDims = [currentImage.bbox().width, currentImage.bbox().height];


                    this.spriteForceLoad = function () {
                        var currentImage = this;
                        this.show();
                        currentImage.base = [];

                        var spritedata = currentImage.spritedata;

                        var imgSprite = sprite.sprites[spritedata[0]]; // Sprite name
                        spritedata[1] = Number(spritedata[1]) || 0; // Horizontal offset
                        spritedata[2] = Number(spritedata[2]) || 0; // Vertical offset
                        spritedata[3] = Number(spritedata[3] * 0.01 || 0); // Scale +
                        spritedata[4] = Number(spritedata[4]) || 0; // Rotation
                        // spritedata[5] = Sprite UID

                        // Thickness of a section piece messes with sprite positioning.  Let's take that into account
                        spritedata[2] -= ((thickness - 1) / 2) * gs(1);

                        var currentImage = currentImage;
                        var scaleby;

                        if (originalDims[0] > originalDims[1]) {
                            scaleby = originalDims[0] / imgSprite.scale;
                        } else {
                            scaleby = originalDims[1] / imgSprite.scale;
                        }
                        currentImage.base["scaleby"] = scaleby;
                        currentImage.base["width"] = (originalDims[0] / scaleby);
                        currentImage.base["height"] = (originalDims[1] / scaleby);
                        currentImage.width((originalDims[0] / scaleby) * (1 + spritedata[3]));
                        currentImage.height((originalDims[1] / scaleby) * (1 + spritedata[3]));
                        currentImage.show();
                        var box = currentImage.bbox();
                        var hardCenterX = centerX + (imgSprite.offsetx) + (offset / 2);
                        var hardCenterY = centerY - imgSprite.offsety - gs(0.5);

                        currentImage.base["x"] = hardCenterX;
                        currentImage.base["y"] = hardCenterY;
                        currentImage.center(hardCenterX + spritedata[1], hardCenterY - (box.height / 2) + spritedata[2]);
                        var box = currentImage.bbox();
                        currentImage.transform({
                            rotation: spritedata[4]
                        })

                        // Check if it successfully loaded the sprite.  If so, make sure the section title is below the entire cross section
                        if (currentImage.width() == 0) {
                            if (!loadingError) {
                                setTimeout(function () {
                                    prepareCrossSection();
                                }, 100);
                            }
                            loadingError = true;
                        } else {
                            draw.height(draw.bbox().y2);

                            if (currentImage.y() > laneMarkingPosition) laneMarkingPosition = currentImage.y();
                            if (svgTitle) {
                                //  console.log("FOrceful!");
                                //  svgTitle.y(laneMarkingPosition + gs(titlePositionOffset));
                                draw.height(draw.bbox().y2)
                            }
                        }


                    }

                    this.spriteForceLoad();

                });
            })()

        }
        if (spritesbehind) {
            spriteGroup.back();
        }
    }
    /* Make region clickable */

    var clickregion = drawBox(coordinates.x, 10, gs(width), gs(36), "clickregion", 0);
    clickRegions.push(clickregion);
    clickregion.id("region" + toolid);
    clickregion.front();
    clickregion.attr("toolindex", toolid);
    clickregion.attr("clickregion", "1");
    $("#region" + toolid).clickObject = clickregion;
    $("#region" + toolid).click(function (evt) {
        var thisToolId = $(this).attr("toolindex");
        if (waitingForInput) {
            waitingForInput = false;
            returnToInput(thisToolId);
        } else {
            jumpto(toolid);
        }
    });

    $("#region" + toolid).mouseenter(function () {
        $(this).attr({
            'fill-opacity': 0.5,
        });
    }).mouseleave(function () {
        $(this).attr({
            fill: '#ff0000',
            'fill-opacity': 0,
            stroke: "#000",
            'stroke-width': 0,
            x: x,
            y: 10
        });

    });
    addToContextMenus("#region" + toolid); // Give it a right-click context menu

    if (option.blur) {
        activeGroup.filter(filter.blur);
    }

    if (option.fadeout) {
        activeGroup.opacity(0.5);
        /* This adds a physically white box with 50% transparency over the faded section - for fading everything INCLUDING the sky
        if (leftmost) {
            var faderegion = drawBox(coordinates.x - svgPadding, coordinates.y - 330, gs(width) + svgPadding, 500, "faderegion", 0);
        } else if (rightmost) {
            var faderegion = drawBox(coordinates.x, coordinates.y - 330, gs(width) + svgPadding, 500, "faderegion", 0);
        } else {
            var faderegion = drawBox(coordinates.x, coordinates.y - 330, gs(width), 500, "faderegion", 0);
        }

        faderegion.attr({
            'fill-opacity': 0.7,
            fill: '#ffffff',
            'stroke-width': 0
        });
        */
    }
    /* MOVE ALL Click Regions to the front, so other section sprites don't cause issues */
    //$("[clickregion]").clickObject.front();


    coordinates.x += gs(width);

}

function jumpto(toolid) {
    currentCard = toolid;
    if ($("div[toolindex]").length < 2) return;
    if (loadingFile) return;
    $("div[toolindex]").css('background', 'rgb(238,238,238)');
    var top = $("#toolitem" + toolid).top; //Getting Y of target element
    var toolbar = document.getElementById("toolbar");
    var toolwidth = $('#toolbar').width();
    var div = $("div[toolindex='" + toolid + "']");
    if (div.length < 1) return;
    var left = div.position().left - (toolwidth / 2);
    var divwidth = div.width();


    var offset;
    if (divwidth < toolwidth) {
        offset = left - ((toolwidth / 2) - (divwidth / 2));
    } else {
        offset = left;
    }
    offset = left;

    var currentscroll = $('#toolbar').scrollLeft();
    offset += currentscroll;
    $('#toolbar').animate({
        scrollLeft: offset
    }, 100);

    $("div[toolindex]").css('border', '0px solid black');
    div.css({
        background: '#ff0000'
    }).animate({
        backgroundColor: "#ffaaaa",
    }, 350);
    div.css('border', '3px solid red');

}

function getCard(toolid) {
    if ($("div[toolindex]").length < 2) return;
    if (loadingFile) return;
    $("div[toolindex]").css('background', 'rgb(238,238,238)');
    var top = $("#toolitem" + toolid).top; //Getting Y of target element
    var toolbar = document.getElementById("toolbar");
    var toolwidth = $('#toolbar').width();
    var div = $("div[toolindex='" + toolid + "']");
    var left = div.position().left - (toolwidth / 2);
    var divwidth = div.width();


    var offset;
    if (divwidth < toolwidth) {
        offset = left - ((toolwidth / 2) - (divwidth / 2));
    } else {
        offset = left;
    }
    offset = left;

    var currentscroll = $('#toolbar').scrollLeft();
    offset += currentscroll;
    $('#toolbar').animate({
        scrollLeft: offset
    }, 100);

    $("div[toolindex]").css('border', '0px solid black');
    div.css({
        background: '#ff0000'
    }).animate({
        backgroundColor: "#ffaaaa",
    }, 350);
    div.css('border', '3px solid red');

}

// Applies the global font style to a text element so they all match
function applyFontStyle(textElement) {
    textElement.font({
        family: 'Arial',
        size: globalDimensionOptions.fontSize,
        anchor: 'middle',
        leading: 16 / globalDimensionOptions.fontSize
    });
}

function addCenterline(xpos) {
    var clHeight = 8;
    var line = dimLayer.line(xpos, coordinates.y + gs(2), xpos, coordinates.y - gs(clHeight)).stroke({
        width: 2
    }); // Draw left vertical dimension line
    var label = dimLayer.text("C");
    label.x(xpos - gs(0.2));
    label.y(coordinates.y - gs(clHeight + 3));
    label.style('text-align:center;text-anchor:middle');
    applyFontStyle(label);
    var label = dimLayer.text("L");
    label.x(xpos + gs(0.2));
    label.y(coordinates.y - gs(clHeight + 2.5));
    label.style('text-align:center;text-anchor:middle');
    applyFontStyle(label);
}

function addTitle(title) {
    if (!title) return;
    title = title.split("\\-").join("-\n");
    title = title.split("//").join("-\n");
    title = title.split("\\n").join("\n");
    title = title.split("\\t").join("\t");
    var width = gs(totalWidth);
    var label = dimLayer.text(title);
    label.x((svgPadding + (width / 2)));
    // label.y(coordinates.y + gs(14));
    label.y(draw.bbox().height + gs(3));
    label.style('text-align:center;text-anchor:middle;font-size:1.3em;font-family:arial');
    svgTitle = label;
    svgTitle.cy(svgDraw.bbox().height);
    svgDraw.size('100%', draw.bbox().height);
}

// This is the width label that typically appears at the top of the section
function addWidthDim(txtLabel) {
    var width = gs(totalWidth);
    var line = dimLayer.line(svgPadding, coordinates.y, svgPadding, coordinates.y - (svgHeight - 25)).stroke({
        width: 2
    }); // Draw left vertical dimension line
    var line = dimLayer.line(svgPadding + width, coordinates.y, svgPadding + width, coordinates.y - (svgHeight - 25)).stroke({
        width: 2
    }); // Draw right vertical dimension line

    var line = dimLayer.line(svgPadding, coordinates.y - (svgHeight - gs(4.25)), svgPadding + width, coordinates.y - (svgHeight - gs(4.25))).stroke({
        width: 1
    }); // Draw dimension arrows   
    addArrows(line);

    var finalwidth = totalWidth; //(width/globalScale);
    var label = dimLayer.text(finalwidth.toString() + "'");
    addGlow(label);
    label.x((svgPadding + width / 2));
    label.y(coordinates.y - (svgHeight - gs(2.6)));
    label.style('text-align:center;text-anchor:middle');
    applyFontStyle(label);
    if (txtLabel) {
        var textLabel = txtLabel.replace("//", "");
        var label = dimLayer.text(textLabel.toString());
        label.x((svgPadding + width / 2));
        label.y(coordinates.y - (svgHeight - gs(5)));
        label.style('text-align:center;text-anchor:middle');
        applyFontStyle(label);
    }
    addGlow(label);
}

function addDimension(width, txtLabel, widthvaries, hideDimensionValue) {
    // hideDimensionValue controls whether or not the width of the section piece is shown -- update:  This caused issues when we DONT want an arrow shown, so reverting back
    if (hideDimensionValue) return false;

    var line = dimLayer.line(coordinates.x, coordinates.y + gs(1), coordinates.x, coordinates.y + gs(10)).stroke({
        width: 1
    }); // Draw left vertical dimension line
    var line = dimLayer.line(coordinates.x + gs(width), coordinates.y + gs(1), coordinates.x + gs(width), coordinates.y + gs(10)).stroke({
        width: 1
    }); // Draw right vertical dimension lines
    /* Internet explorer is screwing up dimension arrows, so we have to fix it for all IE versions */
    if (width >= 2) {
        var line = dimLayer.line(coordinates.x, coordinates.y + gs(7), coordinates.x + gs(width), coordinates.y + gs(7)).stroke({
            width: 1
        }); // Draw dimension arrows 
        addArrows(line);
    }
    if (width >= 2) {
        var preserveSpacing = false; // If true, it should preserve blank spaces, but exporting JPEGs may get goofy
        if (widthvaries) {
            var label = dimLayer.text("Varies");
        } else var label = dimLayer.text(width.toString() + "'");
        if (hideDimensionValue) label = dimLayer.text(""); // Hide the dimension if required
        label.x(coordinates.x + (gs(width) / 2));
        label.y(coordinates.y + gs(5));
        label.style('text-align:center;text-anchor:middle;font-family:Arial;');
        label.font({
            family: 'Arial',
            //  size: 16,
            anchor: 'middle',
            leading: 1
        });
        applyFontStyle(label);
        if (txtLabel) {
            var textLabel = parseLabel(txtLabel);
            var label = dimLayer.text(textLabel);
            if (preserveSpacing) label.lines.attr('xml:space', 'preserve', 'http://www.w3.org/XML/1998/namespace'); // Preserve spaces!
            label.x(coordinates.x + (gs(width) / 2));
            label.y(coordinates.y + gs(8));
            label.style('text-align:center;text-anchor:middle;font-family:Arial;');
            label.font({
                family: 'Arial',
                size: 16,
                anchor: 'middle',
                leading: 1
            });
            applyFontStyle(label);
            // Make sure the text fits within the dimension.  If not, add a hyphen and split spaces.
            if (label.bbox().width > gs(width)) {
                textLabel = txtLabel.split("\\-").join("-\n");
                textLabel = textLabel.split("//").join("-\n");
                textLabel = textLabel.split("\\n").join("\n");
                textLabel = textLabel.split(" ").join("\n");
                textLabel = textLabel.split("\\t").join("\t");
                label.text(textLabel);
            }
            // Even with a hyphen, it doesn't fit?  Move it outside the dimension!
            if (label.bbox().width > gs(width)) {
                label.y(coordinates.y + gs(10));
                textLabel = txtLabel.split("\\-").join("-\n");
                textLabel = textLabel.split("//").join("-\n");
                textLabel = textLabel.split("\\n").join("\n");
                textLabel = textLabel.split("\\t").join("\t");

            }
            textLabel = textLabel.split("\\s").join(" ");
            if (preserveSpacing) label.lines.attr('xml:space', 'preserve', 'http://www.w3.org/XML/1998/namespace'); // Preserve spaces!
            label.text(textLabel);
            if (preserveSpacing) label.lines.attr('xml:space', 'preserve', 'http://www.w3.org/XML/1998/namespace'); // Preserve spaces!
        }
    }
}

// Parses label or dimension text and applies line breaks and hyphens as needed
function parseLabel(txtLabel) {
    var textLabel = txtLabel.split("\\-").join("");
    textLabel = textLabel.split("//").join("-\n");
    textLabel = textLabel.split("\\s").join(" &#8194;");
    textLabel = textLabel.split("\\n").join("\n");
    textLabel = textLabel.split("\\t").join("\t");
    return textLabel;
}

function addCustomDimensions() {

    for (var i = 0; i < customDimension.length; i++) {
        if (!getSectionPiece(customDimension[i].left) || !getSectionPiece(customDimension[i].right)) {
            var $html = `
            <div>Custom dimension "` + customDimension[i].description + `"references a deleted section piece.  Please check your custom dimension settings.</div>
            <hr /><button id="btn-tmp-deldim">Click Here to Delete this Custom Dimension</button>`;

            popup($html, 'Found an Issue');
            $("#btn-tmp-deldim").click(function () {
                customDimension.splice(i, 1);
                closePopup();
            });
            return;
        }
        var left = getSectionPiece(customDimension[i].left);
        var right = getSectionPiece(customDimension[i].right);
        var vert = (gs(parseFloat(customDimension[i].position)) * 4.25) + svgHeightAdjustment;
        var vertplus = 0;
        if (parseFloat(customDimension[i].position) > 7) {
            vertplus = gs(5);
        }
        var totalWidth = ((right.start + right.width) - left.start) / globalScale;
        var actualWidth = (right.start + right.width) - left.start;

        /* BLACK BACKGROUND LINES */

        /* Draw left vertical dimension line */
        var line = dimLayer.line(left.start, svgHeight + gs(1), left.start, vert - gs(2) + vertplus).stroke({
            width: 1,
        });
        /* Draw right vertical dimension lines */
        var line = dimLayer.line(right.start + right.width, svgHeight + gs(1), right.start + right.width, vert - gs(2) + vertplus).stroke({
            width: 1,
        });

        /* Draw horizontal dimension lines */
        var line = dimLayer.line(left.start, vert, right.start + right.width, vert).stroke({
            width: 1,
        });

        addArrows(line);

        // -- Add dimension width (or override text) to the dimension //
        // -- BLACK FOREGROUND //
        if (customDimension[i].override != "") {
            var label = dimLayer.text(customDimension[i].override);
        } else var label = dimLayer.text(totalWidth.toString() + "'");
        label.x(left.start + (actualWidth / 2));
        label.y(vert - gs(1.8));
        label.style('text-align:center;text-anchor:middle');
        label.font({
            family: 'Arial',
            size: 16,
            anchor: 'middle',
            leading: 1
        });
        applyFontStyle(label);
        var txtLabel = customDimension[i].label;
        // addGlow(label);
        /* Add dimension description/label under the horizontal line */
        if (txtLabel) {
            var textLabel = txtLabel.replace("//", "");
            textLabel = parseLabel(textLabel);
            var label = dimLayer.text(textLabel.toString());
            label.x(left.start + (actualWidth / 2));
            label.y(vert + gs(0.7));
            label.style('text-align:center;text-anchor:middle');
            label.font({
                family: 'Arial',
                size: 16,
                anchor: 'middle',
                leading: 1
            });
            applyFontStyle(label);
            // Make sure the text fits within the dimension.  If not, add a hyphen and split spaces.
            if (label.bbox().width > actualWidth) {
                textLabel = txtLabel.replace("//", "-\n");
                textLabel = textLabel.replace(" ", "\n");
                label.text(textLabel);
            }
            // Even with a hyphen, it doesn't fit?  Move it outside the dimension!
            if (label.bbox().width > actualWidth) {
                label.y(vert + gs(10));
                textLabel = txtLabel.replace("//", "-\n");
                label.text(textLabel);
            }
            // addGlow(label);
            // label.lines.attr('xml:space', 'preserve', 'http://www.w3.org/XML/1998/namespace');  // Preserve spaces!
        }

    }

}

function getSectionPiece(pid) {
    getSectionPiece.prototype.description = "Nothing special";
    // if(typeof pid == "string") pid = parseFloat(pid);
    var x, y, z, startx = 0,
        idfound = false;
    for (var i = 0; i < svgJson.length; i++) {
        if (svgJson[i].toolid == pid) {
            idfound = i;
            break;
        }
        if (svgJson[i].width) startx += parseFloat(svgJson[i].width);
    }
    if (idfound === false) return false;
    var objdata = [];
    objdata.start = gs(startx) + svgPadding;
    objdata.width = gs(parseFloat(svgJson[idfound].width));
    return objdata;
}

function drawBox(x, y, width, height, patternName, stroke) {

    var rect = activeGroup.rect(width, height);
    rect.attr({
        fill: patternName,
        'fill-opacity': 1,
        stroke: "#000",
        'stroke-width': stroke,
        x: x,
        y: y
    });
    if (patternName == "clickregion") {
        rect.attr({
            fill: '#ff0000',
            'fill-opacity': 0,
            stroke: "#000",
            'stroke-width': 0,
            x: x,
            y: y
        });
    }
    return rect;
}

function drawGrid() {
    gridLayer = draw.group();
    gridLayer.opacity(0.5);
    var cx = 10;
    var cy = 36;
    var gridline = 0;
    var color = "black";
    for (var i = 0; i <= totalWidth; i++) {
        var width = 0.5;
        if (gridline == 5) {
            width = 2;
            color = "red";
            gridline = 0;
        }
        var line = gridLayer.line(cx, cy, cx, cy + svgHeight).stroke({
            width: width,
            color: color
        });
        cx += gs(1);
        gridline++;

    }
    var cx = 10;
    cy = 36;
    for (var i = 0; i <= 27; i++) {
        var width = 0.5;
        var color = "black";
        if (gridline == 5) {
            width = 2;
            color = "red";
            gridline = 0;
        }
        var line = gridLayer.line(cx, cy, cx + gs(totalWidth), cy).stroke({
            width: width,
            color: color
        });
        cy += (gs(1));
        gridline++;
    }
}



function moveTo(cx, cy) {
    coordinates.x = cx;
    coordinates.y = cy;
}

function makeCanvas() {
    svgDraw = SVG('svgcanvas');
    svgDraw.size('100%', 500 + svgHeightAdjustment + 50); // Sets the SVG size to maximum, plus 50 pixels for the title
    draw = svgDraw.group();
}

/* multiply the global scale by any variable and return it */
function gs(val) {
    return val * globalScale;
}


function addArrows(path) {
    path.marker('start', arrowStyle[globalDimensionOptions.tickStyle].start);
    path.marker('end', arrowStyle[globalDimensionOptions.tickStyle].end);
}

// Defines the arrow types
function defineArrows() {

    var e; // Temporary holder for marker entity

    // --------- Standard arrow definition ----------------

    arrowStyle.arrow = {};
    arrowStyle.arrow.start = draw.marker(20, 20, function (add) {
        e = add.path("M 8.7185878,4.0337352 L -2.2072895,0.016013256 L 8.7185884,-4.0017078 C 6.9730900,-1.6296469 6.9831476,1.6157441 8.7185878,4.0337352 z ");
        e.transform({
            scaleX: arrowScale,
            scaleY: arrowScale,
            x: 10,
            y: 0
        });
        e.style('"fill-rule:evenodd;stroke-width:0.1;stroke-linejoin:round;stroke:#000000;stroke-opacity:1;fill:#000000;fill-opacity:1;overflow:visible;"');
    });
    e.transform({
        scaleX: arrowScale,
        scaleY: arrowScale,
        x: 10,
        y: 0
    });
    arrowStyle.arrow.start.style('overflow:visible;');
    arrowStyle.arrow.start.ref(-2, 0);

    arrowStyle.arrow.end = draw.marker(20, 20, function (add) {
        var head = add.path("M 8.7185878,4.0337352 L -2.2072895,0.016013256 L 8.7185884,-4.0017078 C 6.9730900,-1.6296469 6.9831476,1.6157441 8.7185878,4.0337352 z ");
        head.transform({
            scaleX: -arrowScale,
            scaleY: arrowScale,
            x: -2,
            y: 0
        });
        head.style('"fill-rule:evenodd;stroke-width:0.1;stroke-linejoin:round;stroke:#000000;stroke-opacity:1;fill:#000000;fill-opacity:1;overflow:visible;"');
    });
    arrowStyle.arrow.end.style('overflow:visible;');
    arrowStyle.arrow.end.ref(7, 0);

    // ---------- Architectural Tick Mark --------

    arrowStyle.archtick = {};
    arrowStyle.archtick.start = draw.marker(20, 20, function (add) {
        var group = add.group();
        e = group.path("M 2.0462283,-6.7825126 -9.0168442,4.2988831 -7.9536645,5.4927496 3.1092594,-5.5879465 Z ");
        group.path("M 4.7440341,-0.07010178 H -14.098467");

        group.style('"fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"');
    });

    arrowStyle.archtick.start.style('overflow:visible;');
    arrowStyle.archtick.start.ref(-2 / arrowScale, 0);
    e.transform({
        scaleX: arrowScale,
        scaleY: arrowScale,
        x: 2,
        y: 0
    });
    window.fart = e;

    arrowStyle.archtick.end = draw.marker(20, 20, function (add) {
        var group = add.group();
        group.path("M 2.0462283,-6.7825126 -9.0168442,4.2988831 -7.9536645,5.4927496 3.1092594,-5.5879465 Z");
        group.path("M 4.7440341,-0.07010178 H -14.098467");
        group.transform({
            scaleX: arrowScale,
            scaleY: arrowScale,
            x: 10
        });
        group.style('"fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"');
    });
    arrowStyle.archtick.end.style('overflow:visible;');
    arrowStyle.archtick.end.ref(-2, 0);

    // ---------- Circular Tick Mark --------


    arrowStyle.circle = {};
    arrowStyle.circle.start = draw.marker(20, 20, function (add) {
        var group = add.group();
        e = group.ellipse(10, 10);
        e.transform({
            scaleX: arrowScale,
            scaleY: arrowScale,
            x: 5,
            y: -5
        });
        group.style('"fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"');
    });
    e.transform({
        x: -5,
        y: -5
    })
    arrowStyle.circle.start.style('overflow:visible;');
    arrowStyle.circle.start.ref(0, 0);

    arrowStyle.circle.end = draw.marker(20, 20, function (add) {
        var group = add.group();

        e = group.ellipse(10, 10);
        window.farg = e;
        e.transform({
            scaleX: arrowScale,
            scaleY: arrowScale,
            x: -5,
            y: 5
        });
        group.style('"fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"');
    });
    e.transform({
        x: -5,
        y: -5
    })
    arrowStyle.circle.end.style('overflow:visible;');
    arrowStyle.circle.end.ref(0, 0);

    // ---------- Box Tick Mark --------


    arrowStyle.box = {};
    arrowStyle.box.start = draw.marker(20, 20, function (add) {
        var group = add.group();
        e = group.rect(10, 10);
        e.transform({
            scaleX: arrowScale,
            scaleY: arrowScale,
            x: 5,
            y: -5
        });
        group.style('"fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"');
    });
    e.transform({
        x: -5,
        y: -5
    })
    arrowStyle.box.start.style('overflow:visible;');
    arrowStyle.box.start.ref(0, 0);

    arrowStyle.box.end = draw.marker(20, 20, function (add) {
        var group = add.group();

        e = group.rect(10, 10);
        e.transform({
            scaleX: arrowScale,
            scaleY: arrowScale,
            x: -5,
            y: 5
        });
        group.style('"fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"');
    });
    e.transform({
        x: -5,
        y: -5
    })
    arrowStyle.box.end.style('overflow:visible;');
    arrowStyle.box.end.ref(0, 0);

    // ---------- NONE Tick Mark --------


    arrowStyle.none = {};
    arrowStyle.none.start = draw.marker(20, 20, function (add) {
        var group = add.group();
        e = group.rect(0, 0);
        e.transform({
            scaleX: arrowScale,
            scaleY: arrowScale,
            x: 0,
            y: 0
        });
        group.style('"fill:none;stroke:#000000;stroke-width:0px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"');
    });
    arrowStyle.none.start.style('overflow:visible;');
    arrowStyle.none.start.ref(0, 0);

    arrowStyle.none.end = draw.marker(20, 20, function (add) {
        var group = add.group();
        e = group.rect(0, 0);
        e.transform({
            scaleX: arrowScale,
            scaleY: arrowScale,
            x: 0,
            y: 0
        });
        group.style('"fill:none;stroke:#000000;stroke-width:0px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"');
    });
    arrowStyle.none.end.style('overflow:visible;');
    arrowStyle.none.end.ref(0, 0);

}

function browserName() {
    var ua = navigator.userAgent,
        tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) return 'Opera ' + tem[1];
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    var ret = M[0].split(" ");
    return ret;
    //return M.join(' ');
}



/* TOOL BOX SCRIPT AREA */
function addToolItem(options) {

    // If Options are given, then chances are that we are loading values from a CSEC file.  Let's make sure we assign those values from the loaded file after the card is generated.
    if (options) {
        var nextTo = options.nextto;
        var side = options.side;
        var values = options.values;
    }

    // Checkboxes need IDs so their labels can be clicked.  Let's assign four for this card (centerline, width varies, no dims, faded == 4 checkboxes)
    var gid = [];
    gid.push(guid());
    gid.push(guid());
    gid.push(guid());
    gid.push(guid());

    toolItemCount = shortGuid();
    if (values) toolItemCount = values.toolid; // Use a given tool ID if we are loading values instead of using a randomly generated value
    // -- The HTML for each card is generated here
    html = '<a name="toolitem' + toolItemCount + '"></a>';
    html += 'Preset:<select class="toolitem" toolid = "preset">';
    html += '<option>Blank Object</option><option>Travel Lane</option><option>Curb and Gutter</option><option>Sidewalk</option><option>Landscaping</option><option>Bike Lane</option><option>Median</option><option>Ditch</option><option>Berm</option><option>Centerline</option>';
    html += '</select><br/>';
    // Curb options
    html += `
    <div toolid = "curbside" style="margin-bottom:3px; margin-top:-3px;">
    Curb Side/Type: <input toolid = "curbsideleft" type="radio" name="side${toolItemCount}" value="left" checked="1">Left
    <input type="radio" name="side${toolItemCount}" value="right" toolid = "curbsideright">Right
    <input type="checkbox" name="rollcurb${toolItemCount}" value="roll" toolid = "rollcurb">Roll Curb
    <hr/></div>
    `;
    // Ditch options
    html += `
    <div toolid = "ditchtype" style="width: 100%; padding:0px; margin-bottom:3px; margin-top:-3px; border-bottom:1px solid black;">
    Depth: <input class="toolitem short" toolid = "ditchdepth" type="number" value="1">
    Type: <select class="toolitem" toolid="selectditchtype"></select>
    </div>
    `;
    // Berm options
    html += `
    <div toolid = "bermtype" style="width: 100%; padding:0px; margin-bottom:3px; margin-top:-3px; border-bottom:1px solid black;">
    Height: <input class="toolitem short" toolid = "bermheight" type="number" value="1">
    Type: <select class="toolitem" toolid="selectbermtype"></select>
    </div>
    `;
    // Description and material
    html += `
    Description<input class="toolitem" toolid = "label"></input><br/>
    Material<select class="toolitem" toolid = "texture">
    `;
    /* Set up materials and previews*/
    for (var key in patternDefinitions) {
        html += '<option>' + patternDefinitions[key].description + '</option>';
    }
    html += `
    </select><div toolid = "texturepreview" class = "texturepreview texture-asphalt"></div>
    <button class="toolitem" toolid="addsubsurface"><span>+</span></button>
    <br/>
    Width<input class="toolitem short" toolid = "width" value="10" step="1" type="number"></input>Feet
    , Raised<input step="0.5" type="number" class="toolitem short" toolid = "offset" value="0"></input>Feet<br/>
    Thickness<input step="0.5" type="number" class="toolitem short" toolid = "thickness" value = "1"></input>Feet<br/>
    Objects<select placeholder="Press ADD button!" style="min-width:100px; max-width:100px; vertical-align:top;" class="toolitem" toolid = "spritelist" value="0" size="3"></select>
    <button class="toolitem iosbutton small padded1" toolid = "btnaddsprite">Add</button>
    <button class="toolitem iosbutton small padded1" toolid = "btnremovesprite">Delete</button>
    <button class="toolitem iosbutton small padded1" toolid = "btneditsprite">Edit</button><br/>
    <div class="spriteactions toolitem">        
    <button class="toolitem iosbutton small padded1" toolid = "btneditspriteup">&#9650;</button>Move Back<br/>
    <button class="toolitem iosbutton small padded1" toolid = "btneditspritedown">&#9660;</button>Move Forward<br/>
    </div><br/>
    Optional Slope Height (ft.)<br/>Left<input step="0.5" type="number" class="toolitem short" value="0" toolid = "leftheight" style="margin-right:15px"></input>
    Right<input step="0.5" type="number" class="toolitem short" toolid = "rightheight" value="0"></input>Feet<br/>
    `;
    html += '<input id="' + gid[0] + '" type="checkbox" value="centerline" toolid = "centerline"><label class="label-checkbox" for="' + gid[0] + '">Centerline</label>';
    html += '<input id="' + gid[1] + '"type="checkbox" value="varies" toolid = "varies" style="margin-left:15px"><label class="label-checkbox" for="' + gid[1] + '">Width Varies</label>';
    html += '<input id="' + gid[2] + '"type="checkbox" value="hidedim" toolid = "hidedim" style="margin-left:15px"><label class="label-checkbox" for="' + gid[2] + '">No Dims</label><br/>';
    html += '<input id="' + gid[3] + '"type="checkbox" value="fadeout" toolid = "fadeout" ><label class="label-checkbox" for="' + gid[3] + '">Faded</label>';
    html += '<input id="' + gid[4] + '"type="checkbox" value="blur" toolid = "blur" style="margin-left:24px"><label class="label-checkbox" for="' + gid[4] + '">Blur</label>';
    html += '<input id="' + gid[5] + '"type="checkbox" value="spritesbehind" toolid = "spritesbehind" style="margin-left:24px"><label class="label-checkbox" for="' + gid[5] + '">Objects Behind</label><br/>';
    // Floating buttons
    html += `
    <button class="toolitem floatbutton btn-deletesegment iosbutton small padded1 red" toolid = "deletesegment">Delete Segment</button><br/>
    <button class="toolitem floatbutton btn-insertright iosbutton small padded1 green whitetext" toolid = "insertright">Insert ></button><br/>
    <button class="toolitem floatbutton btn-insertleft iosbutton small padded1 green whitetext" toolid = "insertleft">< Insert</button><br/>
    `;

    var div = $("<div>", {
        html: html,
        click: function (e) {
            $("div[toolindex]").css('background', 'rgb(238,238,238)');
            if (e.target.localName != "button") {
                $(this).css('background', 'rgb(255,150,150)');
            }
        }
    });
    
    

    if (nextTo) {
        if (side == "left") {
            nextTo.before(div);
        }
        if (side == "right") {
            nextTo.after(div);
        }
    } else {
        div.appendTo($("#toolbar"));
    }
    div.addClass("toolbox").attr("toolindex", toolItemCount);
    div.attr("toolbox", "1");
    
    // Add 3d data to the card if none exists.  If it exists in a loaded file, apply that instead

    toolItem.push(div);

    div.children("[toolid='curbside']").hide();
    div.children("[toolid='ditchtype']").hide();
    div.children("[toolid='bermtype']").hide();
    $("div[toolindex]").css('background', 'rgb(238,238,238)');

    $("div[toolindex='" + toolItemCount + "'] select[toolid='spritelist']").mouseenter(function (e, ui) {

    });

    $("div[toolindex='" + toolItemCount + "'] select[toolid='spritelist']").on("click", function (e, ui) {

    });

    // Move sprites up and down their list with the move buttons
    $("div[toolindex='" + toolItemCount + "'] [toolid='btneditspriteup']").on("click", function (e, ui) {
        var $select = div.children("[toolid='spritelist']");
        var $option = $select.find(":selected");
        var $sibling = $option.prev();
        if ($sibling.length > 0) {
            addUndoState();
            $option.insertBefore($sibling);
            prepareCrossSection();
        }
    });
    $("div[toolindex='" + toolItemCount + "'] [toolid='btneditspritedown']").on("click", function (e, ui) {
        var $select = div.children("[toolid='spritelist']");
        var $option = $select.find(":selected");
        var $sibling = $option.next();
        if ($sibling.length > 0) {
            addUndoState();
            $option.insertAfter($sibling);
            prepareCrossSection();
        }
    });

    // Multi Material (sub surface) button
    $("div[toolindex='" + toolItemCount + "'] [toolid='addsubsurface']").on("click", function (e, ui) {
        showMultiMaterialDialog($(this).parent().attr("toolindex"));
    });

    var ditchTypes = Object.keys(ditchType);
    for (i = 0; i < ditchTypes.length; i++) {
        if (ditchTypes[i] != "Default") {
            var newOption = $("<option value='" + ditchTypes[i] + "'>" + ditchTypes[i] + "</option>");
            newOption.click(function (e, ui) {

            });
            $("div[toolindex='" + toolItemCount + "'] [toolid='selectditchtype']").append(newOption);
        }
    }

    var bermTypes = Object.keys(bermType);
    for (i = 0; i < bermTypes.length; i++) {
        if (bermTypes[i] != "Default") {
            var newOption = $("<option value='" + bermTypes[i] + "'>" + bermTypes[i] + "</option>");
            newOption.click(function (e, ui) {

            });
            $("div[toolindex='" + toolItemCount + "'] [toolid='selectbermtype']").append(newOption);
        }
    }

    jumpto(toolItemCount);
    // Add default 3d data to a card
    if(!values) { 
        csecLib.section3d.setCardData(toolItemCount); 
    }
    if (values) {
        // If values are given, we are probably loading a section from a file.  Add values to HTML elements for this card
        div.children("[toolid='label']").val(values.label);
        div.children("[toolid='preset']").val(values.preset);
        div.children("[toolid='texture']").val(values.texture);
        div.children("[toolid='width']").val(values.width);
        div.children("[toolid='offset']").val(values.offset);
        div.children("[toolid='thickness']").val(values.thickness);
        div.children("[toolid='leftheight']").val(values.leftheight);
        div.children("[toolid='rightheight']").val(values.rightheight);
        div.children("[toolid='hidedim']").prop("checked", values.hidedim);
        div.children("[toolid='rollcurb']").prop("checked", values.rollcurb);
        div.children("[toolid='fadeout']").prop("checked", values.fadeout);
        div.children("[toolid='blur']").prop("checked", values.blur);
        div.children("[toolid='spritesbehind']").prop("checked", values.spritesbehind);
        div.children("[toolid='centerline']").prop("checked", values.centerline);
        div.children("[toolid='varies']").prop("checked", values.widthvaries);
        div.find("[toolid='selectditchtype']").val(values.ditchtype);
        div.find("[toolid='ditchdepth']").val(values.ditchdepth);
        div.find("[toolid='selectbermtype']").val(values.bermtype);
        div.find("[toolid='bermheight']").val(values.bermheight);
        div.children("[toolid='texturepreview']").css('background-image', 'url("sprites/' + values.texture + '.jpg")');
        div.attr("subsurface", values.subsurface);
        div.attr("data3d", values.data3d || false); 
        var spritedatabox = div.children("[toolid='spritedata']");

        // Highlight a sprite when the mouse is moved over it in the sprite list

        var textures = [];

        for (var key in patternDefinitions) {
            textures[key] = patternDefinitions[key].description;
        }

        div.children("[toolid='texture']").val(textures[values.texture]);
        div.children("[toolid='texture']").change();

        if (values.sprite) {
            //-- Make the options draggable and sortable


            //-- Add sprites to the SELECT list
            for (i = 0; i <= values.sprite.length; i++) {

                if (values.sprite[i]) {
                    if (!values.sprite[i].split(",")[5]) {
                        values.sprite[i] += "," + spriteUID();
                    }
                    var newOption = $("<option value='" + values.sprite[i] + "'>" + values.sprite[i].split(",")[0] + "</option>");
                    newOption.mouseenter(function (e, ui) {
                        spriteItemControl(e, ui);
                    });
                    newOption.mouseleave(function (e, ui) {
                        $("[spriteobject=1]").attr("class", "");
                    });
                    newOption.click(function (e, ui) {
                       
                    });

                    div.children("[toolid='spritelist']").append(newOption);
                }
            }
            var thisSpriteList = div.children("[toolid='spritelist']");

            thisSpriteList.dragOptions({
                highlight: "",
                done: function () {
                    
                    prepareCrossSection();
                }
            });

        }

        if (values.side == "left") {
            div.children("[toolid='curbside']").children("[toolid='curbsideleft']").prop("checked", true);
        } else {
            div.children("[toolid='curbside']").children("[toolid='curbsideright']").prop("checked", true);
        }
        if (values.rollcurb != false) {
            div.children("[toolid='curbside']").children("[toolid='rollcurb']").prop("checked", true);
        }

        if (values.preset == "Curb and Gutter") {
            div.children("[toolid='curbside']").show();
        }
        if (values.preset == "Ditch") {
            div.find("[toolid='ditchtype']").show();
        }
        if (values.preset == "Berm") {
            div.find("[toolid='bermtype']").show();
        }
    }



    if (autoUpdate) {
        prepareCrossSection();
    }
    // Update actions for the tool box, add scripts

    $("div[toolindex='" + toolItemCount + "'] button[toolid='insertright']").hide();
    $("div[toolindex='" + toolItemCount + "'] button[toolid='insertleft']").hide();
    $("div[toolindex='" + toolItemCount + "'] button[toolid='deletesegment']").hide();

    // Assign a right-click context menu to this card:
    addCardToContextMenus(); // Give it a right-click context menu.  Function is located in dialogs.js.  The card id is automatically determined.

    $(div).mouseenter(function () {
        resetSpriteList(); // Fix a bug where objects in a sprite <select> box lose their mouseenter event when clicked

        $(this).children("button[toolid='insertright']").show();
        $(this).children("button[toolid='insertleft']").show();
        $(this).children("button[toolid='deletesegment']").show();
        // $("div[toolindex]").css('background', 'rgb(238,238,238)');
        $("div[toolindex]").css('border', '0px solid black');
        $(this).css({
            // background: '#ffaaaa'
        });
        $(this).css('border', '1px solid red');
        var tID = $(this).attr("toolindex");
        $("#region" + tID).attr({
            'fill-opacity': 0.5,
        });
        if(mode3d) csecLib.section3d.jumpToSegment(tID);
    }).mouseleave(function () {
        $(this).children("button[toolid='insertright']").hide();
        $(this).children("button[toolid='insertleft']").hide();
        $(this).children("button[toolid='deletesegment']").hide();
        var tID = $(this).attr("toolindex");
        $("#region" + tID).attr({
            fill: '#ff0000',
            'fill-opacity': 0,
            stroke: "#000",
            'stroke-width': 0,
        });
        if(mode3d) csecLib.section3d.clearSelection();
    }).mousedown(function (e, ui) {

        resetSpriteList(); // Fix a bug where objects in a sprite <select> box lose their mouseenter event when clicked
        var tID = $(this).attr("toolindex");
        currentCard = tID;
        $("#region" + tID).attr({
            'fill-opacity': 0.5,
        });
        if(mode3d) csecLib.section3d.jumpToSegment(tID);
    }).mousemove(function (e, ui) {

    });

    function resetSpriteList() {
        // Fix a bug where objects in a sprite <select> box lose their mouseenter event when clicked
        $("[toolid='spritelist']").unbind("mousemove");
        $("[toolid='spritelist']").on("mousemove", function (e, ui) {
            resetSpriteList();
        });
        $("[toolid='spritelist']").children("option").unbind("mouseenter");
        $("[toolid='spritelist']").children("option").unbind("mouseleave");
        $("[toolid='spritelist']").children("option").mouseenter(function (e, ui) {
            spriteItemControl(e, ui);
        });
        $("[toolid='spritelist']").children("option").mouseleave(function (e, ui) {
            $("[spriteobject=1]").attr("class", "");
        });
    }

    $("div[toolindex='" + toolItemCount + "'] button[toolid='insertright']").click(function (e) {
        addUndoState();
        var parentdiv = $(this).parent();
        addToolItem({
            nextto: parentdiv,
            side: "right"
        });
    });
    $("div[toolindex='" + toolItemCount + "'] select[toolid='spritelist']").click(function (e) {
        addUndoState();
        var val = $(this).children().length;
        if (val < 1) {
            addSpriteDialog($(this).parent());
        }
    });

    $("div[toolindex='" + toolItemCount + "'] button[toolid='insertleft']").click(function (e) {
        addUndoState();
        var parentdiv = $(this).parent();
        addToolItem({
            nextto: parentdiv,
            side: "left"
        });
    });


    $("div[toolindex='" + toolItemCount + "'] select").change(function () {
        addUndoState();
        if (autoUpdate) {
            prepareCrossSection();
        }

    });
    $("div[toolindex='" + toolItemCount + "'] input").change(function () {
        addUndoState();
        if (autoUpdate) {
            prepareCrossSection();
        }
    });

    /* "Add" sprite button clicked */
    $("div[toolindex='" + toolItemCount + "'] button[toolid='btnaddsprite']").click(function (e) {
        addUndoState();
        addSpriteDialog($(this).parent());
    });

    function addSpriteDialog(e) {
        var parentdiv = e;
        var toolindex = parentdiv.attr("toolindex");
        var grouped = [];
        for (var key in sprite.sprites) {
            if (sprite.sprites.hasOwnProperty(key)) {
                if (!grouped[sprite.sprites[key].group]) grouped[sprite.sprites[key].group] = "";
                grouped[sprite.sprites[key].group] += "<div sprite = '" + key + "' class='spriteicon' toolid = 'spriteicon' toolindex = '" + toolindex + "'><div style='height:96px; vertical-align:middle; background: white; border:0px solid black; border-radius:5px;'><img  src='sprites/thumb/" + (sprite.sprites[key].sprite).split(".")[0] + ".jpg'></div>" + sprite.sprites[key].description + "</div>";
            }
        }
        var msg = "<div class='iconlist'><div id='accordion'>";
        for (var key in grouped) {
            if (grouped.hasOwnProperty(key)) {
                msg += "<div style=''><h3>" + sprite.groups[key] + "</h3></div>";
                msg += "<div>" + grouped[key] + "</div>"; //grouped[key] + "</div>";
            }
        }
        msg += "</div></div>";
        var msgbox = showMessage(msg, "Cancel");
        $(msgbox).width("90%");
        $(msgbox).height("90%");
        $("#accordion").accordion({
            heightStyle: "content",
            collapsible: true,
            autoHeight: true,
        });

        centerMessageBox();
        $(".spriteicon").click(function (e) {
            var tindex = $(this).attr("toolindex");
            var s = $(this).attr("sprite");
            var selectbox = $("div[toolindex='" + tindex + "'] select[toolid='spritelist']");

            var items = selectbox.attr("size") + 1;
            if (items > 3) {
                items = 3;
            }
            var newOpt = $("<option></option>").attr("value", s + ",0,0,0,0," + spriteUID()).text(s);
            selectbox.append(newOpt);
            // Mouse over and highlight a sprite connected to the option
            newOpt.mouseenter(function (e, ui) {
                spriteItemControl(e, ui);
            });
            newOpt.mouseleave(function (e, ui) {
                $("[spriteobject=1]").attr("class", "");
            });
            newOpt.click(function (e, ui) {
                
            });
            selectbox.attr("size", items);
            selectbox[0].lastChild.selected = true;
            hideMessage();
            selectbox.unbind();
            selectbox.dragOptions({
                highlight: "",
                done: function () {
                    prepareCrossSection();
                }
            });

            if (autoUpdate) {
                prepareCrossSection();
            }
        });
    }

    $("div[toolindex='" + toolItemCount + "'] button[toolid='deletesegment']").click(function (e) {
        addUndoState();
        var parentdiv = $(this).parent();
        var toolarea = $(this).parent().parent();
        parentdiv.remove();
        if (toolarea.children().length < 1 && !loadingFile) {
            addToolItem();
        }
        if (autoUpdate) {
            prepareCrossSection();
        }
    });

    /* "Remove" sprite button clicked */
    $("div[toolindex='" + toolItemCount + "'] button[toolid='btnremovesprite']").click(function (e) {
        addUndoState();
        var parentdiv = $(this).parent();
        var toolindex = parentdiv.attr("toolindex");
        var selectbox = parentdiv.children("[toolid='spritelist']");
        if (selectbox[0].selectedIndex == -1) selectbox[0].selectedIndex = 0;
        $('option:selected', selectbox).remove();
        selectbox[0].selectedIndex = 0;
        if (autoUpdate) {
            prepareCrossSection();
        }
    });

    // Show the sprite editing dialog for moving, rotating, and scaling a sprite.  Also adds drag and drop capability to the sprite
    $("div[toolindex='" + toolItemCount + "'] button[toolid='btneditsprite']").click(function (e) {
        activeSprite = false; // We're editing a new sprite, so make sure any old sprites aren't in the active sprite variable
        addUndoState();
        $("[clickregion=1]").hide();
        var parentdiv = $(this).parent();
        var toolindex = parentdiv.attr("toolindex");
        var selectbox = parentdiv.children("[toolid='spritelist']");
        var offsets = $('option:selected', selectbox).val();
        if (selectbox[0].selectedIndex == -1) selectbox[0].selectedIndex = 0;
        if (selectbox[0].selectedIndex != -1) {
            currentSpriteForEdit = selectbox.children(":selected")[0];
            var sdata = currentSpriteForEdit.value.split(",");
            $("#sprite_offsetx").val(sdata[1] || 0);
            $("#sprite_offsety").val(-sdata[2] || 0);
            $("#sprite_scale").val(sdata[3] || 0);
            $("#sprite_rotate").val(sdata[4] || 0);
            $("#spriteeditbox").show();
            $("#spriteeditbox").attr("activecard", toolindex);
            $("#spriteeditbox").offset({
                top: selectbox.offset().top - 90,
                left: selectbox.offset().left - 28
            });
            updateSpriteValues($("#spriteeditbox"));
            // Get the physical sprite image for mouse manipulation later - add it to the activeSprite variable
            var parentCard = getCardAtIndex(getCardIndex($("#spriteeditbox").attr("activecard")));
            var toolid = $(parentCard).attr("toolindex");
            var spriteGroup = draw.select(`[spritegroupid='${toolid}']`).members[0]; // Get the sprite group holding this sprite
            var spriteid = $(`[uid='${sdata[5]}']`).attr("id");
            if (spriteid) {
                activeSprite = spriteGroup.select(`#${spriteid}`).members[0];
                makeSpriteDraggable(activeSprite, sdata);
                activeSprite.front();
            }
        }
        if (autoUpdate) {
            // prepareCrossSection();
        }
    });


    $("div[toolindex='" + toolItemCount + "'] select").change(function (e) {
        addUndoState();
        refreshTool(this);
    });

}

// Puts a little move icon over the sprite so it can be moved with the mouse
function makeSpriteDraggable(_sprite, sdata) {
    if (!_sprite) return;
    var dragging = false;
    var dragSource = {};
    dragSource.x = _sprite.cx() - Number(sdata[1]);
    dragSource.y = _sprite.cy() - Number(sdata[2]);

    _sprite.on('mousedown', function (evt) {
        dragging = true;
       
    });
    _sprite.on('mouseup', function (evt) {
        dragging = false;
    });
    _sprite.on('mouseleave', function (evt) {
        if (dragging) {
            moveSpriteToMouse(evt)
        };
    });
    _sprite.on('mousemove', function (evt) {
        if (dragging) {
            moveSpriteToMouse(evt)
        };
    });

    function moveSpriteToMouse(evt) {
        var goodLoc = screenToSvg(evt);
        _sprite.cx(goodLoc.x);
        _sprite.cy(goodLoc.y);
        var offsetX = -(dragSource.x - _sprite.cx());
        var offsetY = dragSource.y - _sprite.cy();
        $("#sprite_offsetx").val(offsetX);
        $("#sprite_offsety").val(offsetY);
        updateSpriteValues($("#spriteeditbox"));
        //  $("#sprite_scale").val(sdata[3] || 0);
        //  $("#sprite_rotate").val(sdata[4] || 0);            


    }
}

function spriteItemControl(e, ui) {
    // Highlight the currently selected sprite.  Hide the others.
    if (!spriteLookup[(e.currentTarget.value.split(",")[5])]) return;
    $("[clickregion='1']").attr({
        'fill-opacity': 0
    });
    var spriteImage = spriteLookup[(e.currentTarget.value.split(",")[5])].node;
    $("[spriteobject=1]").attr("class", "spritefade");
    spriteImage.classList.remove("spritefade");
    spriteImage.classList.add("spritehighlight");
}

function refreshTool(tool) {
    var val = $(tool).find(":selected").text();
    var type = $(tool).attr("toolid");
    var tool_preset = $(tool).parent().children("select[toolid='preset']");
    var tool_label = $(tool).parent().children("input[toolid='label']");
    var tool_texture = $(tool).parent().children("select[toolid='texture']");
    var tool_width = $(tool).parent().children("input[toolid='width']");
    var tool_offset = $(tool).parent().children("input[toolid='offset']");
    var tool_roadside = $(tool).parent().children("[toolid='curbside']");
    var tool_ditchtypecontainer = $(tool).parent().children("[toolid='ditchtype']");
    var tool_ditchtype = $(tool).parent().children("[toolid='selectditchtype']");
    var tool_bermtypecontainer = $(tool).parent().children("[toolid='bermtype']");
    var tool_bermtype = $(tool).parent().children("[toolid='selectbermtype']");
    var tool_centerline = $(tool).parent().children("[toolid='centerline']");
    var tool_rightheight = $(tool).parent().children("[toolid='rightheight']");
    var tool_leftheight = $(tool).parent().children("[toolid='leftheight']");
    var tool_thickness = $(tool).parent().children("[toolid='thickness']");
    var tool_hidedim = $(tool).parent().children("[toolid='hidedim']");
    var tool_rollcurb = $(tool).parent().children("[toolid='rollcurb']");
    var tool_fadeout = $(tool).parent().children("[toolid='fadeout']");
    var tool_blur = $(tool).parent().children("[toolid='blur']");
    var tool_spritebehind = $(tool).parent().children("[toolid='spritesbehind']");
    switch (type) {
        case "preset":
            tool_roadside.hide();
            tool_ditchtype.hide();
            tool_bermtype.hide();
            nameval = val;
            if (val == "Blank Object") {
                nameval = "";
                tool_texture.val("Asphalt");
                tool_offset.val("0");
            } else if (val == "Sidewalk") {
                nameval = "Side\\-walk";
                tool_texture.val("Concrete");
                tool_offset.val("0.5");
                tool_width.val("6");
            } else if (val == "Landscaping") {
                nameval = "Land\\-scape";
                tool_texture.val("Grass 1");
                tool_offset.val("0.5");
                tool_width.val("10");
            } else if (val == "Travel Lane") {
                nameval = "Travel Lane";
                tool_texture.val("Asphalt");
                tool_width.val("12");
            } else if (val == "Bike Lane") {
                tool_texture.val("Asphalt");
                tool_width.val("5");
            } else if (val == "Curb and Gutter") {
                nameval = "CG";
                tool_texture.val("Concrete");
                tool_width.val("2");
                tool_roadside.show();
            } else if (val == "Median") {
                tool_texture.val("Asphalt");
                tool_width.val("12");
            } else if (val == "Ditch") {
                tool_texture.val("Dirt");
                tool_ditchtypecontainer.show();
            } else if (val == "Berm") {
                tool_texture.val("Dirt");
                tool_bermtypecontainer.show();
            } else if (val == "Berm") {
                tool_texture.val("Dirt");
                tool_width.val("10");
            } else if (val == "Center\\-line" || val == "Centerline") {
                tool_texture.val("Dirt");
                tool_width.val("0");
                tool_centerline.prop("checked", true);
            }

            tool_label.val(nameval);
            tool_texture.change();
            break;

        case "texture":
            var val = $(tool).find(":selected").text().toLowerCase();
            var textures = [];
            /* WORKING OK */
            for (var key in patternDefinitions) {
                textures[patternDefinitions[key].description.toLowerCase()] = patternDefinitions[key].filename;
            }

            $(tool).parent().children("div[toolid='texturepreview']").css('background-image', 'url("sprites/' + textures[val] + '")');

            break;
    }
}

/* Menu control */

function addMenuFunctions() {
    $("#btn_addsegment").click(function (e) {
        addUndoState();
        addToolItem();
    });

    $("#btn_drawcrosssection").click(function (e) {
        prepareCrossSection();
    });

    $("#checkbox_width").change(function () {
        addUndoState();
        if (autoUpdate) {
            prepareCrossSection();
        }
    });

    /* moved to the menu bar
    $("#btn_addCustomDim").click(function(e) {
        showDimensionDialog();
    });
    */

    $("#btn_load").click(function (e) {
        if (!window.FileReader) {
            popup('Your browser doesn\'t support direct file uploading.  Please use Firefox, Chrome, Safari, or Internet Explorer 11 or above.');
            return false;
        }
        var input = $("#input_loadfile");
        input.click();

    });

}


function prepareCrossSection() {
    svgHeight = svgDefaultHeight + svgHeightAdjustment; // Current section height.  Allows the user to set the section height manually
    if (loadingFile) return;
    if (drawingLeader) addClickableOverlay("destroy");

    spriteLookup = [];
    var divlist = $("#toolbar").children("div[toolbox='1']");
    var divcount = divlist.length;
    var sectionData = [];
    totalWidth = 0;

    for (i = 0; i < divcount; i++) {
        var toolid = $(divlist[i]).attr("toolindex");
        var preset = $(divlist[i]).children("[toolid='preset']").find(":selected").text();
        var type;
        var label = $(divlist[i]).children("input[toolid='label']").val();
        var width = $(divlist[i]).children("input[toolid='width']").val();
        var offset = $(divlist[i]).children("input[toolid='offset']").val();
        var varies = $(divlist[i]).children("input[toolid='varies']").is(':checked');
        var centerline = $(divlist[i]).children("input[toolid='centerline']").is(':checked');
        var hidedim = $(divlist[i]).children("[toolid='hidedim']").is(':checked');
        var rollcurb = $(divlist[i]).children("[toolid='rollcurb']").is(':checked');
        var fadeout = $(divlist[i]).children("[toolid='fadeout']").is(':checked');
        var blur = $(divlist[i]).children("[toolid='blur']").is(':checked');
        var spritesbehind = $(divlist[i]).children("[toolid='spritesbehind']").is(':checked');
        var rightheight = $(divlist[i]).children("[toolid='rightheight']").val();
        var leftheight = $(divlist[i]).children("[toolid='leftheight']").val();
        var thickness = $(divlist[i]).children("[toolid='thickness']").val();
        var ditchtype = $(divlist[i]).find("[toolid='selectditchtype']").val();
        var ditchdepth = $(divlist[i]).find("[toolid='ditchdepth']").val();
        var bermtype = $(divlist[i]).find("[toolid='selectbermtype']").val();
        var bermheight = $(divlist[i]).find("[toolid='bermheight']").val();
        var subsurface = $(divlist[i]).attr("subsurface") || false;
        
        // If this card doesn't have any 3d data associated with it, add default data containers
        if(!csecLib.section3d.getCardData(toolid)) {
            csecLib.section3d.setCardData(toolid);
        }
        
        var data3d = JSON.stringify(csecLib.section3d.getCardData(toolid));
        
        var elevated = false;
        var sprite = [];
        var spritedata = [];
        var sdata = {};
        $(divlist[i]).children("[toolid='spritelist']").children().each(function () {
            sprite.push($(this).val());
        });

        var texture = $(divlist[i]).children("[toolid='texture']").find(":selected").text().toLowerCase();
        var textures = [];
        for (var key in patternDefinitions) {
            textures[patternDefinitions[key].description.toLowerCase()] = key;

        }

        texture = textures[texture];

        var curb = $(divlist[i]).children("[toolid='curbside']");
        var side = null;
        if (curb.children("input[toolid='curbsideleft']").is(':checked')) {
            side = "left";
        } else {
            side = "right";
        }
        if (curb.children("input[toolid='rollcurb']").is(':checked')) {
            rollcurb = true;
        } else {
            rollcurb = false;
        }
        if (preset != "Curb and Gutter") {
            side = null;
        }
        if (preset == "Blank Object" || preset == "Sidewalk" || preset == "Landscaping" || preset == "Travel Lane" || preset == "Bike Lane") {
            type = "box";
        }
        if (preset == "Median") {
            type = "median";
        }
        if (preset == "Ditch") {
            type = "ditch";
        }
        if (preset == "Berm") {
            type = "berm";
        }
        if (preset == "Curb and Gutter") {
            type = "curbandgutter";
        }

        if (type == "median" && offset > 0) {
            elevated = true;
        }

        var pushsection = {
            type: type,
            preset: preset,
            side: side,
            label: label,
            texture: texture,
            width: width,
            offset: offset,
            sprite: sprite,
            centerline: centerline,
            hidedim: hidedim,
            rollcurb: rollcurb,
            fadeout: fadeout,
            blur: blur,
            spritesbehind: spritesbehind,
            elevated: elevated,
            widthvaries: varies,
            rightheight: rightheight,
            leftheight: leftheight,
            thickness: thickness,
            toolid: toolid,
            ditchdepth: ditchdepth,
            ditchtype: ditchtype,
            bermheight: bermheight,
            bermtype: bermtype,
            subsurface: subsurface,
            data3d : data3d
        }
        sectionData.push(pushsection);

        totalWidth += Number(width);
    }

    updateSVG(sectionData);
    loadingError = false;
    if (svgTitle) {
        svgTitle.cy(svgDraw.bbox().height);
    }
    svgDraw.size(draw.width(), draw.bbox().height + 50);
    var $svg = $($("svg")[0]);
    $svg.height((draw.bbox().height + 50) * $svg[0].currentScale);
    $svg.width((gs(totalWidth) + (svgPadding * 2)) * $svg[0].currentScale);
    
    
    // This part is a dirty fix for the latest nw.js update:
    // The SVG is clipping the bottom of the section, so after a refresh frame, resize it based on the new math.
    // This needs to be fixed through a promise/async function.  No idea why the new version doesn't work like before.
    setTimeout(function(){
        var $svg = $($("svg")[0]);
        $svg.height((draw.bbox().height + 5) * $svg[0].currentScale);
        $svg.width((gs(totalWidth) + (svgPadding * 2)) * $svg[0].currentScale);     
        $(window).resize();
    },1);


}

function debug(html) {
    if (debugMode) {
        $("#debug").show();
    }
    $("#debug").html($("#debug").html() + "<br/>" + html);
    console.log(html);
    var objDiv = document.getElementById("debug");
    objDiv.scrollTop = objDiv.scrollHeight;
}

function clearAll(itemId) {
    var node = document.getElementById(itemId);
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

$("select").change(function () {
    addUndoState();
    if (autoUpdate) {
        prepareCrossSection();
    }
});
$("input").change(function () {
    addUndoState();
    if (autoUpdate) {
        prepareCrossSection();
    }
});

function goodbye(e) {
    if (filechanged) {
        if (!e) e = window.event;
        e.cancelBubble = true;
        e.returnValue = 'If you leave without saving first, your changes will be lost.  Are you sure?'; //This is displayed on the dialog

        if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
}
window.onbeforeunload = goodbye;

var guid = (function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();

var shortGuid = (function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function () {
        return "section" + s4() + s4() + s4();
    };
})();

var spriteUID = (function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function () {
        return "sprite_" + s4() + s4() + s4();
    };
})();

function spriteStringToData(text) {
    var spriteItem = {
        we: "died"
    };
    var sdata = {};

    var groups = text.split("|");

    for (var i = 0; i < groups.length; i++) {
        var line = groups[i].split(",");
        sdata[line[0]] = {
            offsetx: line[1],
            offsety: line[2],
            scale: line[3]
        };
    };
    spriteItem = (sdata);
    return spriteItem;
}

function dataToSpriteString(data) {
    var lines = "";
    for (var key in data) {
        lines += key + "," + data[key].offsetx + "," + data[key].offsety + "," + data[key].scale + "|";
    }

    return lines;
}

function getSpriteData(spriteName, text) {
    var data = spriteStringToData(text);
    for (var key in data) {
        if (key == spriteName) return data[key];
    }
}

/* See What happens when files are dragged and dropped */
function setupDragDrop() {

    /* Prevent default behavior from changing page on dropped file */
    window.ondragover = function (e) {
        e.preventDefault();
        return false
    };
    window.ondrop = function (e) {
        e.preventDefault();
        return false
    };
    /* Begin Globals */
    fileList = [];
    holder = document.body;
    holder.ondragover = function () {
        this.className = 'hover';
        return false;
    };
    holder.ondragend = function () {
        this.className = '';
        return false;
    };
    window.ondrop = function (e) {
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        //don't try to mess with non-CSEC files
        if (!file) return;
        file = e.dataTransfer.files[0].path; /* Only look at the first file.  We can't open multiple CSEC files! (Not yet anyway) */

        /* Keeping the code below in case I decide to add the feature to open multiple CSEC files. */
        /*
    for (var i = 0; i < e.dataTransfer.files.length; ++i) {
        fileList.push(e.dataTransfer.files[i].path);
        if( nodefs.statSync(e.dataTransfer.files[i].path).isDirectory()) { fileList[0] = e.dataTransfer.files[i].path; }
    }
    */
        if (devlib.fileSystem.getFileExtension(file) == "csec") {
            clearAll("toolbar");
            // var data = devlib.fileSystem.readFile(file);
            loadSectionFile(file);
            return true;
        }

        return false;
    };

}


function definePatterns() {
    svgPattern = function () {
        for (var key in patternDefinitions) {
            // alert(material[key])
            this[key] = draw.pattern(200, 200, function (add) {
                add.image('sprites/' + patternDefinitions[key].filename, 200, 200);
            });
        }
    };
    pattern = new svgPattern;
}

// Define ditches and berms as SVG code - Added Oct 26, 2018
function defineNonBoxes() {
    ditchType.Culvert = `
    m 26.225352,2.5160235 0.01766,-6.0613975 h -1.958589 v 0.5705343 L 18.267995,0.95047431 7.6603934,0.89630086 1.7236031,-2.961589 v -0.5837854 l -1.95859431,0.00681 v 6.0545869 
    `;
    ditchType.Sharp = `
    M 0,59 V 0 c 4.7207724,-0.09069938 41.99551,43.337014 41.99551,43.337014 l 14.843541,0.197562 C 56.839051,43.534576 94.270859,-0.09889094 99,0 v 59 
    `;
    ditchType.V = `
    M 0,59 V 0 C 6.4077208,-0.12311043 49.5,52.326522 49.5,52.326522 49.5,52.326522 92.609348,-0.13363476 99,0 v 59        
    `;
    ditchType.U = `
    M 0,59 V 0 h 0.46875 c 27.538503,0 10.874084,20.406065 27.925,50.58466 18.28069,4.902022 23.110568,4.427332 42.2125,0 C 89.633666,21.900235 71.792192,0 98.53125,0 H 99 v 59
    `;
    ditchType.Waterway = `
    M 0,59 V 0 h 0.46875 c 27.538503,0 10.874084,20.406065 27.925,50.58466 18.28069,4.902022 23.110568,4.427332 42.2125,0 C 89.633666,21.900235 71.792192,0 98.53125,0 H 99 v 59
    `;    
    ditchType.Default = ditchType.U;

    bermType.Hill = `
    m 26.063021,2.3914611 c -3.117759,-1.3229166 -8.264795,-6.2005976 -13.097663,-6.2005976 -4.8328678,0 -9.9799024,4.877681 -13.09764966,6.2005976
    `;

    bermType.Pointy = `
    M 26.063021,2.3914611 C 22.945262,1.0685445 14.039633,-3.8091367 12.965358,-3.8091365 c -1.074275,2e-7 -9.9799024,4.877681 -13.09764966,6.2005976
    `;

    bermType.Plateau = `
    M 99.505859,22.539062 79.595703,5.6445312 79.443359,5.515625 C 78.280442,4.5288161 77.462436,4.0820977 76.388672,3.9023438 75.724588,3.8333279 74.990631,3.8407479 74.107422,3.8027344 H 25.898438 c -0.88321,0.038014 -1.617166,0.030594 -2.28125,0.099609 C 22.543424,4.0820977 21.725418,4.5288162 20.5625,5.515625 L 20.410156,5.6445312 0.5,22.539062
    `;

    bermType.Default = `
    m 26.063021,2.3914611 c -3.117759,-1.3229166 -8.264795,-6.2005976 -13.097663,-6.2005976 -4.8328678,0 -9.9799024,4.877681 -13.09764966,6.2005976
    `;

};

// Defines all filters for blurring text backgrounds, etc.
function defineFilters() {

    filter.matrix = [];
    filter.matrix.WHITE = [
        1.0, 0, 0, 0, 0
        , 0, 1, 0, 0, 0
        , 0, 0, 1, 0, 0
        , 0, 0, 0, 1.0, 0
    ];
    filter.matrix.BLACK = [
          0, 0, 0, 0, 0
        , 0, 0, 0, 0, 0
        , 0, 0, 0, 0, 0
        , 0, 0, 0, 1.0, 0
    ];
    filter.matrix.YELLOW = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 1, 0
    ];


    // BLUR
    filter.blur = new SVG.Filter();
    filter.blur.gaussianBlur(3);
    filter.blur.size('300%', '300%').move('-100%', '-100%');

    // GLOW
    filter.glow = new SVG.Filter();
    filter.glow.opacity(1)
        .flood('white', 0.65)
        .composite(filter.glow.sourceAlpha, 'in')
        .gaussianBlur(3).merge(filter.glow); // flood opacity affects overall filter opacity
    filter.glow.size('300%', '300%').move('-75%', '-75%');
    filter.glow.blend("SourceGraphic", filter.glow);
    filter.glow.merge(filter.glow, "", filter.glow); // Uncomment this line to make the glow much, much brighter

    // DROP SHADOW
    filter.dropshadow = new SVG.Filter();
    filter.dropshadow.offset(2, 2)
        .gaussianBlur(3)
        .colorMatrix("matrix", filter.matrix.BLACK);
    filter.dropshadow.blend(filter.dropshadow.source, filter.dropshadow);
}


function addFileToRecent(file) {
    if (typeof file != "string") return false;
    /* Make sure it's not already in the recent file list.  If it is, remove it and add it back to the front */
    if (recentFiles.indexOf(file) > -1) {
        recentFiles.splice(recentFiles.indexOf(file), 1);
    }
    recentFiles.unshift(file);
    localStorage.recentFiles = JSON.stringify(recentFiles);
    populateRecentFileMenu();
}

// Add items to the recent files menu.
function populateRecentFileMenu() {
    $("#recentfiles").html("");
    for (var i = 0; i < recentFiles.length; i++) {
        // Error checking.  Make sure the recent files list isn't corrupt
        if (typeof recentFiles[i] != "string") {
            recentFiles.splice(i, 1);
            continue;
        }
        if (recentFiles[i] == "<File Missing>") {
            continue;
        }


        var shortname = devlib.fileSystem.getFileName(recentFiles[i]);
        var condensed = devlib.fileSystem.getPath(recentFiles[i]);
        if (devlib.fileSystem.getPath(condensed).length > 20) {
            condensed = devlib.fileSystem.getPath(recentFiles[i]).slice(0, 20) + "...\\";
        }
        shortname = condensed + shortname;

        var fileitem = $("<li value='" + recentFiles[i] + "' aria-haspopup='true' class='ui-menu-item ' role='menuitem'><span class='ui-icon ui-icon-bullet'></span>" + shortname + "</li>");
        $("#recentfiles").append(fileitem);

        fileitem.click(function (e) {
            loadSectionFile($(e.target).attr("value"));
            $(".ui-menu-outside").hide(); // Hide the clickable underlay for the menu system
            $("#filemenu").hide();
            $("#optionsmenu").hide();
            $("#addextramenu").hide();
            $("#helpmenu").hide();
            $("#recentfiles").hide();
            $("#filemenu").hide();
            menuActive = false;
        });

    }
}

function getSaveFileExtraData() {
    let dataobj = csecLib.fileControl.getSaveFileExtraData();
    return dataobj;
}

// Convert screen coordinates to SVG coordinates
/*
function screenToSvgAlt(x, y) {
    var translateX = $("#svgcanvas").position().left;
    var translateY = $("#svgcanvas").position().top;
    var scale = $("#svgcanvas").css("zoom");
    var myScreenCTM = $("#svgcanvas svg")[0].getScreenCTM();
    return {
        x : ( x - myScreenCTM.e - translateX ) / scale,
        y : ( y - myScreenCTM.f - translateY ) / scale
    }
}
*/

// Convert screen coordinates to SVG coordinates
function screenToSvg(evt) {
    // Get TRUE clicked coordinates of a clicked point in a scaled SVG
    svg = $("#svgcanvas svg")[0];
    var pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;

    // The cursor point, translated into svg coordinates
    var cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    return cursorpt;
}


function addClickableOverlay(option) {
    //-- This function creates a clickable region for adding dimension lines
    addUndoState();
    option = option || {};
    if (option == "destroy" && leaderData.currentLanding) {
        if (leaderData.clickRegion) leaderData.clickRegion.remove();
        leaderData.currentLanding.remove();
        leaderData.currentLine.remove();
        leaderData.currentText.remove();
        leaderData.currentGroup.remove();
        leaderData.editMode = false;
        leaderData.lastPoint = {};
        drawingLeader = false;
        hideTextInput();
        return;
    }

    // We're editing an existing leader.  Do with it what you will.
    var editMode = false;
    var thisLeaderData = false;
    var clickpoint;
    var defaults = {
        text: "",
        arrowtype: "arrow",
        gap: 10,
        landingsize: 30,
        glow: true,
        arrowsize: 1
    };

    leaderData.currentTextString = "New Leader";
    var labelGroup = leaderData.currentGroup;
    // var exLeader = $(labelGroup[0]).children()[0];
    //    var exLanding = $(labelGroup[0]).children()[1];
    //    var exText = $(labelGroup[0]).children()[2];       
    leaderData.currentTarget = leaderData.currentTarget || false;

    if (option.leaderData) {
        editMode = true;
        hideTextInput();
        thisLeaderData = option.leaderData;
        leaderData.currentTextString = option.target.text;
        defaults = thisLeaderData;
        leaderData.currentGroup = $(labelGroup[0]);
        leaderData.currentID = option.target.id;
        leaderData.currentTarget = leaderData.currentTarget || option.target;
        option.target = leaderData.currentTarget;
        var locked = true;
        // defaults = leaderData.currentTarget;
    }

    // Abandon ship if the overlay already exists
    if ($("#clickableoverlay").length > 0) {
        return;
    }

    var clickregion = drawBox(1, 1, $("#svgcanvas").width() - 2, $("#svgcanvas").height() - 2, "#ffffff", 0);
    draw.add(clickregion);
    clickregion.id("clickableoverlay");
    clickregion.front();
    clickregion.attr("clickregion", "1");
    clickregion.opacity(0.0);
    clickregion.front();

    var region = $(clickregion.node);
    leaderData.clickRegion = region;

    /* Custom leader clicking */
    region.on('click', function (evt) {
        var $self = $(this);
        if (labelGroup) labelGroup.remove();
        if (option.leaderData && leaderData.currentGroup && !leaderData.locked) {
            leaderData.locked = true; // Erase the old leader if moving the current one.  Locked = DO NOT delete it
            leaderData.currentGroup.remove();
        }
        screenToSvg(evt);
        var e = evt.target;
        var dim = e.getBoundingClientRect();
        var cx = evt.clientX;
        var cy = evt.clientY;
        var clickpoint = screenToSvg(evt);
        var x = clickpoint.x;
        var y = clickpoint.y;
        screenToSvg(evt);

        // Figure out which section this leader starts in
        if (!(leaderData.lastPoint.x > 0)) {
            leaderData.currentToolIndex = getSectionAt(x, y).toolindex;
            leaderData.currentOffset = getSectionAt(x, y).offset;
        }
        var sectionRegion = $("#region" + leaderData.currentToolIndex); // Gets the DOM section region

        // A start point was already clicked, so we must be selecting the landing point
        if (leaderData.lastPoint.x > 0) {
            leaderData.editMode = true;
            // We clicked the landing point, so time to bring up the editor

            showTextInput({
                change: function (val) {
                    // Values changed, so dynamically update the label
                    defaults = val;
                    leaderData.currentText.text(val.text);
                    if (val.glow) {
                        leaderData.currentGroup.filter(filter.glow);
                    } else {
                        leaderData.currentGroup.unfilter(false);
                    }
                    leaderData.currentLine.marker('start', arrowStyle[val.arrowtype].start);
                    updateTempLeader(x, y);
                },
                done: function (val) {
                    leaderData.currentText.text(val.text);
                    var thisLeader = {};
                    var offsetFix = Number(leaderData.currentOffset);
                    thisLeader.x1 = Number(leaderData.currentLine.attr('x1')) - offsetFix;
                    thisLeader.x2 = Number(leaderData.currentLine.attr('x2')) - offsetFix;
                    thisLeader.y1 = Number(leaderData.currentLine.attr('y1')) - svgHeightAdjustment;
                    thisLeader.y2 = Number(leaderData.currentLine.attr('y2')) - svgHeightAdjustment;
                    thisLeader.text = val.text;
                    thisLeader.landingsize = val.landingsize;
                    thisLeader.arrowtype = val.arrowtype;
                    thisLeader.arrowsize = val.arrowsize;
                    thisLeader.glow = val.glow;
                    thisLeader.gap = val.gap;
                    thisLeader.id = shortGuid();
                    thisLeader.toolindex = leaderData.currentToolIndex;
                    if (leaderData.currentID) {
                        deleteLabelDefinition(leaderData.currentID);
                        leaderData.currentID = false;
                    };
                    leaderData.editMode = false;
                    leaderData.leaders.push(thisLeader);
                    addClickableOverlay("destroy");
                    prepareCrossSection();
                    leaderData.locked = false; // Erase the old leader if moving the current one.  Locked = DO NOT delete it
                    clickregion.remove();
                },
                cancel: function () {
                    leaderData.editMode = false;
                    addClickableOverlay("destroy");
                },
                target: leaderData.currentTarget
            });

        } else {
            // No start point was found, so we must have clicked the starting position

            // Draw the starting leader line.  Its starting point is moot since it changes immediately with the mousemove event
            var thisLeaderGroup = dimLayer.group();
            var line = thisLeaderGroup.line(x, y, x, y).stroke({
                width: 1
            });
            var arrow = leaderData.currentTarget.arrowtype || defaults.arrowtype || "arrow";
            line.marker('start', arrowStyle[arrow].start);

            var landing = thisLeaderGroup.line(x + 1, y + 1, x, y).stroke({
                width: 1
            });

            // Add leader text element
            var leadertext = thisLeaderGroup.text(leaderData.currentTextString);
            leadertext.font({
                leading: 1,
                anchor: 'top'
            });
            leadertext.style('text-align:left;text-anchor:start;alignment-baseline:central;font-family:Arial;font-size:1em;');

            // Draw landing line and text area
            // leaderData.currentTspan = leadertspan;
            leaderData.currentText = leadertext;
            leaderData.currentLine = line;
            leaderData.currentLanding = landing;
            leaderData.currentGroup = thisLeaderGroup;
            leaderData.lastPoint.x = x;
            leaderData.lastPoint.y = y;
            if (leaderData.currentTarget.glow) {
                thisLeaderGroup.filter(filter.glow);
            }
            hideHoverText();
        }


    });

    region.on('mousemove', function (evt) {

        // If we're editing the text right now, don't move things around!  Abandon ship!
        if (leaderData.editMode) return;

        // Check if we're drawing a custom dimension line.  If so, dynamically move it around
        var e = evt.target;
        var dim = e.getBoundingClientRect();
        var cx = evt.clientX;
        var cy = evt.clientY;
        clickpoint = screenToSvg(evt);
        var x = clickpoint.x;
        var y = clickpoint.y;

        if (leaderData.currentLine) {
            updateTempLeader(x, y, cx, cy);
        }
    });

    function updateTempLeader(x, y) {
        // var defaults = leaderData.currentTarget;
        var textOnly = false;
        // Defaults are showing DEFAULT values, so wtf
        if (leaderData.movetarget) defaults = leaderData.movetarget;
        if (distance(x, leaderData.lastPoint.x, y, leaderData.lastPoint.y) < 30) textOnly = true;

        // Determine if we draw the landing to the left or right of the leader line
        if (x >= leaderData.lastPoint.x) {
            if (!textOnly) {
                x -= defaults.landingsize;
                leaderData.currentLine.attr({
                    x2: x,
                    y2: y
                });
                leaderData.currentLanding.attr({
                    x1: x,
                    y1: y,
                    x2: x + defaults.landingsize,
                    y2: y
                });

                leaderData.currentText.attr({
                    x: x + defaults.landingsize + defaults.gap,
                    y: y - 12
                });
                leaderData.currentText.style('text-align:left;text-anchor:start;alignment-baseline:central;font-family:Arial;font-size:1em;');
            }
        } else {
            if (!textOnly) {
                x += defaults.landingsize;
                leaderData.currentLine.attr({
                    x2: x,
                    y2: y
                });
                leaderData.currentLanding.attr({
                    x1: x,
                    y1: y,
                    x2: x - defaults.landingsize,
                    y2: y
                });

                leaderData.currentText.attr({
                    x: x - defaults.landingsize - defaults.gap,
                    y: y - 12
                });
                leaderData.currentText.style('text-align:right;text-anchor:end;alignment-baseline:central;font-family:Arial;font-size:1em;');
            }
        }
        if (textOnly) {
            leaderData.currentLanding.hide();
            leaderData.currentLine.hide();
            leaderData.currentText.attr({
                x: x,
                y: y - 12
            });
            leaderData.currentText.style('text-align:center;text-anchor:middle;alignment-baseline:central;font-family:Arial;font-size:1em;');
        } else {
            leaderData.currentLanding.show();
            leaderData.currentLine.show();
        }
    }

    return region;

}

function drawLeaders() {
    // Function to add the custom leaders if they exist.  Go thru each and create new leader entities and assign values
    if (leaderData.leaders.length < 1 || typeof leaderData.leaders == "undefined") return;

    for (var i = 0; i < leaderData.leaders.length; i++) {
        var leader = leaderData.leaders[i];
        leader.landingsize = Number(leader.landingsize);
        leader.gap = Number(leader.gap);
        var sectionRegion = $("#region" + leader.toolindex);

        // Uh oh, the section this leader was attached to was annihilated or it's blank.  Remove it from the database
        if (sectionRegion.length == 0 || leader.text.length < 1) {
            leaderData.leaders.splice(i, 1);
            console.log("A leader tried to appear where a section piece was removed or it was blank.  Destroying it.")
            continue;
        }

        var offsetFix = Number(sectionRegion.attr('x'));
        var x1 = leader.x1;
        var y1 = leader.y1;
        var x2 = leader.x2;
        var y2 = leader.y2;
        var textOnly = false;
        var dist = distance(x1, x2, y1, y2);
        if (dist < 30) {
            textOnly = true;
        }

        var leaderGroup = draw.group();
        if (!textOnly) {
            var line = leaderGroup.line(x1 + offsetFix, y1, x2 + offsetFix, y2).stroke({
                width: 1
            });
            line.marker('start', arrowStyle[leader.arrowtype || "arrow"].start);
            var landing = leaderGroup.line(x1 + offsetFix, y2, x2 + leader.landingsize + offsetFix, y2).stroke({
                width: 1
            });
        }
        var leaderText = leaderGroup.text(leader.text);
        leaderText.font({
            leading: 1
        });
        leaderText.style('text-align:left;text-anchor:start;alignment-baseline:central;font-family:Arial;font-size:1em;');
        // Determine if we draw the landing to the left or right of the leader line
        // Text to the right
        if (x2 >= x1) {
            x2 += offsetFix;
            x1 += offsetFix;
            if (!textOnly) {
                landing.attr({
                    x1: x2,
                    y1: y2,
                    x2: x2 + leader.landingsize,
                    y2: y2
                });

                leaderText.attr({
                    x: x2 + leader.landingsize + leader.gap,
                    y: y2 - 12
                });
                leaderText.style('text-align:left;text-anchor:start;alignment-baseline:central;font-family:Arial;font-size:1em;');
            }
        } else {
            // Text to the left
            x2 += offsetFix;
            x1 += offsetFix;
            if (!textOnly) {
                landing.attr({
                    x1: x2,
                    y1: y2,
                    x2: x2 - leader.landingsize,
                    y2: y2
                });

                leaderText.attr({
                    x: x2 - leader.landingsize - leader.gap,
                    y: y2 - 12
                });
                leaderText.style('text-align:right;text-anchor:end;alignment-baseline:central;font-family:Arial;font-size:1em;');
            }
        }
        if (textOnly) {
            leaderText.attr({
                x: x2,
                y: y2 - 12
            });
            leaderText.style('text-align:center;text-anchor:middle;alignment-baseline:central;font-family:Arial;font-size:1em;');
        }
        dimLayer.add(leaderGroup);
        leaderGroup.move(0, svgHeightAdjustment);
        if (leader.glow) addGlow(leaderGroup); // Make it glow so it is easier to read over dark backgrounds
        window.lg = leaderGroup;
        var l = $(leaderText.node);

        l.attr('leaderid', leader.id);
        l.click(function (evt) {
            editLeaderText(evt.target);
        });

    }


};

function editLeaders() {
    $("[clickregion='1']").hide();
}

function editLeaderText(label) {
    addUndoState();
    var originalText = "";
    var labelGroup = $(label).parent().parent();
    var exLeader = $(labelGroup[0]).children()[0];
    var exLanding = $(labelGroup[0]).children()[1];
    var exText = $(labelGroup[0]).children()[2];
    leaderData.currentGroup = $(labelGroup[0]);

    for (var i = 0; i < label.parentNode.childNodes.length; i++) {
        originalText += $(label.parentNode.childNodes[i]).text();
    }
    // var originalText = label.parentNode.textContent;
    var originalStyle = $(label.parentNode).attr('style');

    var svgNode;
    for (var i = 0; i < dimLayer.children().length; i++) {
        if (dimLayer.children()[i].node.id == label.parentNode.id) {
            svgNode = dimLayer.children()[i];
        }
    }
    window.label = label;
    showTextInput({
        content: originalText,
        target: getLabelDefinition($(label.parentNode).attr('leaderid')),
        change: function (val) {
            label.textContent = val.text;
            var labelid = $(label.parentNode).attr('leaderid');
            var labelData = getLabelDefinition(labelid);
            labelData.text = val.text;
            labelData.landingsize = val.landingsize;
            labelData.gap = val.gap;
            labelData.arrowtype = val.arrowtype;
            labelData.arrowsize = val.arrowsize;
            labelData.glow = val.glow;
        },
        done: function (val) {
            label.textContent = val.text;
            $("[clickregion='1']").show();
            var labelid = $(label.parentNode).attr('leaderid');
            var labelData = getLabelDefinition(labelid);
            labelData.text = val.text;
            labelData.landingsize = val.landingsize;
            labelData.gap = val.gap;
            labelData.arrowtype = val.arrowtype;
            labelData.arrowsize = val.arrowsize;
            labelData.glow = val.glow;
            hideHoverText();
            prepareCrossSection();
        },
        cancel: function () {
            $("[clickregion='1']").show();
            hideHoverText();
            prepareCrossSection();
        },
        buttons: [{
            label: "Delete this leader",
            click: function () {
                deleteLabelDefinition($(label.parentNode).attr('leaderid'));
                hideHoverText();
                hideTextInput();
                prepareCrossSection();
            }
        }]
    })
}

function getSectionAt(x, y) {
    for (var i = 0; i < clickRegions.length; i++) {
        var left = clickRegions[i].x();
        var right = left + clickRegions[i].width();
        if (x >= left && x < right) {
            var n = $(clickRegions[i].node);
            return {
                toolindex: n.attr('toolindex'),
                offset: left
            };
        }
    }
}

function getLabelDefinition(id) {
    for (var i = 0; i < leaderData.leaders.length; i++) {
        if (leaderData.leaders[i].id == id) return leaderData.leaders[i];
    }
    return false;
}

function deleteLabelDefinition(id) {
    addUndoState();
    for (var i = 0; i < leaderData.leaders.length; i++) {
        if (leaderData.leaders[i].id == id) {
            leaderData.leaders.splice(i, 1);
            return true;
        }
    }
    return false;
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

function distance(x1, x2, y1, y2) {
    var d = Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
    return d;
}

// [Issue C0004] Needs API Insertion
// [Issue C0001] --> DRY Alert!!!
// Undo and Redo functionality
function getStateData() {
    var savedata = {};
    savedata.textbox_title = $("#textbox_title").val();

    var saveFileName = savedata.textbox_title.split("\\-").join("_");
    saveFileName = saveFileName.split("//").join("_");
    saveFileName = saveFileName.split("\\s").join("_");
    saveFileName = saveFileName.split("\\n").join("_");
    saveFileName = saveFileName.split("\\t").join("_");
    saveFileName = saveFileName.replace(/[^a-z0-9]/gi, '_');

    savedata.textbox_width = $("#textbox_width").val();
    savedata.checkbox_width = $("#checkbox_width").is(':checked');
    savedata.sectiondata = svgJson;
    savedata.customdimensions = customDimension;    // [Issue C0004]
    savedata.leaders = leaderData.leaders;
    savedata.extradata = getSaveFileExtraData();
    var jsondata = JSON.stringify(savedata);
    // Only add to the undo buffer if the state differs from the previous state.  Prevent duplicate undo states.
    return jsondata;
}

function addUndoState() {
    let jsondata = getStateData(false);
    if (jsondata != stateUndo[0]) {
        stateUndo.unshift(jsondata);
    }    
}

function addRedoState() {
    var savedata = {};
    savedata.textbox_title = $("#textbox_title").val();

    var saveFileName = savedata.textbox_title.split("\\-").join("_");
    saveFileName = saveFileName.split("//").join("_");
    saveFileName = saveFileName.split("\\s").join("_");
    saveFileName = saveFileName.split("\\n").join("_");
    saveFileName = saveFileName.split("\\t").join("_");
    saveFileName = saveFileName.replace(/[^a-z0-9]/gi, '_');

    savedata.textbox_width = $("#textbox_width").val();
    savedata.checkbox_width = $("#checkbox_width").is(':checked');
    savedata.sectiondata = svgJson;
    savedata.customdimensions = customDimension;
    savedata.leaders = leaderData.leaders;
    savedata.extradata = getSaveFileExtraData();
    var jsondata = JSON.stringify(savedata);
    // Only add to the undo buffer if the state differs from the previous state.  Prevent duplicate undo states.
    if (jsondata != stateRedo[0]) {
        stateRedo.unshift(jsondata);
    }
}

function doUndo() {
    if (stateUndo.length < 1) return false;
    if (stateUndo[0] != stateRedo[0]) addRedoState();
    processFile(stateUndo[0]);
    stateUndo.splice(0, 1);
}

function doRedo() {
    if (stateRedo.length < 1) return false;
    if (stateUndo[0] != stateRedo[0]) addUndoState();
    processFile(stateRedo[0]);
    stateRedo.splice(0, 1);

}

// Gets the card array index of the given card ID
function getCardIndex(cardId) {
    var children = $("#toolbar").children();
    for (var i = 0; i < children.length; i++) {
        if ($($("#toolbar").children()[i]).attr("toolindex") == cardId) return i;
    }
    return false;
}

// Gets the card data from the array index of the given index
function getCardAtIndex(index) {
    var children = $("#toolbar").children();
    if (children[index]) {
        return children[index];
    } else {
        return false;
    }

}

// Gets the card immediately to the left of the given card
function getCardToTheLeft(cardId) {
    var idx = getCardIndex(cardId);
    var card = getCardAtIndex(idx - 1);
    return card;
}

// Gets the card immediately to the right of the given card
function getCardToTheRight(cardId) {
    var idx = getCardIndex(cardId);
    var card = getCardAtIndex(idx + 1);
    return card;
}

function getCardDOM(cardId) {
    return getCardAtIndex(getCardIndex(cardId));
}

// Match this card's elevation to the one on the left or right
function matchElevation(from, to) {

}

// Get proper element dimensions when the element is zoomed
function realWidth(elem) {
    var zoom = $(elem).css("zoom");
    var width = $(elem).outerWidth();
    return width * zoom;
}

function realHeight(elem) {
    var zoom = $(elem).css("zoom");
    var height = $(elem).outerHeight();
    return height * zoom;
}

function realDims(elem) {
    var zoom = $(elem).css("zoom");
    var width = $(elem).outerWidth();
    var height = $(elem).outerHeight();
    return {
        width: width,
        height: height
    };
}

/*
function getLowestLabel() {
    $.each(draw.children(), function(i,e) { console.log(e.bbox().y2) });
}
*/

// Adds a glow effect to any SVG entity
function addGlow(ent) {
    if (disableFilters) return;
    ent.filter(filter.glow);
}

// Zoom and pan functionality
function setupMouseWheel() {

    var dragging = false;
    var origin = {};
    var target = {};
    var $zoomWindow = $("#zoomwindow");
    var $container = $("#svgcanvas");
    var $canvas = $($($("svg")[0]));
    var $svg = $($("svg")[0]);
    pzController = panzoom($container[0], {
        zoomSpeed: 0.1,
        smoothScroll: false,
        zoomDoubleClickSpeed: 5,
        filterKey: function () {}
    });

}

function setCanvasDimensions() {
    var vtop = $("#zoomwindow").offset().top;
    var vtop = $("#toolbar").offset().top + $("#toolbar").height();
    var vbottom = $(window).height();
    var vheight = vbottom - vtop;
    $("#zoomwindow").width("99%"); // draw.width()) + 40;
    $("#zoomwindow").height(vheight - 20); // draw.width()) + 40;
    $("canvas").width($("#zoomwindow").width());
    $("canvas").height($("#zoomwindow").height() - 5);
    $("canvas").offset({top : vtop + 10 });
    if(mode3d) csecLib.section3d.resize();
}


// resets the SVG view to fit into the container div
function resetView() {
    pzController.moveTo(0, 0);
    var scale = $("#zoomwindow").width() / $("#svgcanvas").width();
    if (scale > 1) scale = 1;
    pzController.zoomAbs(0, 0, scale);
    return;
}


function getCenter(elem) {
    var center = {};
    center.x = ($(elem).width() / 2) + $(elem).offset().left;
    center.y = ($(elem).height() / 2) + $(elem).offset().top;
    return center;
}

// Generate unique identifiers
function uid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

function shortUID() {
    return ([1e7] + 1e3 + 4e3).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

// Shows a popup with subsurface settings for a card
function showMultiMaterialDialog(cardID) {
    var $card = $(getCardDOM(cardID)); // The physical card in the DOM
    var $existingLayers = $card.attr("subsurface") || false; // Layers that already exist in this card
    var layers; // Layers being added
    var ul = $("<ul>");
    var btnAddSurface = $("<button>+ Add surface</button>");
    var html = $("<div class='materialslist'>");
    html.append(ul).append(btnAddSurface);

    popup({
        html: html,
        width: 550,
        height: 450,
        title: "Sub Surfaces",
        class: "subsurfacedialog",
        buttons: {
            "Close": function () {
                closePopup();
                if (autoUpdate) {
                    prepareCrossSection();
                }
            },
            "Apply": function () {
                var values = domToLayers();
                $card.attr("subsurface", values);
                prepareCrossSection();
            },
        },
        style: 'font-size:0.5em',
    });

    // If this card already has sub surfaces, append them to the list
    if ($existingLayers) {
        var layers = JSON.parse($existingLayers);
        for (var i = 0; i < layers.length; i++) {
            addMaterialListItem(layers[i]);
        }
    }


    $(".materialslist ul").sortable({
        revert: false
    });
    $(".materialslist ul").disableSelection();

    // Convert DOM elements to layers, for converting to JSON
    function domToLayers() {
        var json = [];
        var mlist = $(".materialslist");
        var list = mlist.find(".materialitem");
        for (var i = 0; i < list.length; i++) {
            var $listItem = $(list[i]);
            var thickness = $listItem.find("input").val();
            var material = $listItem.find("select").val();
            json.push({
                thickness: thickness,
                material: material
            });
        }
        return JSON.stringify(json);
    }

    // Adds a line item to the subsurface materials list
    function addMaterialListItem(values) {
        var li = $("<li class='materialitem'>");
        var trash = $("<span class='trash ui-icon ui-icon-trash'>");
        var input = $("<input type='number' style='width:45px; margin-right:2px;' value=1>");
        var label1 = $("<label>Thickness</label>");
        var label1a = $("<span style='margin-right:20px;' >ft</span>")
        var label2 = $("<label>Material</label>");
        var select = $("<select>");

        // Get a list of active material definitions and place them into a select box
        for (var key in patternDefinitions) {
            var option = $('<option value="' + key + '">' + patternDefinitions[key].description + '</option>');
            select.append(option);
        }

        var texturePreview = $('<div class = "texturepreview"></div>');
        texturePreview.css('background-image', 'url("sprites/' + patternDefinitions.asphalt.filename + '")');

        li.append(trash);
        li.append(label1);
        li.append(input);
        li.append(label1a);
        li.append(label2);
        li.append(select);
        li.append(texturePreview);
        ul.append(li);

        if (values) {
            input.val(values.thickness);
            select.val(values.material);
            texturePreview.css('background-image', 'url("sprites/' + patternDefinitions[values.material].filename + '")');
        }

        var selectUI = select.iconselectmenu({
            change: function (event, data) {
                var val = data.item.element.val();
                texturePreview.css('background-image', 'url("sprites/' + patternDefinitions[val].filename + '")');
            }
        }).iconselectmenu("menuWidget").addClass("ui-menu-icons customicons");

        trash.click(function (e, ui) {
            $(this).parent().remove();
        });

    }

    btnAddSurface.click(function (e, ui) {
        addMaterialListItem();
    });




}

// Adds graphical icons to options in the sub surface selection window -- This is a custom select menu for jQueryUI
function setupSubSurfaces() {
    $.widget("custom.iconselectmenu", $.ui.selectmenu, {
        _renderItem: function (ul, item) {
            var li = $("<li>"),
                wrapper = $("<div>"),
                html = "<span class='subsurface-item-text'>" + item.label + "</span>";
            wrapper.append(html);
            li.addClass("subsurface-item");
            if (item.disabled) {
                li.addClass("ui-state-disabled");
            }

            $("<span>", {
                    style: 'background-image:url("sprites/' + patternDefinitions[item.element.val()].filename + '")',
                    "class": "texturepreview"
                })
                .prependTo(wrapper);

            $("body").append(wrapper);
            return li.append(wrapper).appendTo(ul);

        },

    });
}

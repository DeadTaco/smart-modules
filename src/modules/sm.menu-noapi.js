csecLib.showModuleInfo("sm.menu.js", "NOT API READY: Top menu bar functionality, such as File, Edit, Background, etc.");	

// Hide all menus
function hideAllMenus(resetAll) {

    $("#filemenu").hide();
    $("#optionsmenu").hide();
    $("#dimensionsmenu").hide();
    $("#helpmenu").hide();
    $("#addextramenu").hide();
    $("#editmenu").hide();
    if(resetAll) {                    // Added 2018-06-03, menu system should only close if clicked outside the menu system or a menu item is selected
        $(".ui-menu-outside").hide(); 
        menuActive = false; 
    }
}

function defineMenus() {
    
    /* Hide menus if clicked outside of them */
    $(".ui-menu-outside").click(function(event) {
        menuActive = false;
        hideAllMenus(true);
        csecLib.verticalMenu.hideMenu();   // Issue C0003 : Move to API 
    });


    /* FILE MENU */
    var selectedItem = "";
    $("#filemenu").menu({
        select: function(event, ui) {
            selectedItem = ui.item.attr("value");
            runAction(selectedItem);
        }
    });
    $(".selector").menu("select");

    $("#filemenu").hide();
    $("[menu='filemenu']").click(function(e,ui) {
        
        if (toggleMenu()) {
            $("#filemenu").show();
        } else {
            $("#filemenu").hide();
        }

    });
    $("[menu='filemenu']").mouseover(function() {
      
        if (menuActive) {
            hideAllMenus();
            $("#filemenu").show();
        }

    });
    
    /* EDIT MENU */
    $("#editmenu").menu({
        select: function(event, ui) {
            selectedItem = ui.item.attr("value");
            runAction(selectedItem);
        }
    });

    $("#editmenu").hide();
    $("[menu='editmenu']").click(function() {

        if (toggleMenu()) {
            $("#editmenu").show();
        } else {
            $("#editmenu").hide();
        }

    });
    $("[menu='editmenu']").mouseover(function() {

        // console.log($("[menu='editmenu']").offset());
        if (menuActive) {
            hideAllMenus();
            $("#editmenu").show();
        }
    });    


    /* OPTIONS MENU */
    $("#optionsmenu").menu({
        select: function(event, ui) {
            selectedItem = ui.item.attr("value");
            runAction(selectedItem);
        }
    });

    $("#optionsmenu").hide();
    $("[menu='optionsmenu']").click(function() {

        if (toggleMenu()) {
            $("#optionsmenu").show();
        } else {
            $("#optionsmenu").hide();
        }

    });
    $("[menu='optionsmenu']").mouseover(function() {
      
        if (menuActive) {
            hideAllMenus();
            $("#optionsmenu").show();

        }
    });
    
    /* EXTRA ADDITIONS MENU */
    $("#addextramenu").menu({
        select: function(event, ui) {
            selectedItem = ui.item.attr("value");
            runAction(selectedItem);
        }
    });   
    

    $("#addextramenu").hide();  
    
    $("[menu='addextramenu']").click(function() {

        if (toggleMenu()) {
            $("#addextramenu").show();
        } else {
            $("#addextramenu").hide();
        }

    });    
    
    $("[menu='addextramenu']").mouseover(function() {
   
        if (menuActive) {
             hideAllMenus();
            $("#addextramenu").show();
        }
    });    

    $("#dimensionsmenu").hide();
    /* DIMENSIONS MENU -- Currently disabled as it's not needed just yet */
    /*
    $("#dimensionsmenu").menu({
        select: function(event, ui) {
            selectedItem = ui.item.attr("value");   
            runAction(selectedItem);
        }
    });
    var o = $("[menu='dimensionsmenu']").offset(); 
    $("#dimensionsmenu").offset({top:o.top+20, left:o.left});
    $("#dimensionsmenu").hide();
    $("[menu='dimensionsmenu']").click(function() {
           
            if(toggleMenu()) { $("#dimensionsmenu").show(); } else { $("#dimensionsmenu").hide(); $("#helpmenu").hide();}

    });
    $("[menu='dimensionsmenu']").mouseover(function() {
            if(menuActive) { $("#filemenu").hide(); $("#optionsmenu").hide(); $("#dimensionsmenu").show(); $("#helpmenu").hide();}
    });   
    */

    /* HELP MENU */
    $("#helpmenu").menu({
        select: function(event, ui) {
            selectedItem = ui.item.attr("value");
            runAction(selectedItem);
        }
    });

    $("#helpmenu").hide();
    $("[menu='helpmenu']").click(function() {

        if (toggleMenu()) {
            $("#helpmenu").show();
        } else {
            $("#helpmenu").hide();
        }

    });
    $("[menu='helpmenu']").mouseover(function() {
        if (menuActive) {
            hideAllMenus();
            $("#helpmenu").show();
        }
    });
    fixMenuOffsets();

}

function fixMenuOffsets() {
    var verticalOffset = 10;
    var o = $("[menu='addextramenu']").offset();
    $("#addextramenu").offset({
        top: o.top + verticalOffset,
        left: o.left
    });  
    var o = $("[menu='optionsmenu']").offset();
    $("#optionsmenu").offset({
        top: o.top + verticalOffset,
        left: o.left
    });   
    var o = $("[menu='editmenu']").offset();
    $("#editmenu").offset({
        top: o.top + verticalOffset,
        left: o.left
    }); 
    var o = $("[menu='filemenu']").offset();
    $("#filemenu").offset({
        top: o.top + verticalOffset,
        left: o.left
    });
    var o = $("[menu='helpmenu']").offset();
    $("#helpmenu").offset({
        top: o.top + verticalOffset,
        left: o.left
    });    
}


function toggleMenu() {
    csecLib.verticalMenu.hideMenu();   // Issue C0003 : Move to API 
    menuActive = !menuActive;
    if (menuActive) $(".ui-menu-outside").show();
    if (!menuActive) $(".ui-menu-outside").hide();
    return menuActive;
}

function runAction(selected) {

    if (selected == "raiselower") {
        showRaiseLowerDialog();
    } 
    if (selected == "showsectionoptions") {
        showSectionOptions();
    }      
    if (selected == "customdimension") {
        showDimensionDialog();
    }
    if (selected == "addleader") {
        if(drawingLeader) return;
        lastPoint = {};
        drawingLeader = true;
        showHoverText("<center>Click starting point</center>")
        addClickableOverlay();
    }
    if (selected == "editleader") {
        if(drawingLeader) return;
        lastPoint = {};
        $("[clickregion='1']").hide();  // Hides the red clickable rectangles in the SVG, allowing clicking of labels
        showHoverText("<center>Click label text to<br/> edit the leader</center>")
    }      
    
    if (selected == "newsection") {
        if (svgJson.length <= 2) {
            totalWidth = 0;
            startupArgs = null;
            localStorage.noArgs = "true";
            coordinates = [];
            crossSection = [];
            toolItemCount = 0;
            toolItem = [];
            waitingForInput = false;
            sectionInput = [];
            customDimension = [];
            clickRegions = [];
            totalSprites = 0;
            spriteLookup = [];
            csecLib.utils.newSection();
            startupArgs = "";
            stateUndo = []; // Clear the Undo and redo buffers for undoing and redoing stuff
            stateRedo = []; // Clear the Undo and redo buffers                 
        } else {
            popup({
                html: 'Any unsaved changes will be lost.',
                width: 300,
                height: 150,
                title: "Are you sure?",
                buttons: {
                    "Ok": function() {
                        closePopup();
                        totalWidth = 0;
                        startupArgs = null;
                        localStorage.noArgs = "true";
                        coordinates = [];
                        crossSection = [];
                        toolItemCount = 0;
                        toolItem = [];
                        waitingForInput = false;
                        sectionInput = [];
                        customDimension = [];
                        clickRegions = [];
                        totalSprites = 0;
                        spriteLookup = [];
                        csecLib.utils.newSection();
                        startupArgs = null;
                        stateUndo = []; // Clear the Undo and redo buffers for undoing and redoing stuff
                        stateRedo = []; // Clear the Undo and redo buffers                             
                    },
                    "Cancel": function() {
                        closePopup();
                    }
                },
                style: 'font-size:0.7em',
                close: function() {

                },
            });
        }
    }

    if (selected == "printsection") {
        window.print();
    }
    if (selected == "exit") {
        nw.App.quit();
    }

    if (selected == "savesection" && currentFileName.length < 1) selected = "savesectionas"; // No filename?  Ask for one!
    if (selected == "savesection") {
        csecLib.fileControl.saveSectionToFile(false); // Save without a dialog  [Issue 0004]
    }
    if (selected == "savesectionas") {
        csecLib.fileControl.saveSectionToFile(true);   // Save with a dialog    [Issue 0004]
    }

    if (selected == "loadsection") {
        var input = $("#input_loadfile");
        input.click();
    }
    
    if (selected == "savepdf") {
        window.print({'pdf_path': 'c:\\temp\\asd.pdf', 'landscape': false, 'headerFooterEnabled': false })
    }

    if (selected == "savejpeg") {


        /*  Trying to fix the issue of having defs defined AFTER everything else, breaking convert.exe */
        svgDraw.width(draw.width());
        var svgExport = $("svg")[0];
        var defs = $(svgExport).find("defs")[0];
        $(defs).prependTo(svgExport);
        /* Now it's fixed.   Carry on... */

        var svgExport = svgDraw.svg();

        // Inkscape fails miserably if ampersands exist in the SVG file.  Convert ampersands to "&amp;"
        //  -- REMOVED -- 2018-07-26 as this issue no longer exists.  Trying to fix it actually caused more issues
        // svgExport = svgExport.split("&").join("&amp;");

        /* Begin Conversion */
        var svgTitle = $("#textbox_title").val();
        svgTitle = svgTitle.split("\\-").join("_");
        svgTitle = svgTitle.split("//").join("_");
        svgTitle = svgTitle.split("\\s").join("_");
        svgTitle = svgTitle.split("\\n").join("_");
        svgTitle = svgTitle.split("\\t").join("_");
        svgTitle = svgTitle.replace(/[^a-z0-9]/gi, '_');
        var svgFileSurname = tempPath + "\\" + guid();
        if (!svgTitle) svgTitle = "section";
        var svgWriteFile = svgFileSurname + ".svg";
        var jpgReadFile = svgTitle + ".jpg";

        /* Show the Save-As file dialog for saving this JPEG */
        jpgReadFile = devlib.fileSystem.saveFileDialog(jpgReadFile, "image/*", function(e) {
            if (!e) return;
            var jpgReadFile = e;
            devlib.fileSystem.writeFile(svgWriteFile, svgExport, function() {
                var arguments = ["-density", "300", "-antialias", svgWriteFile, jpgReadFile];
                var echo = devlib.fileSystem.spawnChildProcess(convertExe, arguments);
                echo.stdout.on('data', function(data) {
                    dstring = data.toString();
                    console.log("convert.exe says: " + dstring);
                });
                echo.on('close', function(data) {
                    devlib.fileSystem.deleteFile(svgWriteFile);
                    /*
                        if(!debug) { 
                            devlib.fileSystem.deleteFile(svgWriteFile); 
                        } else { debug("Debug mode is enabled.  Source SVG Files not deleted and remain in the 'resources' directory."); };
                        */

                });

            });
        });
    }
    
    if (selected == "savesvg") {

        /*  Trying to fix the issue of having defs defined AFTER everything else, breaking convert.exe */
        var svgExport = $("svg")[0];
        var defs = $(svgExport).find("defs")[0];
        $(defs).prependTo(svgExport);
        /* Now it's fixed.   Carry on... */

        var svgExport = svgDraw.svg();

        /* Inkscape fails miserably if ampersands exist in the SVG file.  Convert ampersands to "&amp;" */
        svgExport = svgExport.split("&").join("&amp;");

        /* Begin Conversion */
        var svgTitle = $("#textbox_title").val();
        svgTitle = svgTitle.split("\\-").join("_");
        svgTitle = svgTitle.split("//").join("_");
        svgTitle = svgTitle.split("\\s").join("_");
        svgTitle = svgTitle.split("\\n").join("_");
        svgTitle = svgTitle.split("\\t").join("_");
        svgTitle = svgTitle.replace(/[^a-z0-9]/gi, '_');
        var svgFileSurname = tempPath + "\\" + guid();
        if (!svgTitle) svgTitle = "section";
        var svgWriteFile = svgFileSurname + ".svg";
        var svgReadFile = svgTitle + ".svg";
        
        // Need to convert relative paths to absolute paths for images and sprite references
        var spritePath = devlib.util.reverseSlashes(devlib.fileSystem.getPath(nw.process.execPath)) + "resources/sprites/";
        svgExport = svgExport.replace(/xlink:href="sprites\//g, 'xlink:href="' + spritePath);
        
        /* Show the Save-As file dialog for saving this JPEG */
        svgReadFile = devlib.fileSystem.saveFileDialog(svgReadFile, "image/*", function(e) {
            if (!e) return;
            var svgReadFile = e;
            devlib.fileSystem.writeFile(svgReadFile, svgExport, function() {
                    // Nothing to do after the file is written, but keeping this here in case we want something to happen later.

            });
        });
    }    


    if (selected == "help") {
        popup({
            html: '<div style="width:99%; height:' + ($(window).height() - 150) + 'px; text-align:center; vertical-align:top;"><iframe width="100%" height="100%" src="help/index.html"></iframe></div>',
            width: $(window).width(),
            height: $(window).height(),
            title: "Help",
            buttons: {
                "Close Help Window": function() {
                    closePopup();
                    if (autoUpdate) {
                        prepareCrossSection();
                   }
               }
           },
           style: 'font-size:0.7em',
           close: function() {
   
            },
        });
    }
    
    if (selected == "shortcuts") {
        popup({
            html: '<div style="width:99%; height:' + ($(window).height() - 150) + 'px; text-align:center; vertical-align:top;"><iframe width="100%" height="100%" src="help/shortcuts.html"></iframe></div>',
            width: $(window).width(),
            height: $(window).height(),
            title: "Shortcuts",
            buttons: {
                "Close Shortcut Window": function() {
                    closePopup();
                    if (autoUpdate) {
                        prepareCrossSection();
                   }
               }
           },
           style: 'font-size:0.7em',
           close: function() {
   
            },
        });
    }    
    
    if (selected == "whatsnew") {
        popup({
            html: '<div style="width:99%; height:' + ($(window).height() - 150) + 'px; text-align:center; vertical-align:top;"><iframe width="100%" height="100%" src="help/changelog.html"></iframe></div>',
            width: $(window).width(),
            height: $(window).height(),
            title: "Change Log, Current Version " + version,
            buttons: {
                "Close Window": function() {
                    closePopup();
                    if (autoUpdate) {
                        prepareCrossSection();
                   }
               }
           },
           style: 'font-size:0.7em',
           close: function() {
   
            },
        });
    }    

    if (selected == "about") {
        popup({
            html: '<div style="height:200px; width:450px; overflow:hidden;"><iframe width="400px" height="300px" src="help/about.html" scrolling="no" style="border:0px;"></iframe></div>',
            width: 470,
            height: 350,
            title: "Cross Section Editor " + version,
            buttons: {
                "Ok": function() {
                    closePopup();
                    if (autoUpdate) {
                        prepareCrossSection();
                    }
                }
            },
            style: 'font-size:0.7em',
            close: function() {

            },
        });
    }

    if (selected == "togglegrid") {
        showGrid = !showGrid;
        prepareCrossSection();
    }
 

    if (selected.split("_")[0] == "sky") {
        var skytype = selected.split("_")[1];
        if (skytype == "none") {
            skyImage = "blank.jpg";
        }
        if (skytype == "classic") skyImage = "sky_classic.png";
        if (skytype == "cloudy1") skyImage = "sky_cloudy1.jpg";
        if (skytype == "cloudy2") skyImage = "sky_cloudy2.jpg";
        if (skytype == "mediumclouds") skyImage = "sky_mediumclouds.jpg";
        if (skytype == "lightclouds") skyImage = "sky_lightclouds.jpg";
        if (skytype == "hazy") skyImage = "sky_hazy.jpg";
        if (skytype == "dusk1") skyImage = "sky_dusk1.jpg";
        if (skytype == "dusk2") skyImage = "sky_dusk2.jpg";
        if (skytype == "sunset") skyImage = "sky_sunset.jpg";
        if (skytype == "city1") skyImage = "sky_city01.jpg";
        if (skytype == "city2") skyImage = "sky_city02.jpg";
        if (skytype == "mountains1") skyImage = "sky_mountains01.jpg";
        if (skytype == "forest1") skyImage = "sky_forest01.jpg";
        if (skytype == "forest2") skyImage = "sky_forest02.jpg";
        prepareCrossSection();
    }
    if (selected.split("_")[0] == "skyfade") {
        var skytype = selected.split("_")[1];
        if (skytype == "none") skyFade = "none";
        if (skytype == "all") skyFade = "all";
        if (skytype == "linear") skyFade = "linear";
        if (skytype == "radial") skyFade = "radial";
        prepareCrossSection();
    }

    menuActive = false;
    
    // Hide the menus after an option is chosen, assuming the option isn't expandable (expandable options have a value of "null")
    if(selected != "null") {
        $(".ui-menu-outside").hide();
        $("#filemenu").hide();
        $("#optionsmenu").hide();
        $("#addextramenu").hide();
        $("#helpmenu").hide();
    } 

}

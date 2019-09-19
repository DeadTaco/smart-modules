/*
    Global actions are a consolidated effort to get all functionality commands into a single spot, so they can be bound via any action.
    There is also a "runAction" function that is quite similar for the menu system.  Eventually it will be merged into the global actions.
    
    Global actions are easier to call upon than having to remember the names of every function.
    
*/
csecLib.showModuleInfo("sm.actions.js", "Defined actions, mainly for quick keys but for any time a quick action needs to be called.");	

// Let's get some clear descriptions for each action.  This is so we can do custom key bindings.
var globalActionName = [];
globalActionName["copydata"] = "Copy Section Data";
globalActionName["pastedata"] = "Paste Section Data";
globalActionName["clearall"] = "Delete All Objects from Card";
globalActionName["matchrightelevation"] = "Match Right Elevation";
globalActionName["matchleftelevation"] = "Match Left Elevation";
globalActionName["matchrightslope"] = "Match Right Elevation and Slope";
globalActionName["matchleftslope"] = "Match Left Elevation and Slope";
globalActionName["template_carback"] = "Add Small Vehicle, Back side";
globalActionName["template_carfront"] = "Add Small Vehicle, Front side";
globalActionName["template_largecarback"] = "Add Large Vehicle, Back side";
globalActionName["template_largecarfront"] = "Add Large Vehicle, Front side";
globalActionName["template_pedestrian"] = "Add Random Pedestrian";
globalActionName["template_desert_singletree"] = "Add a single desert tree";
globalActionName["template_desert_treeplants"] = "Add a single desert tree and plants";
globalActionName["template_desert_plants"] = "Add desert plants";
globalActionName["template_ls_singletree"] = "Add a single tree";
globalActionName["template_ls_treeplants"] = "Add a tree and plants";
globalActionName["template_ls_lightplants"] = "Add a few plants";
globalActionName["template_ls_heavyplants"] = "Add a lot of plants";
globalActionName["template_ls_groundcover"] = "Add ground cover plants";
globalActionName["template_ls_full"] = "Add full landscaping";
globalActionName["template_ls_snowy"] = "Add some snow landscaping";
globalActionName["template_ls_snowybig"] = "Add full snow landscaping";
globalActionName["raise"] = "Raise section piece a half foot";
globalActionName["lower"] = "Lower section piece a half foot";
globalActionName["raiseglobal"] = "Raise the entire cross section by a half foot";
globalActionName["lowerglobal"] = "Lower the entire cross section by a half foot";
globalActionName["save"] = "Save Section";
globalActionName["saveas"] = "Save Section As";
globalActionName["exit"] = "Exit";
globalActionName["new"] = "New Section";
globalActionName["load"] = "Load Section";
globalActionName["exportjpeg"] = "Export to JPEG";
globalActionName["exportsvg"] = "Export to SVG";
globalActionName["exportpdf"] = "Export to PDF";
globalActionName["print"] = "Print";
globalActionName["customdimensions"] = "Show custom dimensions dialog";
globalActionName["addleader"] = "Add new leader";
globalActionName["editleader"] = "Edit leader";
globalActionName["togglecardview"] = "Show/Hide Cards";
globalActionName["zoomin"] = "Zoom cards in";
globalActionName["zoomout"] = "Zoom cards out";
globalActionName["help"] = "Show Help";
globalActionName["togglegrid"] = "Toggle Grid On/Off";
globalActionName["zoomin"] = "Zoom cards in";
globalActionName["zoomout"] = "Zoom cards out";
globalActionName["undo"] = "Undo";
globalActionName["redo"] = "Redo";
globalActionName["abort"] = "Abort Current Action";
globalActionName["togglecardview"] = "Show/Hide Card Deck";


// Do actions based on selections from the context menu on the selected tool item
// t_index = tool index
function globalAction(action, t_index) {
    
     // if(globalActionActive) return; // For whatever reason, the JQUERYUI context menu library is sometimes calling each action twice.

     // First let's get the data needed for copying and duplicating values of adacent cards
     var t_card = $(".toolbox [toolindex=" + t_index + "]");
     var spriteData = [];
     var card = {};
     card.current = {};
     card.right = {};
     card.left = {};
    
     card.current.dom = t_card;
     card.current.index = t_index;
     card.current.offset = Number($("#toolbar [toolindex=" + card.current.index + "] [toolid=offset]").val());
     card.current.width = Number($("#toolbar [toolindex=" + card.current.index + "] [toolid=width]").val());
     card.current.slopeleft = Number($("#toolbar [toolindex=" + card.current.index + "] [toolid=leftheight]").val());
     card.current.sloperight = Number($("#toolbar [toolindex=" + card.current.index + "] [toolid=rightheight]").val());  
     card.current.slope = calculateSlope( card.current.slopeleft, card.current.sloperight, card.current.width );    
    
     card.right.dom = getCardToTheRight(t_index);
     if(card.right.dom) {
         card.right.index = $(card.right.dom).attr("toolindex");
         card.right.offset = Number($("#toolbar [toolindex=" + card.right.index + "] [toolid=offset]").val());
         card.right.width = Number($("#toolbar [toolindex=" + card.right.index + "] [toolid=width]").val());
         card.right.slopeleft = Number($("#toolbar [toolindex=" + card.right.index + "] [toolid=leftheight]").val());
         card.right.sloperight = Number($("#toolbar [toolindex=" + card.right.index + "] [toolid=rightheight]").val());  
         card.right.slope = calculateSlope( card.right.slopeleft, card.right.sloperight, card.right.width );
     }
    
     
     card.left.dom = getCardToTheLeft(t_index);
     if(card.left.dom) {
         card.left.index = $(card.left.dom).attr("toolindex");
         card.left.offset = Number($("#toolbar [toolindex=" + card.left.index + "] [toolid=offset]").val());
         card.left.width = Number($("#toolbar [toolindex=" + card.left.index + "] [toolid=width]").val());
         card.left.slopeleft = Number($("#toolbar [toolindex=" + card.left.index + "] [toolid=leftheight]").val());
         card.left.sloperight = Number($("#toolbar [toolindex=" + card.left.index + "] [toolid=rightheight]").val());
         card.left.slope = calculateSlope( card.left.sloperight, card.left.slopeleft,  card.left.width );
     }

    // Now the actions
    if(action == "abort") {
        addClickableOverlay("destroy");
        hideAllMenus();
        hideHoverText();
        $("#spriteeditbox").hide(); 
        prepareCrossSection();
        action = "none";
    }
    if(action == "copydata") {
        copyCardData(t_index);
    }
    if(action == "pastedata") {
        pasteCardData(t_index);
    }    
    if(action == "clearall") {  
        clearOptions(t_index);
    }      
    if(action == "matchrightelevation") {  
        if(!card.right.dom) return;
        $("#toolbar [toolindex=" + t_index + "] [toolid=offset]").val( card.right.offset + card.right.slopeleft );
        $("#toolbar [toolindex=" + t_index + "] [toolid=leftheight]").val( 0 );
        $("#toolbar [toolindex=" + t_index + "] [toolid=rightheight]").val( 0 );
    }
    if(action == "matchleftelevation") { 
        if(!card.left.dom) return;
        $("#toolbar [toolindex=" + t_index + "] [toolid=offset]").val( card.left.offset + card.left.slopeleft );
        $("#toolbar [toolindex=" + t_index + "] [toolid=leftheight]").val( 0 );
        $("#toolbar [toolindex=" + t_index + "] [toolid=rightheight]").val( 0 );
    }
    if(action == "matchrightslope") {  
        if(!card.right.dom) return;
        $("#toolbar [toolindex=" + t_index + "] [toolid=offset]").val( card.right.offset + card.right.slopeleft );
        $("#toolbar [toolindex=" + t_index + "] [toolid=leftheight]").val( card.current.width * card.right.slope );
        $("#toolbar [toolindex=" + t_index + "] [toolid=rightheight]").val( 0 );
    }
    if(action == "matchleftslope") {  
        if(!card.left.dom) return;
        $("#toolbar [toolindex=" + t_index + "] [toolid=offset]").val( card.left.offset + card.left.sloperight );
        $("#toolbar [toolindex=" + t_index + "] [toolid=leftheight]").val( 0 );
        $("#toolbar [toolindex=" + t_index + "] [toolid=rightheight]").val( card.current.width * card.left.slope );
    }    
    if(action == "template_carback") {  
        var newSprite = getRandomSprite("carsback", card, true);
        spriteData = newSprite.val().split(","); // Let's rotate the car to match the terrain
        spriteData[4] = calculateAngle(card.current.slopeleft, card.current.sloperight, card.current.width);
        newSprite.val(spriteData.join());
    }    
    if(action == "template_carfront") {  
        var newSprite = getRandomSprite("carsfront", card, true);
        spriteData = newSprite.val().split(","); // Let's rotate the car to match the terrain
        spriteData[4] = calculateAngle(card.current.slopeleft, card.current.sloperight, card.current.width);
        newSprite.val(spriteData.join());
    }
    if(action == "template_largecarback") {  
        var newSprite = getRandomSprite("largevehicleback", card, true);
        spriteData = newSprite.val().split(","); // Let's rotate the car to match the terrain
        spriteData[4] = calculateAngle(card.current.slopeleft, card.current.sloperight, card.current.width);
        newSprite.val(spriteData.join());
    }    
    if(action == "template_largecarfront") {  
        var newSprite = getRandomSprite("largevehiclefront", card, true);
        spriteData = newSprite.val().split(","); // Let's rotate the car to match the terrain
        spriteData[4] = calculateAngle(card.current.slopeleft, card.current.sloperight, card.current.width);
        newSprite.val(spriteData.join());
    }      
    if(action == "template_pedestrian") {  
        var newSprite = getRandomSprite("pedestrians", card, true);
    }    
    if(action == "template_desert_singletree") {  
        var newSprite = getRandomSprite("deserttrees", card, true);
        spriteData = newSprite.val().split(",");  // Randomize the size of this sprite by 10 percent
        spriteData[3] = rngi( -10, 10);
        newSprite.val(spriteData.join());              
    }    
    if(action == "template_desert_treeplants") {
        var newSprite = getRandomSprite("deserttrees", card, true);
        spriteData = newSprite.val().split(",");  // Randomize the size of this sprite by 10 percent
        spriteData[3] = rngi( -10, 10);
        newSprite.val(spriteData.join());            
        placeRandomSprites("desertplants", card, 3);
    }
    if(action == "template_desert_plants") {  
        clearOptions(t_index);
        placeRandomSprites("desertplants", card, 3);
    }      
    if(action == "template_ls_singletree") {  
        var newSprite = getRandomSprite("trees", card, true);
        spriteData = newSprite.val().split(",");  // Randomize the size of this sprite by 10 percent
        spriteData[3] = rngi( -10, 10);
        newSprite.val(spriteData.join());          
    }    
    if(action == "template_ls_treeplants") {  
        var newSprite = getRandomSprite("trees", card, true);
        spriteData = newSprite.val().split(","); // Randomize the size of this sprite by 10 percent
        spriteData[3] = rngi( -10, 10);
        newSprite.val(spriteData.join());        
        placeRandomSprites("plants", card, 3);
    } 
    if(action == "template_ls_lightplants") {  
        clearOptions(t_index);
        placeRandomSprites("plants", card, 3);
    }
    if(action == "template_ls_heavyplants") {  
        clearOptions(t_index);
        placeRandomSprites("plants", card, round( card.current.width / 10) * 6);
    }
    if(action == "template_ls_groundcover") {  
        clearOptions(t_index);
        placeRandomSprites("groundcover", card, round( card.current.width / 10) * 6, true);
    }    
    if(action == "template_ls_full") {  
        clearOptions(t_index);
        placeRandomSprites("plants", card, round( card.current.width / 10) * 6);
        placeRandomSprites("trees", card, round( card.current.width / 10) * 2);
    }
    if(action == "template_ls_snowy") {  
        clearOptions(t_index);
        placeRandomSprites("snowytrees", card, 2);
    }  
    if(action == "template_ls_snowybig") {  
        clearOptions(t_index);
        placeRandomSprites("snowytrees", card, round( card.current.width / 10) * 5);
    }       
    if(action == "raiseglobal") {
        var cards = $("#toolbar .toolbox [toolid='offset']");
        var newOffset = 0.5;
        for(var i = 0; i < cards.length; i++) {
            cards[i].value = Number(cards[i].value)+newOffset;
        }       
    }
    if(action == "lowerglobal") {
        var cards = $("#toolbar .toolbox [toolid='offset']");
        var newOffset = -0.5;
        for(var i = 0; i < cards.length; i++) {
            cards[i].value = Number(cards[i].value)+newOffset;
        }       
    }
    if(action == "raise") {
        $(getCardDOM(currentCard)).find("[toolid='offset']").val( Number($(getCardDOM(currentCard)).find("[toolid='offset']").val()) + 0.5 );
    }
    if(action == "lower") {
        $(getCardDOM(currentCard)).find("[toolid='offset']").val( Number($(getCardDOM(currentCard)).find("[toolid='offset']").val()) - 0.5 );     
    } 
    if(action == "help") {
        runAction("help"); 
        action = "none";
    }   
    if(action == "save") {
        runAction("savesection"); 
        action = "none";
    }
    if(action == "saveas") {
        runAction("savesectionas"); 
        action = "none";
    }     
    if(action == "load") {
        runAction("loadsection"); 
        action = "none";
    }      
    if(action == "print") {
        runAction("printsection"); 
    }       
    if(action == "addleader") {
        runAction("addleader");
        action = "none"; // Do NOT update the cross section while adding a leader!!!
    }  
    if(action == "editleader") {
        runAction("editleader"); 
        action = "none"; // Do NOT update the cross section while editing a leader!!!
    }       
    if(action == "new") {
        runAction("newsection"); 
        action = "none";
    }       
    if(action == "exportpdf") {
        runAction("savepdf"); 
        action = "none";
    }
    if(action == "exportjpeg") {
        runAction("savejpeg"); 
        action = "none";
    }
    if(action == "exportsvg") {
        runAction("savesvg"); 
        action = "none";
    }
    if(action == "help") {
        runAction("help"); 
        action = "none";
    }    
    if(action == "togglegrid") {
        runAction("togglegrid"); 
        action = "none"
    } 
    if(action == "exit") {
        runAction("exit"); 
        action = "none";
    }   
    if(action == "customdimensions") {
        runAction("customdimension"); 
        action = "none"
    } 
    if(action == "exportpdf") {
        runAction("savepdf"); 
        action = "none";
    }       
    if(action == "togglecardview") {
        $("#showhidetoolbar").click();
    } 
    if(action == "zoomin") {
        $("#zoomintoolbar").click();
    } 
    if(action == "zoomout") {
        $("#zoomouttoolbar").click();
    } 
    if(action == "undo") {
        doUndo();
    } 
    if(action == "redo") {
        doRedo();
    }     
    if(action == "exportsvg") {
        runAction("savesvg"); 
        action = "none";
    }
    // -- 3D Striping Actions
    if(action.substr(0,9).toLowerCase() == "3d_stripe") {
        section3d.quickStripe(action);
        return false;
    }
    if(action != "none") prepareCrossSection();
}
    
function clearOptions(t_index) {
    $("div[toolindex='" + t_index + "'] select[toolid='spritelist']").empty();    
}

// Places random sprites all over a segment until count is reached
function placeRandomSprites(group, card, count, matchGroundSlope) {
    var t_index = card.current.index;
    var spriteData = [];
    var width = Number($("#toolbar [toolindex=" + t_index + "] [toolid=width]").val());
    var placement = 0;  
    var x = 0;
    var y = 0;
    for(var i = 0; i < count; i++) {
        newSprite = getRandomSprite(group, card, false);
        spriteData = newSprite.val().split(",");
        placement = (Number(width/2) * 12) - 24; // Random placement within the segment, with one foot buffers on the left and right (all in inches)
        x = rng( -placement, placement);
        y = x * card.current.slope;
        spriteData[1] = x;
        spriteData[3] = rngi( -15, 15);  // Randomize the size of this sprite by 15 percent
        spriteData[2] = y;
        if(matchGroundSlope) { 
            spriteData[4] = calculateAngle(card.current.slopeleft, card.current.sloperight, card.current.width);
            console.log("Match ground slope:  YES");
        }
        newSprite.val(spriteData.join());

    }    
}
  
function getRandomSprite(template, card, clearListFirst) {
    var t_index = card.current.index;
    var arr = sprite.templates[template].split(",");
    var s = arr[ rndi(arr.length-1) ];
    var selectbox = $("div[toolindex='" + t_index + "'] select[toolid='spritelist']");

    var items = selectbox.attr("size") + 1;
    if (items > 3) {
        items = 3;
    }
    if(clearListFirst) selectbox.empty(); // Delete all items in the sprite list if told to do so (boolean)
    var newSpriteOption = $("<option></option>").attr("value", s + ",0,0,0,0," + spriteUID()).text(s);
    selectbox.append(newSpriteOption);
    selectbox.attr("size", items);
    if(selectbox[0]) selectbox[0].lastChild.selected = true;
    hideMessage();
    selectbox.unbind();
    selectbox.dragOptions({
        highlight: "",
        done: function() {
            prepareCrossSection();
        }
    });

    if (autoUpdate) {
        prepareCrossSection();
    }    
    return newSpriteOption;
    
}

// Calculate the slope based on left and right elevations and section width
function calculateSlope(left,right,width) {
    return (left-right)/width;
}

// Calculate the slope based on left and right elevations and section width
function calculateAngle(left,right,width) {
    var slope = calculateSlope(left,right,width);
    var angle = Math.atan(slope) * (180 / Math.PI);
    return angle;
}

// Copies a card's data to the clipboard
function copyCardData(t_index) {
    var carddom = getCardDOM(t_index);
    var cardIndex = getCardIndex(t_index);
    clipboard = []; // GLOBALLY defined in sectionmaker.js.  Don't redefine it.
    for(var k in svgJson[cardIndex]) clipboard[k]=svgJson[cardIndex][k];
    console.log("Copied to clipboard");
}

// Paste a card's data to the card with t_index
function pasteCardData(t_index) {
    if(!clipboard.width) return; // Make sure we actually have data in the clipboard.
    var carddom = getCardDOM(t_index);
    
    tid("preset").val(clipboard.preset);
    // tid("preset").change();
    tid("side").val(clipboard.side);
    // Check if we have a curb and gutter.  If so, enable those options in the card.
    if(clipboard.side == "left") {
        tid("curbsideleft").prop("checked", true);
    }
    if(clipboard.side == "right") {
        tid("curbsideright").prop("checked", true);
    }
    if(clipboard.rollcurb) {
        tid("rollcurb").prop("checked", true);
    } else { 
        tid("rollcurb").prop("checked", false);
    }
    tid("label").val(clipboard.label);
    tid("texture").val(patternDefinitions[clipboard.texture].description);
    tid("width").val(clipboard.width);
    tid("offset").val(clipboard.offset);
    tid("thickness").val(clipboard.thickness);
    tid("leftheight").val(clipboard.leftheight);
    tid("rightheight").val(clipboard.rightheight);
    tid("centerline").prop("checked", clipboard.centerline);
    tid("varies").prop("checked", clipboard.widthvaries);
    tid("hidedim").prop("checked", clipboard.hidedim);
    tid("fadeout").prop("checked", clipboard.fadeout);
    $(carddom).attr("subsurface", clipboard.subsurface);
    var newSprite;
    // Populate sprites.
    if(clipboard.sprite.length > 0) {
        for(var i = 0; i < clipboard.sprite.length; i++) {
            newSprite = clipboard.sprite[i].split(",").slice(0,-1);
            newSprite.push(spriteUID());
            
            tid("spritelist").append('<option value="' + newSprite.join() + '">' + newSprite[0] + '</option>');
        }
    }
    
    tid("texture").change();
    
    window.carddom = carddom;
    
    // Shortens the $(carddom).find stuff into a quicker three letter function.  Only for code clarity sake, not much else.
    function tid(toolid) {
        return $(carddom).find("[toolid=" + toolid + "]");
    }
}




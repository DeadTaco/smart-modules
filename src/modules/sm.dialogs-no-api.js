csecLib.showModuleInfo("sm.dialogs-no-api.js", "Temporary NON API Dialogs to later be moved to API: text popups, and user interface objects");	
function htmlBlock() {
    this.text = "";
}

htmlBlock.prototype.add = function(text) {
    this.text += text;
}
htmlBlock.prototype.break = function() {
    this.text += "<br/>";
}
htmlBlock.prototype.break = function() {
    this.text += "<br/>";
}
htmlBlock.prototype.line = function() {
    this.text += "<hr/>";
}



// Leader creation and editing box
function showTextInput(options) {
    options = options || {};
    leaderData.movetarget = false;
    if ($("#generictextinput").length == 0) {
        var div = $("<div id='generictextinput' class='generictextinput'>Edit Label Text<p/></div>");
        // showHoverText("<center>Click new start point</center>");
        hideHoverText();
        var inputArea = $("<textarea>");
        inputArea.width(400);
        inputArea.height(50);
        var btnDone = $("<button>Done</button>");
        var btnCancel = $("<button>Cancel</button>");
        var btnMove = $("<button style='float:right'>Move Leader</button>");
        var leaderOptions = 
        `<div class="leader-options">
            <label>Leader Style</label>
            <div class="leaderoption-arrow" value="arrow"><img src="icons/icon_arrow_arrow.svg"></div>
            <div class="leaderoption-arrow" value="archtick"><img src="icons/icon_arrow_archtick.svg"></div>
            <div class="leaderoption-arrow" value="circle"><img src="icons/icon_arrow_circle.svg"></div>
            <div class="leaderoption-arrow" value="box"><img src="icons/icon_arrow_box.svg"></div>
            <div class="leaderoption-arrow" value="none"><img src="icons/icon_arrow_none.svg"></div>
        </div>
        <hr />
        <span class="landing-options">
            <label>Landing Size</label><input id="landingsize" type="number" style="width:40px" value="30">
            <label>Landing Gap</label><input id="landinggap" type="number" style="width:40px" value="10">
            <label>Arrow Size</label><input id="arrowsize" type="number" style="width:40px" value="1">
        </span>
        <hr />
        <input type="checkbox" id="show-glow"><label for="show-glow">Outer Glow</label>
        `;
        
        div.append(inputArea).append(leaderOptions).append($('<p/>')).append(btnDone).append(btnCancel);
        
        if (options.buttons) {
            for (var i = 0; i < options.buttons.length; i++) {
                var newbutton = $("<button>" + options.buttons[i].label + "</button>");
                newbutton.on('click', options.buttons[i].click );
                div.append(newbutton);
            }
        }
        div.append(btnMove);
        
        if(options.content) inputArea.val(options.content);

        $('body').append(div);
        div.draggable();
        inputArea.focus();
        
        $(`[value=arrow]`).addClass("selected");
        
        // We're working with an existing label.  Fill in the necessary stuff in the form
        if(options.target) {
            inputArea.val(options.target.text);
            options.target.arrowtype = options.target.arrowtype || globalDimensionOptions.tickStyle;
            $("#show-glow").prop('checked', options.target.glow || false);
            $(".leaderoption-arrow").removeClass("selected");
            $(`[value=${options.target.arrowtype}]`).addClass("selected");
            $("#landingsize").val(options.target.landingsize || 30);
            $("#landinggap").val(options.target.gap || 10);
            $("#arrowsize").val(options.target.arrowsize || 1);
            console.log(options.target);
           // addClickableOverlay({ editing : true, leaderData : options.target, target : options.target });
        }
        
        
        var $leaderOptions = $(".leaderoption-arrow");
        $leaderOptions.click(function(e,ui) {
            $leaderOptions.removeClass("selected");
            var $this = $(this);
            $this.addClass("selected");
            options.change(getReturnValues());
        });
        $("#show-glow").on('change', function(e) {
            options.change(getReturnValues());
        })        
        
        inputArea.on('keyup', function(e) {
            if (options.change) {
                options.change(getReturnValues());
            };
        });
        inputArea.on('change', function(e) {
            if (options.change) {
                options.change(getReturnValues());
            };
        });
        $("#landingsize").on('change', function(e) {
            if (options.change) {
                options.change(getReturnValues());
            };
        });
        $("#landinggap").on('change', function(e) {
            if (options.change) {
                options.change(getReturnValues());
            };
        });    
        $("#arrowsize").on('change', function(e) {
            if (options.change) {
                options.change(getReturnValues());
            };
        });         
        btnDone.on('click', function() {
           // if(inputArea.val().length < 1) return false;
            if (options.done) {
                options.done(getReturnValues());
            }            
            hideHoverText();
            addClickableOverlay("destroy");           
            hideTextInput();
            leaderData.clickRegion = false;
            leaderData.currentGroup = false;
            leaderData.currentLanding = false;
            leaderData.currentLine = false;
            leaderData.currentTarget = false;
            leaderData.currentText = false;
            leaderData.currentOffset = false;
        });
        btnCancel.on('click', function() {
            hideHoverText();
            addClickableOverlay("destroy");
            if (options.cancel) {
                options.cancel(getReturnValues());
            }
            hideTextInput();
        });
        
        // Let's redefine / move this leader of requested
        btnMove.on('click', function() {
            addClickableOverlay("destroy");
            oldLeaderData = getReturnValues();   // Make sure we copy this leader's data over to the new leader
            lastPoint = {};
            drawingLeader = true;
            showHoverText("<center>Click new starting point</center>");        
            hideTextInput();
            leaderData.movetarget = oldLeaderData;  // Tell the clickable overlay that we're moving an existing leader
            addClickableOverlay({ leaderData : oldLeaderData, target : options.target, movetarget : oldLeaderData });
        });
        
        
        div.css('left', ($(window).width() / 2) - (div.width() / 2))
        div.show();
        inputArea.focus();

    } else {
        $("#generictextinput").css('left', ($(window).width() / 2) - ($("#generictextinput").width() / 2))
        $("#generictextinput").show();
        $("#generictextinput textarea").val("");
        $("#generictextinput").focus();
    }
    
    function getReturnValues() {
        var values = {};
        values.text = inputArea.val();
        values.arrowtype = $(".leaderoption-arrow.selected").attr('value');
        values.arrowsize = Number($("#arrowsize").val());
        values.glow = $("#show-glow").is(":checked");
        values.landingsize = Number($("#landingsize").val()) || 30;
        values.gap = Number($("#landinggap").val()) || 10;
        return values;
    }
}

function hideTextInput() {
    $("#generictextinput").remove();
}

function showHoverText(text) {
    if ($("#hovertext").length == 0) {

        $('html').on('mousemove', function(e) {
            var hoverBox = $("#hovertext");
            hoverBox.css({
                'top': e.clientY + 'px',
                'left': e.clientX + 20 + 'px'
            });
        });

        var hoverBox = $("<div>");
        hoverBox.attr('id', 'hovertext')
        hoverBox.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: 200,
            height: 'auto',
            backgroundColor: 'white',
            borderRadius: '5px',
            border: '1px solid black',
            fontFamily: 'Arial'
        });
        hoverBox.html(text);
        $("body").append(hoverBox);
        hoverBox.show();
    } else {
        var hoverBox = $("#hovertext");
        hoverBox.show();
        hoverBox.html(text);
    }
}

function hideHoverText() {
    $("#hovertext").hide();
}

function setFooter(text, clickaction) {
    clearAll("footer");
    $("#footer").show();
    var div = $("<div>", {
        html: text,
        click: clickaction || function() {
            $("#footer").hide();
        }
    });
    div.appendTo($("#footer"));
}

// A dialog for raising and lowering the entire cross section
function showRaiseLowerDialog() {
    // Using hard coded dialog in index.html instead of creating it through javascript.  That's just silly.
    hideAllMenus();
    popup({
        html: '<div id="rl_container">' + $("#dialog_raiselower").html() + '</div>',
        width: 200,
        height: 250,
        title: "Raise & Lower All",
        buttons: {
            "Close": function() {
                closePopup();
                if (autoUpdate) {
                    prepareCrossSection();
                }
            },
            "Apply": function() {
                // Cycle through the cards and increase the offset values.
                var cards = $("#toolbar .toolbox [toolid='offset']");
                var newOffset = Number( $("#rl_container #raiseamount").val() );
                                       
                for(var i = 0; i < cards.length; i++) {
                    cards[i].value = Number(cards[i].value)+newOffset;
                }

                if (autoUpdate) {
                    prepareCrossSection();
                }
               
            },
        },
        style: 'font-size:0.7em',
        close: function() {

        },
    });
    // Raise and Lower button control
    $("#rl_container #btn_raiseall").click(function(e) {
        // $("#rl_container #raiseamount").val( Number($("#rl_container #raiseamount").val())+0.5 );
                var cards = $("#toolbar .toolbox [toolid='offset']");
                var newOffset = 0.5;
                                       
                for(var i = 0; i < cards.length; i++) {
                    cards[i].value = Number(cards[i].value)+newOffset;
                }       
                prepareCrossSection();
      
    });
    $("#rl_container #btn_lowerall").click(function(e) {
       // $("#rl_container #raiseamount").val( Number($("#rl_container #raiseamount").val())-0.5 );
                var cards = $("#toolbar .toolbox [toolid='offset']");
                var newOffset = -0.5;
                                       
                for(var i = 0; i < cards.length; i++) {
                    cards[i].value = Number(cards[i].value)+newOffset;
                }       
                prepareCrossSection();        
  
    });
}

// A dialog for raising and lowering the entire cross section
function showSectionOptions() {
    // Using hard coded dialog in index.html instead of creating it through javascript.  That's just silly.
    hideAllMenus();
    popup({
        html: '<div id="rl_container">' + $("#dialog_options").html() + '</div>',
        width: 600,
        height: 460,
        title: "Section Options",
        buttons: {
            "Close": function() {
                closePopup();
                if (autoUpdate) {
                    prepareCrossSection();
                }
            },
            "Apply": function() {
                globalDimensionOptions.fontSize = Number($("#rl_container #option_fontsize").val());
                globalDimensionOptions.tickStyle = $("#rl_container .leaderoption-arrow.selected").attr("value");
                if (autoUpdate) {
                    prepareCrossSection();
                }
               
            },
        },
        style: 'font-size:0.7em',
        close: function() {

        },
    });
    
    $("#rl_container .leaderoption-arrow").removeClass("selected");
    $(`#rl_container .leaderoption-arrow[value=${globalDimensionOptions.tickStyle}]`).addClass("selected");
    $(`#rl_container #option_fontsize`).val(globalDimensionOptions.fontSize);
    
    var $leaderOptions = $("#rl_container .leaderoption-arrow");
    $leaderOptions.click(function(e,ui) {
        $leaderOptions.removeClass("selected");
        var $this = $(this);
        $this.addClass("selected");
    });    

}

function showDimensionDialog() {
    var html = new htmlBlock();
    sectionInput.left = sectionInput.right = -1;
    html.add('<div id="csec_area" style="font-size:0.7em">');
    html.add('Select Dimension:<select class="toolitem" toolid = "csec_dropdown">');
    html.add('<option>Create new...</option>');
    html.add('</select>');
    html.add('<button class="toolitem iosbutton small padded0" toolid = "csec_btnDelete"><small>Delete</small></button>');
    html.line();
    html.add('<span class="width100">Dimension Name</span><input class="toolitem" toolid = "csec_description"></input>');
    html.add('<button class="toolitem iosbutton small padded0" toolid = "csec_btnCopy"><small>&#8601; Copy</small></button>');
    html.break();
    html.add('<span class="width100">Dimension Label</span><input class="toolitem" toolid = "csec_label"></input>');
    html.break();
    html.add('<span class="width100">Width Override</span><input class="toolitem" toolid = "csec_override"></input>(optional)');
    html.break();
    html.add('Select Dimension Objects <button class="toolitem iosbutton small padded0" toolid = "csec_btnChooseLeft"><span style="font-size:1.2em">&#8592;</span> Left</button>');
    html.add('<button class="toolitem iosbutton small padded0" toolid = "csec_btnChooseRight">Right <span style="font-size:1.2em">&#8594;</span></button>');
    html.break();
    html.add('<span class="width100 bottom">Left Object:</span><div class="bottom" toolid="csec_leftobjectlabel">None</div>');
    html.break();
    html.add('<span class="width100 bottom">Right Object:</span><div class="bottom" toolid="csec_rightobjectlabel">None</div>');
    html.break();
    html.break();
    html.add('<div toolid = "csec_positiondiv" style="margin-bottom:3px; margin-top:-3px;">Vertical Position:<br />');
    html.add('<input type="radio" name="csec_pos" value="1" toolid = "csec_positionhigh" >High');
    html.add('<input type="radio" name="csec_pos" value="3" toolid = "csec_positionmedium" >Above CL');
    html.add('<input type="radio" name="csec_pos" value="4" toolid = "csec_positioncenter">Centered');
    html.add('<input type="radio" name="csec_pos" value="8" toolid = "csec_positionlow" checked>Low');
    html.add('<input type="radio" name="csec_pos" value="10" toolid = "csec_positionbottom" checked>Bottom</div>');
    html.add('<p /><label>Custom distance from bottom:</label><input style="width:80px;" type="number" id="csec_pos_manual" value="0" toolid = "csec_positionbottom"> feet');
    html.add('</div>');
    var bottom = 10;
    popup({
        html: html.text,
        width: 500,
        height: 500,
        title: "Custom Dimension Definitions",
        buttons: {
            "Cancel": function() {
                closePopup();
                if (autoUpdate) {
                    prepareCrossSection();
                }
            },
            "Done": function() {
                if (sectionInput.left == -1) {
                    alert("You are missing a left side dimension object!");
                    return;
                }
                if (sectionInput.right == -1) {
                    alert("You are missing a right side dimension object!");
                    return;
                }
                if (!$("[toolid='csec_description']").val()) {
                    $("[toolid='csec_description']").val("Dimension" + rndi(100000));
                }
                /* If the dimension already exists, overwrite it.  Otherwise, push a new one into the array */
                if (getCustomDimension($("[toolid='csec_description']").val()) === false) {
                    var val = (($("#csec_pos_manual").val() / gs(1)) - bottom) *-1;
                    customDimension.push({
                        left: sectionInput.left,
                        right: sectionInput.right,
                        description: $("[toolid='csec_description']").val(),
                        label: $("[toolid='csec_label']").val(),
                        override: $("[toolid='csec_override']").val(),
                        position: val,
                    });
                } else {
                    var id = getCustomDimension($("[toolid='csec_description']").val());
                    var val = (($("#csec_pos_manual").val() / gs(1)) - bottom) *-1;
                    customDimension[id] = {
                        left: sectionInput.left,
                        right: sectionInput.right,
                        description: $("[toolid='csec_description']").val(),
                        label: $("[toolid='csec_label']").val(),
                        override: $("[toolid='csec_override']").val(),
                        position:val,
                    };
                }
                closePopup();
                if (autoUpdate) {
                    prepareCrossSection();
                }
            },
        },
        style: 'font-size:0.7em',
        close: function() {
            
        },
    });

    $("[toolid='csec_btnDelete']").hide();
    
    $("[name='csec_pos']").change(function(e) {
        var num = gs(-( this.value - bottom)) - 1;
        if(num < 0) num = 0;
        var val = Math.round(num);
        $("#csec_pos_manual").val( val ) ;
        
    });
    

    /* Custom dimensions exist already.  Let's put them in the drop down list. */
    if (customDimension.length > 0) {
        var dropdown = $("[toolid='csec_dropdown']");

        for (var i = 0; i < customDimension.length; i++) {
            var dim = customDimension[i];
            dropdown.append($("<option>" + dim.description + "</option>"));
        }

        dropdown.change(function(e) {
            if (this.value == "Create new...") {
                $("[toolid='csec_btnDelete']").hide();
                $("[toolid='csec_description']").val("");
                $("[toolid='csec_label']").val("");
                $("[toolid='csec_override']").val("");
                sectionInput.right = -1;
                sectionInput.left = -1;
                $("[toolid='csec_leftobjectlabel']").html("Please select");
                $("[toolid='csec_rightobjectlabel']").html("Please select");
                $("[toolid='csec_positionlow']").prop("checked", true);
                $("#csec_pos_manual").val( 23 ) ;
            } else {
                var id = getCustomDimension(dropdown.val());
                var thisval = customDimension[id];
                $("[toolid='csec_btnDelete']").show();
                $("[toolid='csec_description']").val(thisval.description);
                $("[toolid='csec_label']").val(thisval.label);
                $("[toolid='csec_override']").val(thisval.override);
                sectionInput.right = thisval.right;
                sectionInput.left = thisval.left;
                var lbl = $("div[toolindex='" + sectionInput.left + "'] [toolid='label']").val();
                if (!lbl) lbl = "No Description";
                $("[toolid='csec_leftobjectlabel']").html(lbl + ", ID: " + thisval.left);
                var lbl = $("div[toolindex='" + sectionInput.right + "'] [toolid='label']").val();
                if (!lbl) lbl = "No Description";
                $("[toolid='csec_rightobjectlabel']").html(lbl + ", ID: " + thisval.right);
                var pos = thisval.position;
                if (Math.round(pos) == 1) $("[toolid='csec_positionhigh']").prop("checked", true);
                if (Math.round(pos) == 3) $("[toolid='csec_positionmedium']").prop("checked", true);
                if (Math.round(pos) == 4) $("[toolid='csec_positioncenter']").prop("checked", true);
                if (Math.round(pos) == 9) $("[toolid='csec_positionlow']").prop("checked", true);
                var _num = gs(-( pos - bottom ));
                var _val = Math.round(_num);
                $("#csec_pos_manual").val( _val ) ;                
            }
        });
    }

    $("[toolid='csec_btnChooseLeft']").click(function(e) {
        waitingForInput = true;
        sectionInput.left = -1; // When set to -1, it tells it we are asking to get this value from the clicked input
        setFooter("Click the section piece with the left edge you want to use as your left dimension line.  <yellow>Click here to cancel.</yellow>", function() {
            $("#footer").hide();
            $("#dialog").dialog('open');
        });
        closePopup();
    });
    $("[toolid='csec_btnChooseRight']").click(function(e) {
        waitingForInput = true;
        setFooter("Click the section piece with the right edge you want to use as your right dimension line.  <yellow>Click here to cancel.</yellow>", function() {
            $("#footer").hide();
            $("#dialog").dialog('open');
        });
        sectionInput.right = -1;
        closePopup();
    });

    $("[toolid='csec_btnCopy']").click(function(e) {
        $("[toolid='csec_label']").val($("[toolid='csec_description']").val());
    });

    $("[toolid='csec_btnDelete']").click(function(e) {
        deleteCustomDimension($("[toolid='csec_dropdown']").val());
        if (autoUpdate) {
            prepareCrossSection();
        }
        closePopup();
    });

}

function getCustomDimension(description) {
    if (customDimension.length == 0) return false;
    for (var i = 0; i < customDimension.length; i++) {
        if (customDimension[i].description == description) {
            return i;
        }
    }
    return false;
}

function deleteCustomDimension(description) {
    if (customDimension.length == 0) return false;
    for (var i = 0; i < customDimension.length; i++) {
        if (customDimension[i].description == description) {
            customDimension.splice(i, 1);
            return true;
        }
    }
    return false;
}

function returnToInput(sectionId) {
    waitingForInput = false;
    var lbl = $("div[toolindex='" + sectionId + "'] [toolid='label']").val();
    if (lbl.length < 1) lbl = "No Description";
    lbl += ", ID: " + sectionId;
    $("#footer").hide();
    if (sectionInput.left == -1) {
        sectionInput.left = sectionId;
        $("[toolid='csec_leftobjectlabel']").html(lbl);
    } else {
        sectionInput.right = sectionId;
        $("[toolid='csec_rightobjectlabel']").html(lbl);
    }
    $("#dialog").dialog('open');
}




/* Available Functions 

Add a quick popup message dialog box
    fastPopup(message, title, width, height) 
    
Add a more detailed popup with options
    popup(options)
    Options = width, height, title, html, buttons, show, hide
    
Convert a DIV to a dialog box
    showDialog(div, title, width, height, buttonlist)

Add a radio button to a DIV, with group name
    addRadioButton(groupname, value, description, checked)
    
Add a quick yes/no dialog option, radio buttons
    addYesNo(groupname, description)
    
Add a dropdown box
    addDropdown(div, id, items, defaultvalue)
    
Others
function showMessage(msg) {
    $("#quickmessagebox").html(msg);
    $("#quickmessagebox").show();	
}
function showProgress(msg) {
    $("#quickmessagebox").html(msg + '<p/><img style="margin-top:15px" src="icons/saving4.gif"></img>');
    $("#quickmessagebox").show();	
}	
function hideMessage() {
    $("#quickmessagebox").hide();	
}	
function hideProgress() {
    $("#quickmessagebox").hide();	
}

*/

var dialog_currentDialog = "";
	
	function fastPopup(message, title, width, height) {
		if(!width) width=500;
		if(!height) height=500;
		if(width == "max") {
			width=window.innerWidth-30;
			height=window.innerHeight-30;
		}
        
        var elementExists = document.getElementById("dialog");
	    if(!elementExists) {
            var div = document.createElement("div");
            div.id = "dialog";
            document.body.appendChild(div);
        }
		if(!title) {title = ' ';}
		if(message != "") {
			$( "#dialog" ).html(message);
		}
		$( "#dialog" ).dialog( 'option', 'title', title);

		var ok = function() {
			$( "#dialog" ).dialog( 'close' );
		}
		var open = function() {
			$( "#dialog" ).dialog( 'close' );
			window.open(link);
		}		
		
		var cancel = function() {
			// alert('This is Cancel button');
		}

		var dialogOpts = {
			dialogClass:'formOptions',
			buttons: {
				"Close": ok
			},
			width : width,
			height: height,
		};

		$("#dialog").dialog(dialogOpts);
		 $( "#dialog" ).dialog( 'open' );
	}
	
	function closePopup() {
		$( "#dialog" ).dialog( 'close' );
	}
	function popup(options) {
		/* 	Evidently, I re-created the dialog function from jqueryui all over again, except
			it has some extended features catered especially to the billing app
		
		Possible options 
		
		width 	(in pixels use "max" to fit to window)
		height 	(in pixels, use "max" to fit to window)
		title	(title of popup window)
		html 	(the html/text to show in the popup)
		buttons { "Button Text" : action, "Button2 Text" : action, etc : etc }
		show 	(animation type for showing the popup)
		hide	(animation type for hiding the popup)
		*/
        if(!options) return;
        if(typeof options == "string") {
            options = {
                html : options,
            }
        }
        var elementExists = document.getElementById("dialog");
	    if(!elementExists) {
            var div = document.createElement("div");
            div.id = "dialog";
            document.body.appendChild(div);
        }
        
		dialog_currentDialog = $( "#dialog" );

		
		options.show = options.show ? options.show : "fade";
		options.hide = options.hide ? options.hide : "fade";
		options.width = options.width ? options.width : 500;
		options.height = options.height ? options.height : 500;
        
		if(!options.buttons) options.buttons = { "ok" : function() { closePopup(); } };		
		
		if(!options.title) {options.title = ' ';}
		if(options.html != "") {
			$( "#dialog" ).html(options.html);
		}
		// $( "#dialog" ).dialog( 'option', 'title', title);

		if(options.width == "max") {
			options.width=window.innerWidth-30;
		}
		if(options.height == "max") {
			options.height=window.innerHeight-30;
		}        
        
		var dialogOpts = {
			dialogClass: options.class || 'formOptions',
			buttons: options.buttons,
			width : options.width,
			height: options.height,
			title: options.title,
			show : options.show,
			hide : options.hide
		};
        if(options.close) { dialogOpts.close = options.close; }

		$("#dialog").dialog(dialogOpts);
		$( "#dialog" ).dialog( 'open' );
	}	

	function showDialog(div, title, width, height, buttonlist) {
		dialog_currentDialog = $( "#" + div );
		var fulldiv = "#" + div;
		if(!width) width=500;
		if(!height) height=500;
		if(width == "max") {
			width=window.innerWidth-30;
			height=window.innerHeight-30;
		}
		if(!title) {title = ' ';}
		$( fulldiv ).dialog( 'option', 'title', title);
		var dialogOpts = {
			dialogClass:'formOptions',
			buttons: buttonlist,
			width : width,
			height: height,
		};

		$( fulldiv ).dialog(dialogOpts);
		 $( fulldiv ).dialog( 'open' );
		 
		 $('div#' + div).bind('dialogclose', function(event) {
			 unlockPage();
		 });		 
	}	

	function addRadioButton(groupname, value, description, checked)
	{
			buttoncount++;
			var generalinput = document.getElementById("generalinput");
			var ibox = document.createElement("input");
			var itext = document.createElement("span");
			ibox.type="radio";
			ibox.name=groupname;
			ibox.id =groupname + buttoncount;
			ibox.value = value;
			ibox.setAttribute("style", "margin-left:10px;background-color:white;");
			itext.innerHTML="<a style=\"margin-right:10px\" href = \"javascript:toggleRadioButton('" + groupname + buttoncount + "','" + value + "')\">" + description + "</a>";
			if(checked == true) {
				setCheckedValue(ibox,value);	
			}
			generalinput.appendChild(ibox);	
			generalinput.appendChild(itext);
	}
	
	function addYesNo(groupname, description)
	{
			addText(description);
			addRadioButton(groupname,"Yes","Yes");
			addRadioButton(groupname,"No", "No");	
		
	}			

	function addRadioButtons(groupname, description, items)
	{
			addText(description);
			for (index in items) {
				addRadioButton(groupname,items[index],items[index]);
			}
		
	}		
	
	function addDropdown(div, id, items, defaultvalue)
	{
			var thisDiv = document.getElementById(div);
			var ibox = document.createElement("select");
			ibox.name=id ;
			ibox.id = id;
			
			for (index in items) {
				ibox.options[ibox.options.length] = new Option(items[index], index);
			}
			ibox.value= ibox.options[0].value;
			ibox.setAttribute("style", "margin-left:10px;background-color:white;");
			thisDiv.appendChild(ibox);	
			return ibox;
	}			
	
	function addNumberInput(groupname,description)
	{
			var ibox = document.createElement("input");
			var itext = document.createElement("span");
			ibox.type = "number";
			ibox.size=20;
			ibox.name=groupname;
			ibox.id = groupname;
			ibox.setAttribute("style", "margin-left:10px;background-color:white;");
			itext.setAttribute("style", "margin-left:10px;");
			itext.innerHTML=description;
			generalinput.appendChild(itext);
			generalinput.appendChild(ibox);			
	}
	function addTextInput(groupname,description,div,defaulttext)
	{
			if(!div) {var mydiv = document.getElementById("generalinput");}
			else {
			var mydiv = document.getElementById(div);	
			}			
			var ibox = document.createElement("input");
			var itext = document.createElement("span");
			ibox.type = "text";
			ibox.size=30;
			ibox.name=groupname;
			ibox.id = groupname;
			if(defaulttext) { 
				ibox.value = defaulttext; 
			}
			
			ibox.setAttribute("style", "margin-left:10px;background-color:white;");
			itext.setAttribute("style", "margin-left:10px;");
			itext.innerHTML=description;
			mydiv.appendChild(itext);
			mydiv.appendChild(ibox);			
	}			
	
	function addText(text, div)
	{
			if(!div) {var mydiv = document.getElementById("generalinput");}
			else {
			var mydiv = document.getElementById(div);	
			}	
			var itext = document.createElement("span");
			itext.setAttribute("style", "margin-left:10px;");
			itext.innerHTML=text;
			mydiv.appendChild(itext);
	}	
	function addBreak(div)
	{
			if(!div) {var mydiv = document.getElementById("generalinput");}
			else {
			var mydiv = document.getElementById(div);	
			}
			var itext = document.createElement("p");
			mydiv.appendChild(itext);
	}	
	
	function addToolTip(id, content, width) {
		if(!width) {
			 $( id ).tooltip({
				track: false,
				show: {
					effect: "none"
				},
				hide: {
					effect: "none"
				},		
				content: content ,
				 position: {
					my: "center bottom-20",
					at: "center top",
					using: function( position, feedback ) {
					$( this ).css( position );
					$( "<div>" )
					.addClass( "arrow" )
					.addClass( feedback.vertical )
					.addClass( feedback.horizontal )
					.appendTo( this );
					}
				}
			});	
		}
		else {
			 $( id ).tooltip({
				track: false,
				show: {
					effect: "none"
				},
				hide: {
					effect: "none"
				},		
				open: function (event, ui) {
					ui.tooltip.css("max-width", width + "px");
				},
				content: content ,
				 position: {
					my: "center bottom-20",
					at: "center top",
					using: function( position, feedback ) {
					$( this ).css( position );
					$( "<div>" )
					.addClass( "arrow" )
					.addClass( feedback.vertical )
					.addClass( feedback.horizontal )
					.appendTo( this );
					}
				}
			});	
		}		
	}	
	
	function showToolTip(header, html, width, height) {
		html = "<div id='tooltipbox-content'>" + html;
		if(header) {
			html = "<div class='tooltip-header' style='width:110%; height:30px; margin-left:-5px; margin-top:-5px; padding-top:3px; padding-left:5px;'><h3>" + header + " </h3></div>" + html;
		}
		html += "</div>";
		$("#tooltipbox").html(html);
		$("#tooltipbox").show();
		if(width) { $("#tooltipbox").css({ width:width + "px" }); } else { $("#tooltipbox").css({ width:"auto" }); }
		if(height) { $("#tooltipbox").css({ height:height + "px" }); } else { $("#tooltipbox").css({ height:"auto" }); }

		/*
		$("#tooltipbox-content").width($("#tooltipbox").width());
		$("#tooltipbox").css({
			height:$("#tooltipbox-content").height()
		});	
		$("#tooltipbox").css({ height:"auto" });
		});		
		$("#tooltipbox").height($("#tooltipbox-content").height());		
		*/
		tooltipVisible = true;
		trackToolTip();
	}
	
	function hideToolTip() { tooltipVisible = false; }
	
	function trackToolTip() {
		var posX = mousePosition.x + 20;
		var posY = mousePosition.y;
		var wHeight = $(window).height();
		var wWidth = $(window).width();		
		var boxWidth = $("#tooltipbox").width();
		var boxHeight = $("#tooltipbox").height();
		
		if(posX + boxWidth > wWidth) {
			posX -= ($("#tooltipbox").width() + 40);
		}
		if(posY + boxHeight > wHeight) {
			posY -= ($("#tooltipbox").height());
		}		

		var oSet = { top: posY, left: posX };
		$("#tooltipbox").offset( oSet );
		
		if(tooltipVisible == true) {
			setTimeout(function(){ trackToolTip(); },10);
		} else {
			$("#tooltipbox").hide();
		}
	}
	
	function getQuadrant(x, y) {
			var wHeight = $(window).height();
			var wWidth = $(window).width();
			var hCenter = wWidth / 2;
			var vCenter = wHeight / 2;
			if(x <= hCenter && y <= vCenter) {quadrant = 1; }
			if(x >= hCenter && y <= vCenter) {quadrant = 2; }
			if(x >= hCenter && y >= vCenter) {quadrant = 3; }
			if(x <= hCenter && y >= vCenter) {quadrant = 4; }
			return quadrant;
	}
 
/* If a div is called 'dialog', convert it to a dialog box */
function prepareDialogs() {
    var divs = $('div[rel^="dialog"]'), i=0;
    for(i = 0; i <= divs.length; i++) {
        divs.eq(i).dialog({
            autoOpen: false,
            show: {
                effect: "fade",
                duration: 200
            },
            hide: {
                effect: "fade",
                duration: 200
            },
        });	
    }     
}

/* CONTEXT MENUS FOR INDIVIDUAL OBJECTS */
/* If the DIV or object has the 'hasmenu' class, it becomes a context menu! */
function prepareContextMenus() {
    $(document).contextmenu({
        delegate: ".hasmenu",
        menu: [
            {title: "Insert Child Directory", cmd: "insertchilddir", uiIcon: "ui-icon-pencil", disabled : false},
            {title: "Insert Sibling Directory", cmd: "insertsiblingdir", uiIcon: "ui-icon-home", disabled : false},
            {title: "Insert Child File", cmd: "insertchildfile", uiIcon: "ui-icon-pencil", disabled : false},
            {title: "Insert Sibling File", cmd: "insertsiblingfile", uiIcon: "ui-icon-home", disabled : false},            
            {title: "Delete Node", cmd: "delete", uiIcon: "ui-icon-trash", disabled : false},
            ],
        show: { effect: "fade", duration: "fast"},
        hide: { effect: "fade", duration: "fast" },		
        beforeOpen: function(event, ui) {
            var obj = objIdToObject($(ui.target).attr("objid"));
            var $menu = ui.menu;
            if(obj.type=="root") {
                $(document).contextmenu("enableEntry", "insertsiblingdir", false);
                $(document).contextmenu("enableEntry", "insertsiblingfile", false);
                $(document).contextmenu("enableEntry", "delete", false);
            }
        },
        select: function(event, ui) {
            var obj = objIdToObject($(ui.target).attr("objid"));
            if(ui.cmd == "delete") 
            { popup({
                width: 300, height: 300,
                title: "Are you sure?",
                html: "Deleting a node can't be undone.  This is just to confirm you are ok with this.",
                buttons:{
                            "NO!" : function() { closePopup(); },
                            "Yes" : function() { closePopup(); obj.kill(); expandTree(rootObject); }
                        },
            }); }
                
            if(ui.cmd == "insertchilddir") {	
                if(obj.type == "file") { alert("Can't add a subdirectory or file to a file!  Please select a directory instead."); return; }
                var temp = obj.addChild("New Folder", "dir");
                 expandTree(rootObject);
                scrollTo(temp.id);
            }
            if(ui.cmd == "insertsiblingdir") {	
                var parentObj = obj.getParent();
                var temp = parentObj.addChild("New Folder", "dir");
                expandTree(rootObject);
                scrollTo(temp.id);
            }
            if(ui.cmd == "insertchildfile") {	
                if(obj.type == "file") { alert("Can't add a subdirectory or file to a file!  Please select a directory instead."); return; }
                var temp = obj.addChild("File", "file");
                 expandTree(rootObject);
                scrollTo(temp.id);
            }
            if(ui.cmd == "insertsiblingfile") {	
                var parentObj = obj.getParent();
                var temp = parentObj.addChild("File", "file");
                expandTree(rootObject);
                 scrollTo(temp.id);
            }            
            if(ui.cmd == "insert") {	$('#btn_lots').click();	}
        }
    });	
}

/* Center a dialog box, tweak as necessary to match proper ID */
function centerMessageBox() {
    var messageWidth = $("#quickmessagebox").width();
    var messageHeight = $("#quickmessagebox").height();
    var pageHeight = $(window).height();
    var pageWidth = $(window).width();            
    messageCenterX = (pageWidth / 2) - (messageWidth / 2);
    messageCenterY = (pageHeight / 2) - (messageHeight / 2);
    $("#quickmessagebox").css({top: messageCenterY, left: messageCenterX, position:'absolute'});
}

/* Devin's custom dialog boxes */
function showMessage(msg, optionalButton) {
    
    if(optionalButton) { msg += '<p/><button onclick="hideMessage()">' + optionalButton + '</button>'; }
    var elementExists = document.getElementById("quickmessagebox");
    if(!elementExists) {
        var div = document.createElement("div");
        div.id = "quickmessagebox";
        div.className="msgbox";
        document.body.appendChild(div);
        $("#quickmessagebox").addClass("msgbox ui-dialog");
    }            
            
    $("#quickmessagebox").html(msg);
    $("#quickmessagebox").show();
    centerMessageBox();
    return $("#quickmessagebox");
}
function showProgress(msg) {
    var elementExists = document.getElementById("quickmessagebox");
    if(!elementExists) {
        var div = document.createElement("div");
        div.id = "quickmessagebox";
        document.body.appendChild(div);
        $("#quickmessagebox").addClass("msgbox ui-dialog");
    }               
            
    $("#quickmessagebox").html(msg + '<p/><img style="margin-top:15px" src="icons/saving4.gif"></img>');
    $("#quickmessagebox").show();
    centerMessageBox();
}	
function hideMessage() {
    $("#quickmessagebox").hide();	
}	
function hideProgress() {
    $("#quickmessagebox").hide();	
}

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
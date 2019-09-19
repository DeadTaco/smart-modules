/* 
sm.eventmapper.js
Sets up interactive events for the DOM and its elements
*/

SmartModule.fn.module("events", {
  description: [
    "sm.eventmapper.js",
    "Sets up interactive events for the DOM and its elements"
  ],
  eventList: {},
  add(querySelector, eventName, evt) {
    let nodes = document.querySelectorAll(querySelector);
    Array.from(nodes).map(node => {
      // Keep a tally of what events are added to an element.  For debugging as well as preventing duplicates
      if (!this.eventList[node]) this.eventList[node] = {};
      if (!this.eventList[node][eventName])
        this.eventList[node][eventName] = "";
      if (this.eventList[node][eventName] != "") {
        // console.warn(`Warning: An element within "${querySelector}" already has an event bound to it named "${eventName}"!  This event being overwritten!`); // [DEBUG]
        node.removeEventListener(eventName, this.eventList[node][eventName]);
      }
      this.eventList[node][eventName] = evt;
      node.addEventListener(eventName, evt);
    });
    return nodes;
  },
  remove(querySelector, eventName) {
    let nodes = document.querySelectorAll(querySelector);
    // Keep a tally of what events are removed from an element.  For debugging as well as preventing duplicates
    Array.from(nodes).map(node => {
      if (this.eventList[node]) {
        // No events were bound to this element, so just return without doing anything.
        if (this.eventList[node][eventName]) {
          node.removeEventListener(eventName, this.eventList[node][eventName]);
        }
      }
    });
    return nodes;
  },
  removeAll(querySelector) {
    let nodes = document.querySelectorAll(querySelector);
    // Keep a tally of what events are removed from an element.  For debugging as well as preventing duplicates
    Array.from(nodes).map(node => {
      if (this.eventList[node]) {
        // No events were bound to this element, so just return without doing anything.
        Object.keys(this.eventList[node]).map(key => {
          if (this.eventList[node][key]) {
            node.removeEventListener(key, this.eventList[node][key]);
            console.log(`Removing ${key}`);
          }
        });
      }
    });
    return nodes;
  },
  initialize() {
    // * initalize Sets up all initial DOM events.  Currently using jQuery, so let's convert these to an internal function later.
    let $root = this.root;
    // Vertical drop down options
    this.add("#dropdowntoggle", "click", () => {
      $root.verticalMenu.toggleMenu();
    });

    // Sprite movement and scale dialog actions
    // This is the 'done' button in the sprite editing dialog
    this.add("[movesprite]", "click", e => {
      let node = e.target;
      var direction = $(node).attr("movesprite");
      console.log(direction);
      var spritedata = currentSpriteForEdit.value.split(",");
      if (direction == "down") {
        spritedata[2]++;
      }
      if (direction == "up") {
        spritedata[2]--;
      }
      if (direction == "right") {
        spritedata[1]++;
      }
      if (direction == "left") {
        spritedata[1]--;
      }
      if (direction == "done") {
        $("#spriteeditbox").hide();
      }
      $("#sprite_offsetx").val(spritedata[1]);
      $("#sprite_offsety").val(-spritedata[2]);
      currentSpriteForEdit.value = spritedata.join(",");
      if (autoUpdate) {
        prepareCrossSection();
      }
      updateSpriteValues(node);
    });
    /* Continued Sprite movement and scale dialog actions */
    this.add("#btn_resetsprite", "click", e => {
      var spritedata = currentSpriteForEdit.value.split(",");
      $("#slider_offsetx").val(0);
      $("#slider_offsety").val(0);
      $("#slider_scale").val(0);
      $("#slider_rotate").val(0);
      $("#sprite_offsetx").val(0);
      $("#sprite_offsety").val(0);
      $("#sprite_scale").val(0);
      $("#sprite_rotate").val(0);
      updateSpriteValues($("#spriteeditbox"));
      liveSpriteTweak($("#slider_offsetx")[0]);
      // currentSpriteForEdit.value = spritedata[0] + ",0,0,0," + spritedata[5];
      if (autoUpdate) {
        // makeSpriteDraggable(_sprite,sdata)
        // updateSpriteValues($("#spriteeditbox"));
        // prepareCrossSection();
      }
    });

    this.add("#mode3d", "click", () => {
      switchMode();
    });

    this.add("[refresh]", "input", e => {
      // If sliders in the sprite editor are used, live update the sprite
      liveSpriteTweak(e.target);
    });

    this.add("[editsprite]", "change", e => {
      // If the user types a value into the sprite editor, make sure it updates the sprite and slider simultaneously
      updateSpriteValues(e.target);
      liveSpriteTweak(e.target);
    });

    this.add("#textbox_title", "change", () => {
      addUndoState();
      if (autoUpdate) {
        prepareCrossSection();
      }
    });

    this.add("#cleartitlebox", "click", () => {
      addUndoState();
      $("#textbox_title").val("");
      if (autoUpdate) {
        prepareCrossSection();
      }
    });

    this.add("#showhidetoolbar", "click", () => {
      $("#showhidetoolbar").toggleClass("collapsed");
      if ($("#showhidetoolbar").hasClass("collapsed")) {
        $("#showhidetoolbar").html("&#9660;");
        setToolbarAnim({
          height: 0
        });
      } else {
        $("#showhidetoolbar").html("&#9650;");
        setToolbarAnim({
          height: 330
        });
      }
    });

    this.add("#zoomintoolbar", "click", () => {
      zoomlevel += 0.25;
      setToolbarAnim({
        zoom: zoomlevel
      });
    });

    this.add("#zoomouttoolbar", "click", () => {
      zoomlevel -= 0.25;
      setToolbarAnim({
        zoom: zoomlevel
      });
    });

    // Button for controlling auto scaling of the viewport // REVISION 2019-01-10, this is no longer used for locking the viewport.  Now it resets the view!
    document.getElementById("btn_autoscale").classList.remove("locked"); // Do NOT start with a locked viewport
    this.add("#btn_autoscale", "click", () => {
      $(window).resize();
      resetView();
    });

    function setToolbarAnim(vars) {
      $("#toolbar").animate(vars, {
        // [Issue C0002] - Switch to using anime.js in future update
        step: setCanvasDimensions,
        duration: 500
      });
    }

    // Allow moving of cards around the card deck to sort section pieces
    $("#toolbar").sortable({
      // [Issue C0002] - Need alternative
      revert: false,
      stop: function(e, ui) {
        prepareCrossSection();
      },
      update: function(e, ui) {
        prepareCrossSection();
      },
      change: function(e, ui) {
        prepareCrossSection();
      }
    });

    // Allow the user to manually set the height of the cross section
    this.add("#textbox_heightoverride", "change", evt => {
      svgHeightAdjustment = Number(evt.target.value) * gs(1);
      prepareCrossSection();
    });

    // Allow the user to manually set the sky horizon elevation
    this.add("#raisesky", "change", () => {
      addUndoState();
      prepareCrossSection();
    });

    // Load a .csec file and then begin processing it with the loadSectionFile() command
    this.add("#input_loadfile", "change", evt => {
      loadSectionFile(evt.target.value);
    });
  } // end initialize
});

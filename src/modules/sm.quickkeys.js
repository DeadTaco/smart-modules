/* 
    SHORTCUT KEY ACTIONS
    
    CTRL, SHIFT, and ALT add a numeric value to specify if any of them need to be pressed for the action to be done.
    This is using specialKeyValues, where if ctrl + alt are pressed, then the key combo = 5 (ctrl = 1, alt = 4, combined together)
    0 = no special key
    1 = CTRL key only
    2 = ALT Key Only
    3 = CTRL + ALT
    4 = SHIFT only
    5 = SHIFT + CTRL
    6 = ALT + SHIFT
    7 = CTRL + ALT + SHIFT
    
*/
csecLib.showModuleInfo("sm.quickkeys.js", "Keyboard shortcuts typically connected to sm.actions.js");	
var specialKeyValues = [];
specialKeyValues.plain = 0;
specialKeyValues.ctrl = 1;
specialKeyValues.alt = 2;
specialKeyValues.shift = 4;

// Default Bindings
var keyAction = {};
/* ESC */       keyAction[27] = { 0 : "abort", 1 : "none", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* ArrowUp */   keyAction[38] = { 0 : "raise", 1 : "raiseglobal", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* ArrowDown */ keyAction[40] = { 0 : "lower", 1 : "lowerglobal", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* ArrowLeft */ keyAction[37] = { 0 : "matchleftslope", 1 : "none", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* ArrowRight */keyAction[39] = { 0 : "matchrightslope", 1 : "none", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* F1 */        keyAction[112] = { 0 : "help", 1 : "none", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* F2 */        keyAction[113] = { 0 : "togglecardview", 1 : "none", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* x */         keyAction[88] = { 0 : "none", 1 : "none", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* + */         keyAction[187] = { 0 : "zoomin", 1 : "zoomin", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* - */         keyAction[189] = { 0 : "zoomout", 1 : "zoomout", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* num + */     keyAction[107] = { 0 : "zoomin", 1 : "zoomin", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* num - */     keyAction[109] = { 0 : "zoomout", 1 : "zoomout", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* Backspace */ keyAction[8] = { 0 : "none", 1 : "none", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* c */         keyAction[67] = { 0 : "none", 1 : "copydata", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* v */         keyAction[86] = { 0 : "none", 1 : "pastedata", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* n */         keyAction[78] = { 0 : "none", 1 : "new", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* s */         keyAction[83] = { 0 : "none", 1 : "save", 2 : "none", 3 : "none", 4 : "none", 5 : "saveas", 6 : "none", 7 : "none" };
/* o */         keyAction[79] = { 0 : "none", 1 : "load", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* e */         keyAction[69] = { 0 : "none", 1 : "exportjpeg", 2 : "exportpdf", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* p */         keyAction[80] = { 0 : "none", 1 : "print", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* d */         keyAction[68] = { 0 : "none", 1 : "customdimensions", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* l */         keyAction[76] = { 0 : "addleader", 1 : "editleader", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* g */         keyAction[71] = { 0 : "togglegrid", 1 : "none", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* z */         keyAction[90] = { 0 : "none", 1 : "undo", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* y */         keyAction[89] = { 0 : "none", 1 : "redo", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* 1 */         keyAction[49] = { 0 : "template_carback", 1 : "template_largecarback", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" }; 
/* 2 */         keyAction[50] = { 0 : "template_carfront", 1 : "template_largecarfront", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* 3 */         keyAction[51] = { 0 : "template_pedestrian", 1 : "none", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/* 4 */         keyAction[52] = { 0 : "template_ls_singletree", 1 : "template_ls_full", 2 : "none", 3 : "none", 4 : "none", 5 : "template_ls_treeplants", 6 : "none", 7 : "template_ls_full" };
/* 5 */         keyAction[53] = { 0 : "none", 1 : "none", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/*   */         keyAction[00] = { 0 : "none", 1 : "none", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" };
/*   */         keyAction[00] = { 0 : "none", 1 : "none", 2 : "none", 3 : "none", 4 : "none", 5 : "none", 6 : "none", 7 : "none" }; //template


function setupQuickKeys() {
    $( "body" ).keydown(function(key) {
      // Make sure no action is taken if we are actively typing into an input box and allowWhileTyping is set to false
      if($(":focus").length > 0) {
          var curFocus = $(":focus")[0].type || "";
          // We're focused on some sort of input, so do not allow quick keys!
          if( curFocus.length > 0 ) {
              return;
          }
      }
      // Prevent CTRL + A from selecting everything in the DOM
      if ( key.which == 65 && key.ctrlKey ) {
         key.preventDefault();
      }
      doKeyAction(key);
    });
}

function doKeyAction(keyCode) {
    var modifier = 0;
    if(keyCode.ctrlKey) modifier += specialKeyValues.ctrl;
    if(keyCode.altKey) modifier += specialKeyValues.alt;
    if(keyCode.shiftKey) modifier += specialKeyValues.shift;
    var action = keyCode.which;
    if(keyAction[action]) {
        if(keyAction[action][modifier] == "none") { return;}    // No action was provided for this key, so simply return
        globalAction(keyAction[action][modifier], currentCard);
        
    }
}
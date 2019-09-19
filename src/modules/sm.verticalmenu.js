/* 
sm.verticalmenu.js

Controls the leftmost dropdown menu with extended section options

*/

SmartModule.fn.module("verticalMenu", {
    description : ["sm.verticalmenu.js", "Controls the leftmost dropdown menu with extended section options"],
    toggleMenu : function() {
        $("#verticalmenu").toggleClass("expanded");
        if( $("#verticalmenu").hasClass('expanded') ) { $(".ui-menu-outside").show(); $("#dropdownstate").text("Hide"); } else { $(".ui-menu-outside").hide(); $("#dropdownstate").text("Show"); }
    },
    hideMenu : function() {
        $("#verticalmenu").removeClass("expanded");
        $("#dropdownstate").text("Show");
    },
});
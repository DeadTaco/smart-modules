csecLib.showModuleInfo("sm.contextmenus.js", "Context menu control for right-clicking operations in both 2D and 3D");	

// Context Menus for SVG region
function addToContextMenus(elem) {
    $("svg").contextmenu({
        delegate: "[clickregion=1]",
        menu: [
                {title: "Object Templates", uiIcon: "ui-icon-image", children: [
                    {title: "Small Vehicle Rear", cmd: "template_carback"},
                    {title: "Small Vehicle Front", cmd: "template_carfront"},
                    {title: "Large Vehicle Rear", cmd: "template_largecarback"},
                    {title: "Large Vehicle Front", cmd: "template_largecarfront"},                    
                    {title: "----"},
                    {title: "Random Pedestrian", cmd: "template_pedestrian"},                
                    {title: "----"},

                    {title: "Regular Landscaping", children: [
                        {title: "Single Tree", cmd: "template_ls_singletree"},
                        {title: "Tree and Plants", cmd: "template_ls_treeplants"},
                        {title: "Light Plants", cmd: "template_ls_lightplants"},
                        {title: "Heavy Plants", cmd: "template_ls_heavyplants"},
                        {title: "Full Landscaping", cmd: "template_ls_full"},
                        {title: "Groundcover", cmd: "template_ls_groundcover"}
                    ]}, 
                    {title: "Desert Landscaping", children: [
                        {title: "Single Tree", cmd: "template_desert_singletree"},
                        {title: "Tree and Plants", cmd: "template_desert_treeplants"},
                        {title: "Plants", cmd: "template_desert_plants"},
                    ]},                    
                    {title: "Snowy Landscaping", children: [
                        {title: "Light Trees", cmd: "template_ls_snowy"},
                        {title: "Heavy Trees", cmd: "template_ls_snowybig"},
                        {title: "Talk to Devin if you need more"},

                    ]},    

                ]}, 
                {title: "Delete all Objects", cmd: "clearall", uiIcon: "ui-icon-trash"},
                {title: "----"},

                {title: "Match <b>Right</b> Elevation", cmd: "matchrightelevation", uiIcon: "ui-icon-arrowthickstop-1-s"},
                {title: "Match <b>Left</b> Elevation", cmd: "matchleftelevation", uiIcon: "ui-icon-arrowthickstop-1-s"},
                {title: "Match <b>Right</b> Elevation <b>with Slope</b>", cmd: "matchrightslope", uiIcon: "ui-icon-arrowthick-1-se"},
                {title: "Match <b>Left</b> Elevation <b>with Slope</b>", cmd: "matchleftslope", uiIcon: "ui-icon-arrowthick-1-sw"},            
                {title: "----"},
                {title: "Copy Section Data", cmd: "copydata", uiIcon: "ui-icon-copy"},
                {title: "Paste Section Data", cmd: "pastedata", uiIcon: "ui-icon-paste"},
                
                

            ],
        select: function(event, ui) {
            var t_index = $("#" + ui.target.attr("id")).attr("toolindex");
            
            jumpto(t_index);
            globalAction(ui.cmd, t_index);
        }
    });
}


// Context Menus for Tool/card area
function addCardToContextMenus(elem) {

    $("#toolbar").contextmenu({
        delegate: ".toolbox",
        menu: [
                {title: "Object Templates (2D View)", uiIcon: "ui-icon-image", children: [
                    {title: "Small Vehicle Rear", cmd: "template_carback"},
                    {title: "Small Vehicle Front", cmd: "template_carfront"},
                    {title: "Large Vehicle Rear", cmd: "template_largecarback"},
                    {title: "Large Vehicle Front", cmd: "template_largecarfront"},                    
                    {title: "----"},
                    {title: "Random Pedestrian", cmd: "template_pedestrian"},                
                    {title: "----"},

                    {title: "Regular Landscaping", children: [
                        {title: "Single Tree", cmd: "template_ls_singletree"},
                        {title: "Tree and Plants", cmd: "template_ls_treeplants"},
                        {title: "Light Plants", cmd: "template_ls_lightplants"},
                        {title: "Heavy Plants", cmd: "template_ls_heavyplants"},
                        {title: "Full Landscaping", cmd: "template_ls_full"},
                        {title: "Groundcover", cmd: "template_ls_groundcover"}
                    ]}, 
                    {title: "Desert Landscaping", children: [
                        {title: "Single Tree", cmd: "template_desert_singletree"},
                        {title: "Tree and Plants", cmd: "template_desert_treeplants"},
                        {title: "Plants", cmd: "template_desert_plants"},
                    ]},                    
                    {title: "Snowy Landscaping", children: [
                        {title: "Light Trees", cmd: "template_ls_snowy"},
                        {title: "Heavy Trees", cmd: "template_ls_snowybig"},
                        {title: "Talk to Devin if you need more"},

                    ]},    

                ]}, 
                {title: "Delete all Objects (2D View)", cmd: "clearall", uiIcon: "ui-icon-trash"},
                {title: "----"},

                {title: "Match <b>Right</b> Elevation", cmd: "matchrightelevation", uiIcon: "ui-icon-arrowthickstop-1-s"},
                {title: "Match <b>Left</b> Elevation", cmd: "matchleftelevation", uiIcon: "ui-icon-arrowthickstop-1-s"},
                {title: "Match <b>Right</b> Elevation <b>with Slope</b>", cmd: "matchrightslope", uiIcon: "ui-icon-arrowthick-1-se"},
                {title: "Match <b>Left</b> Elevation <b>with Slope</b>", cmd: "matchleftslope", uiIcon: "ui-icon-arrowthick-1-sw"},            
                {title: "----"},
                {title: "Copy Section Data", cmd: "copydata", uiIcon: "ui-icon-copy"},
                {title: "Paste Section Data", cmd: "pastedata", uiIcon: "ui-icon-paste"},
            ],
        select: function(event, ui) {
            var t_index = ui.target.attr("toolindex");
            if(!t_index) {
                t_index = ui.target.parent().attr("toolindex");
            }
            if(!t_index) {
                t_index = ui.target.parent().parent().attr("toolindex");
            }            
            console.log(t_index);
            jumpto(t_index);
            globalAction(ui.cmd, t_index);
        }
    });
}


// Context Menus for 3d
function defineContextMenu3d() {
    $("body").contextmenu({
        delegate: "#canvas",
        //trigger : "none",
        menu: [
                {title: "Lane Direction", uiIcon: "ui-icon-image", children: [
                    {title: "Reverse", cmd: "3d_lane3d_reverse"},
                    {title: "Bidirectional", cmd: "3d_lane3d_bidir"},
                ]}, 
                {title: "Striping", uiIcon: "ui-icon-image", children: [
                    {title: "White Dashed, Left", cmd: "3d_stripe_white_dashed_left"},
                    {title: "White Dashed, Right", cmd: "3d_stripe_white_dashed_right"},
                    {title: "White Solid, Left", cmd: "3d_stripe_white_solid_left"},
                    {title: "White Solid, Right", cmd: "3d_stripe_white_solid_right"},                    
                    {title: "----"},
                    {title: "Yellow Dashed, Left", cmd: "3d_stripe_yellow_dashed_left"},
                    {title: "Yellow Dashed, Right", cmd: "3d_stripe_yellow_dashed_right"},
                    {title: "Yellow Solid, Left", cmd: "3d_stripe_yellow_solid_left"},
                    {title: "Yellow Solid, Right", cmd: "3d_stripe_yellow_solid_right"},                
                    {title: "----"},
                    {title: "Bike Lane Marking", cmd: "3d_stripe_bikelane"},
                    {title: "Turn Marking Left", cmd: "3d_stripe_turnleft"},
                    {title: "Turn Marking Right", cmd: "3d_stripe_turnright"},
                    {title: "Turn Marking Straight", cmd: "3d_stripe_straight"},     
                    {title: "----"},
                    {title: "Remove all Striping", cmd: "3d_stripe_removeall", uiIcon: "ui-icon-trash"},   

                ]},             
                {title: "Object Templates 3D", uiIcon: "ui-icon-image", children: [
                    {title: "Small Vehicle", cmd: "3d_carsmall"},
                    {title: "Large Vehicle", cmd: "3d_carbig"},
                    {title: "----"},
                    {title: "Random Pedestrian", cmd: "3d_pedestrian"},                
                    {title: "----"},

                    {title: "Regular Landscaping", children: [
                        {title: "Single Tree", cmd: "template_ls_singletree"},
                        {title: "Tree and Plants", cmd: "template_ls_treeplants"},
                        {title: "Light Plants", cmd: "template_ls_lightplants"},
                        {title: "Heavy Plants", cmd: "template_ls_heavyplants"},
                        {title: "Full Landscaping", cmd: "template_ls_full"},
                        {title: "Groundcover", cmd: "template_ls_groundcover"}
                    ]}, 
                    {title: "Desert Landscaping", children: [
                        {title: "Single Tree", cmd: "template_desert_singletree"},
                        {title: "Tree and Plants", cmd: "template_desert_treeplants"},
                        {title: "Plants", cmd: "template_desert_plants"},
                    ]},                    
                    {title: "Snowy Landscaping", children: [
                        {title: "Light Trees", cmd: "template_ls_snowy"},
                        {title: "Heavy Trees", cmd: "template_ls_snowybig"},
                        {title: "Talk to Devin if you need more"},

                    ]},    

                ]}, 

                {title: "----"},
                {title: "Delete all Objects", cmd: "clearall", uiIcon: "ui-icon-trash"},
                {title: "----"},

                {title: "Match <b>Right</b> Elevation", cmd: "matchrightelevation", uiIcon: "ui-icon-arrowthickstop-1-s"},
                {title: "Match <b>Left</b> Elevation", cmd: "matchleftelevation", uiIcon: "ui-icon-arrowthickstop-1-s"},
                {title: "Match <b>Right</b> Elevation <b>with Slope</b>", cmd: "matchrightslope", uiIcon: "ui-icon-arrowthick-1-se"},
                {title: "Match <b>Left</b> Elevation <b>with Slope</b>", cmd: "matchleftslope", uiIcon: "ui-icon-arrowthick-1-sw"},            
                {title: "----"},
                {title: "Copy Section Data", cmd: "copydata", uiIcon: "ui-icon-copy"},
                {title: "Paste Section Data", cmd: "pastedata", uiIcon: "ui-icon-paste"},
                
                

            ],
        select: function(event, ui) {
            var t_index = $("#" + ui.target.attr("id")).attr("toolindex");
            
            jumpto(t_index);
            globalAction(ui.cmd, t_index);
        }
    });
}
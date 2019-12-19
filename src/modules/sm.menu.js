"use strict";
SmartModule.addModule("menu", ( 
    {
        description : ["sm.menu.js", "Classic Window Menus"],
        requires : [],
        version : "1.0",
        createMenu(menuElements, container) {
            // Get container object
            if(typeof container == "string") {
                container = document.querySelector(container);
            }            
            container = container || document.body;

            // Create menu bar horizontal div
            let menuBar = null;
            if(!container.querySelector(".sm-menu")) {
                menuBar = document.createElement("div");
                menuBar.classList.add("sm-menu");
                container.append(menuBar);
            } else {
                menuBar = container.querySelector(".sm-menu");
            }
 
            buildMenu(menuElements, true);
            
            // Build the menu elements by traversing the menu tree
            function buildMenu(menu, isRoot, parent) {
                parent = parent || menuBar;
                let menuGroupDiv = document.createElement("div");
                menuGroupDiv.classList.add("sm-menu-group");
                if(isRoot) menuGroupDiv.classList.add("sm-menu-root");     // Root menu items are styled differently than their sub menus.   
                parent.append(menuGroupDiv);        
                menu.map(menuItem => {
                    let menuDiv = document.createElement("div");
                    menuDiv.classList.add("sm-menu-item");
                    menuDiv.innerHTML = "<span>" + menuItem.title + "</span>";
                    menuGroupDiv.append(menuDiv);
                    menuDiv.addEventListener("click", e=>{
                        e.stopPropagation();
                        menuItem.action(e);
                    });
                    let lastSubMenu = null;

                    menuDiv.addEventListener("mouseenter", e=>{

                    });                    
                    if(menuItem.submenu) {
                        let newMenu = buildMenu(menuItem.submenu, false, menuDiv);
                        // menuDiv.addEventListener("click", e=>showSubMenu(newMenu, e.target));
                        menuDiv.addEventListener("mouseenter", e=>{
                            // do something
                        });
                        if(isRoot) { menuDiv.classList.add("sm-menu-rootitem"); } else { menuDiv.classList.add("sm-menu-haschildren"); }
                        // menuDiv.addEventListener("mouseleave", ()=>hideSubMenu(newMenu));
 
                    };
                });
                return menuGroupDiv;
            }

        },
     }
));
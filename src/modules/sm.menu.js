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
            menuBar.classList.add("inactive");
            buildMenu(menuElements, true);
            
            // Build the menu elements by traversing the menu tree
            function buildMenu(menu, isRoot, parent) {
                parent = parent || menuBar;
                let menuGroupDiv = document.createElement("div");
                menuGroupDiv.classList.add("sm-menu-group");
                if(isRoot) menuGroupDiv.classList.add("sm-menu-root");     // Root menu items are styled differently than their sub menus.   
                parent.append(menuGroupDiv);        
                menu.map(menuItem => {
                    let menuDiv = null;
                    if(typeof menuItem == "string") {
                        menuDiv = document.createElement("hr");
                        
                    } else {
                        menuDiv = document.createElement("div");
                        menuDiv.classList.add("sm-menu-item");
                        menuDiv.innerHTML = "<span>" + menuItem.title + "</span>";
                        menuDiv.addEventListener("click", e=>{
                            if( menuBar.classList.contains("inactive") ) {
                                menuBar.classList.remove("inactive");
                            } else {
                                menuBar.classList.add("inactive");
                            }
                            e.stopPropagation();
                            menuItem.action(e);
                        });
                    }
                    menuGroupDiv.append(menuDiv);
               
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

            menuBar.addEventListener("click", ()=>{
                if( menuBar.classList.contains("inactive") ) {
                    menuBar.classList.remove("inactive");
                } else {
                    menuBar.classList.add("inactive");
                }
            });

            return menuBar;
        },
     }
));
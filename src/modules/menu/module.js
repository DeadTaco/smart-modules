"use strict";
SmartModule.addModule("menu", ( 
    {
        description : ["menu", "Classic window dropdown menus"],
        requires : [],
        version : "0.1",
        initialize() {
            // Load the menu.css style sheet
            let link = document.createElement("link");
            link.rel = "stylesheet";
            link.href=SmartModule.rootPath + "modules/menu/menu.css";
            document.querySelector("head").append(link);
        },
        // Create a full menu system with sub menus and actions
        createMenu(menuElements, container) {
            
            // MenuNode contains all of the elements for a menu group and its child nodes (sub menus)
            let MenuNode = function() {
                this.name = "root_node";
                this.subMenus = [];
                this.isRoot = false; // By default, we don't want this node to be a root node unless specifically set as such
            }
            // Retrieves a node based on its path, separated by slashes, i.e. file/saveas/text finds the node in the path file -> saveas -> text
            MenuNode.prototype.getNodeByPath = function(nodePath) {
                nodePath = nodePath.toLowerCase();
                let nodes = nodePath.split("/");
                let thisNode = this;
                let foundNode = false;
                for(let i = 0; i < nodes.length; i++) {
                    foundNode = thisNode.getNodeByName(nodes[i]);
                    if(foundNode) {
                        thisNode = foundNode;
                    }
                }
                return foundNode;
            }
            MenuNode.prototype.getNodeByName = function(name) {
                name = name.toLowerCase();
                let nodes = this.subMenus;
                for(let i = 0; i < nodes.length; i++) {
                    if(this.subMenus[i].name.toLowerCase() == name)  return this.subMenus[i];
                }
                return false;
            }

            // Add a sub-menu item to an existing item
            MenuNode.prototype.addItem = function(itemData) {
                let parentNode = this; 
                let parentDom = this.domElement;
                let isRoot = this.isRoot;
                if(isRoot) {
                    this.domElement = this.domElement.parentElement;
                }
                let menuGroupDiv = null;
                if(!this.domElement.querySelector(".sm-menu-group")) {
                    menuGroupDiv = document.createElement("div");
                    menuGroupDiv.classList.add("sm-menu-group");
                    this.domElement.append(menuGroupDiv);
                    if(!this.domElement.classList.contains("sm-menu-rootitem")) this.domElement.classList.add("sm-menu-haschildren");
                } else {
                    menuGroupDiv = this.domElement.querySelector(".sm-menu-group");
                }
                let newMenuNode = addMenuNode(itemData, menuGroupDiv, parentNode, parentDom, isRoot);
                return newMenuNode;
            }

            let rootMenuNode = new MenuNode();
            rootMenuNode.isRoot = true;     // Start with root nodes
            
            
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
            let _rootMenuElement = buildMenu(menuElements, true);
            
            // Build the menu elements by traversing the menu tree
            function buildMenu(menu, isRoot, parentDom, parentNode) {
                parentNode = parentNode || rootMenuNode;
                parentDom = parentDom || menuBar;

                let menuGroupDiv = document.createElement("div");
                menuGroupDiv.classList.add("sm-menu-group");
                // Root menu items are styled differently than their sub menus.  
                if(isRoot) menuGroupDiv.classList.add("sm-menu-root");      
                parentDom.append(menuGroupDiv);
                menu.map(menuItem => {
                    addMenuNode(menuItem, menuGroupDiv, parentNode, parentDom, isRoot);
                });
                return menuGroupDiv;
            }

            // Adds a menu item to a menu group element
            function addMenuNode(menuItem, menuGroupDiv, parentNode, parentDom, isRoot) {
                let menuNode = new MenuNode();
                menuNode.parentNode = parentNode;                    
                let menuDiv = null;
                let divider = false;
                if(typeof menuItem == "string") {
                    menuDiv = document.createElement("hr"); // Horizontal line element
                    menuNode.name = "__divider__";
                    divider = true;
                } else {
                    menuDiv = document.createElement("div");
                    menuDiv.classList.add("sm-menu-item");
                    menuDiv.innerHTML = "<span>" + menuItem.title + "</span>";
                    menuNode.name = menuItem.title;
                    menuDiv.addEventListener("click", e=>{
                        if( menuBar.classList.contains("inactive") ) {
                            menuBar.classList.remove("inactive");
                        } else {
                            menuBar.classList.add("inactive");
                        }
                        e.stopPropagation();
                        if(menuItem.action) menuItem.action(e);
                    });
                }
                menuGroupDiv.append(menuDiv);
                menuNode.domElement = menuDiv;
                menuNode.parentDom = parentDom;
                menuNode.subMenus = [];
                if(parentNode) parentNode.subMenus.push(menuNode);
                if(menuItem.submenu) {
                    buildMenu(menuItem.submenu, false, menuDiv, menuNode);
                    if(isRoot) { menuDiv.classList.add("sm-menu-rootitem"); } else { menuDiv.classList.add("sm-menu-haschildren"); }
                };
                if(isRoot) { menuDiv.classList.add("sm-menu-rootitem"); }
                if(divider) { return "divider"; } else { return menuNode; }
            }

            // Make the menu bar become active when clicked
            menuBar.addEventListener("click", ()=>{
                if( menuBar.classList.contains("inactive") ) {
                    menuBar.classList.remove("inactive");
                } else {
                    menuBar.classList.add("inactive");
                }
            });
            rootMenuNode.domElement = _rootMenuElement;
            return rootMenuNode;
        },
     }
));
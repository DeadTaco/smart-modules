/* 

These functions require jQuery and Babylon3d to be pre-loaded.  Sorry about the requirement for jQuery, but I needed some rapid prototyping
and it was quicker to use what's available rather than reinvent the wheel.

* UV Texturing while maintaining aspect ratio:  I created an example here:  https://www.babylonjs-playground.com/#7BRWJ2#2
* Screen space reflections example: https://www.babylonjs-playground.com/#PHNEX   https://www.babylonjs-playground.com/#1YAIO7#5
    - Blur: https://www.babylonjs-playground.com/#1HECPU#33
* Shadow casting Problems discussion: http://www.html5gamedevs.com/topic/33187-shadows-still-apears-when-object-is-under-the-ground/
* Trying to fix shaders on ditches:  https://www.babylonjs-playground.com/#TF811Y#6
* Explaining vertices, indices, and facets: https://www.babylonjs-playground.com/#1UHFAP#67
* Optimizing meshes and Auto LOD : https://doc.babylonjs.com/how_to/in-browser_mesh_simplification
* Optimizing textures for low performance systems via scaling:  http://www.html5gamedevs.com/topic/13395-babylonsceneoptimizer-improving-render-quality/
* Tree generator with source: https://www.babylonjs-playground.com/#1LXNS9

```
Call a function on every loop of a material draw
section3d.mirrorPlane.onAfterRenderObservable.add(() => {
        ... do actions here ...
})
```

*/

// Begin SmartModule.fn.module section3d Definition

(function(){
let SECTION3D = {};

let section3d = {}; // [Issue C0004] Add the section3d stuff into the cross section API.  This needs to become native to the API in the future!

SECTION3D.defaults = {
    initialized: false, // Tells the app that the 3d engine is ready to go
    enabled: true,      // If enabled == false, the canvas won't be updated
    clickableObjects: [], // Array of clickable objects in the scene
    fov: 75,            // Field of view in degrees
    groundPlaneThickness: 4, // Thickness of the DIRT ground plane, not the reflective base surface
    objects: [],        // Array of all objects in the scene for cleanup
    sectionLength: 200, // section length along z axis, 140 default
    spriteGroup: [],    // Array of sprites
    faceMeGroup: [],    // Array of face-me (billboard) objects
    lastModelLoaded: null, // Gets the last object loaded from a file
    lastObjectMouseOver: null, // The last object the mouse was over
    activeCard: null,   // The last card that was clicked
    materialLibrary: {}, // 3D Material library
    decalLibrary: {},   // Library of decals
    skyboxLibrary : {},  // Library of skyboxes
    paintLibrary: {},   // Library of paint colors for cars
    shaderLibrary: {},  // Available shaders
    materialsLoading: 0, // How many materials are in the loading queue
    modelsLoading: 0,   // How many 3d models are in the loading queue
    modelLibrary : {},   // All object files loaded into memory
    globalScale: 0.3048,     // Globally scale all elements by this amount (metric to feet)
    activeGroup: {},    // The active group we're currently working with
    skyRotation : 0.01,  // How fast the sky rotates
    showFPS : false,    // Show Frames Per Second
    coordinates: {
        x: 0,
        y: 0
    },                  // Current coordinates (draw point) for new objects
    edge: {},           // Line Constants for selecting specific box edges for manipulation
    selectionBox: [],   // The red section selection box - Multiple decals applied to multiple meshes on the model segment, so an array
    segments: {},       // A list of segments by their ID so they can be looked up quickly by their id (contains mesh objects)
    segmentData: {},    // The data for each segment ID, for saving and loading files as well as undo/redo
    skybox : {},         // Skybox object
    renderQuality : 3,   // Render quality, 4 is max.  3 is without grass rendering
    edge : {            // Edge vertices - Returns the vertices that make up that edge in a box, mainly for adding slopes to surface boxes
        TOPLEFT: [2, 5],
        TOPRIGHT: [3, 4],
        BOTTOMLEFT: [1, 6],
        BOTTOMRIGHT: [0, 7]
    },
    decalMaterials : {
            stripe_solid_yellow: "stripe_yellow.jpg",       // Not to be confused with decalLibrary, this is just a list of textures we want to preload for decal use
            stripe_solid_white: "stripe_white.jpg"
    },
    defaultCardData : {                                     // Blank, default 3D info for segments without 3d data.  For variable defining to prevent errors later
        direction : 1,
        props : [],
        striping : []
    },
}

SECTION3D.applyDefaults = function() {
    section3d = {};
    section3d = {...section3d, ...SECTION3D.defaults };
}

SECTION3D.applyDefaults();  // We may need to completely restart the 3d engine when switching between 2d and 3d modes



// Pausing and resuming
section3d.unpause = function() { this.enabled = true; this.scene.render(); };
section3d.pause = function() { this.enabled = false; };

section3d.meshQueue = {           // Number of meshes being processed at this time.  Increases when a mesh begins generation.  Decreases when mesh is rendered.
    mCount : 0,
    get count() {
        return this.mCount;
    },
    set count (num) {
        this.mCount = num;
        if(num <= 0) {
            this.mCount = 0;
            console.log("Done Generating Section");
            // section3d.addAllStriping();
        }
    }
}   

// Initialize the 3D Engine
section3d.init = function () {
    if ($("#canvas").length > 0) {
        console.log("Canvas already exists.  Skipping canvas creation.");
        return true;
    } // See if a 3d canvas exists or not.  If it does, we're already initialized!
    
    if( $("#fps").length == 0) {
        var fps = $("<div id='fps'>");
        $("body").append(fps);
        fps.css({
            "z-index":10000,
            width:"150px",
            height:"35px",
            color:"lime",
            "background-color":"black",
            position:"absolute",
            "font-family" : "sans-serif",
            "font-size" : "0.75em",
            left : "10px",
            top : $("#toolbar").offset().top,
            padding:"5px"
        });
        fps.hide();
    }    

    var _self = this;
    
    this.$canvas = $("<canvas id='canvas'>");
    $("body").append(this.$canvas);
    this.canvas = this.$canvas[0];
    
    // Mouse interactivity
    this.$canvas.click(function (e, t) {
        mouseEvents(e, t);
    }); 
    
    // Context Menu (from sm.contextmenus.js)
    defineContextMenu3d();
    
    // Apply global scaling to specific items
    this.groundPlaneThickness = this.groundPlaneThickness  * this.globalScale;
    this.sectionLength = this.sectionLength  * this.globalScale;
    
    // ---------------------- Babylon.js init -------------------------------

    var antiAlias = true;
    var adaptToDeviceRatio = true;
    var engineOptions = {

    }
    var engine = new BABYLON.Engine(this.canvas, antiAlias, engineOptions, adaptToDeviceRatio); // Generate the BABYLON 3D engine
    engine.renderEvenInBackground = false;
    
    
    
    var scene = new BABYLON.Scene(engine);
    this.scene = scene; // Make public
    this.engine = engine; // Make public
    defineMaterials(); // Create material library
    
    // Create an assets manager to manage loading of assets
    var assetsManager = new BABYLON.AssetsManager(scene);
    this.assetsManager = assetsManager;
    
    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", -40 * Math.PI / 180, 45 * Math.PI / 180, 150, new BABYLON.Vector3(0, 10, -10), this.scene);
    camera.attachControl(this.canvas, true);
    camera.panningSensibility = 100;
    camera.fov = this.fov / 100;
    camera.setTarget(new BABYLON.Vector3(12.17, -2.38, -6.93));
    camera.setPosition(new BABYLON.Vector3(11.17, 8.65, -37.13));
    camera.wheelPrecision = 5 / this.globalScale;
    camera.upperBetaLimit = 1.5; // Prevent going upside-down with rotation
    // Delete camera inputs for arrow keys since we use them for the quick keys in the section maker
    var input = camera.inputs.attached;
    camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
    input.keyboard.keysDown = [null];
    input.keyboard.keysUp = [null];
    input.keyboard.keysLeft = [null];
    input.keyboard.keysRight = [null];
    camera._panningMouseButton = 1; // Middle mouse Panning
    this.camera = camera;
    
    // Switch pan and rotate mouse buttons so we can have a right-click context menu
    input.pointers.buttons[2] = null; // Disable right-click panning
    
    
    // Add right-click context menu (requires sm.contextmenus.js to build the menu!)
    // Buttons: -1 = Any button while dragging, 0 = Left, 1 = middle, 2 = right
    
    scene.onPointerObservable.add( function(info) {
        if(info.event.pressure > 0 && info.event.button != -1) {
            var button = info.event.button;
            if(button == 2) {
                // Middle Mouse click handled via context menu event handler.  You can add more stuff here in the future for more events ... //
            }
            if(button == 0) {
                $("body").contextmenu("close");
                // Middle Mouse click handled via context menu event handler.  You can add more stuff here in the future for more events ... //
            }            
        }
    });

    // Add lights to the scene
    var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(1, -1, 1), scene);
    light.intensity = 3;
    light.shadowMinZ = 30;
    light.shadowMaxZ = 180;
    light.position = new BABYLON.Vector3(0,100,0);
    
    var ambientLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(1, 1, 1), scene);
    ambientLight.intensity = 1;
    this.light = light;
    this.ambientLight = ambientLight;
    
    // Shadows
    var shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
    //shadowGenerator.useBlurExponentialShadowMap = true;
    //shadowGenerator.usePoissonSampling = true
    shadowGenerator.useContactHardeningShadow = true;
    shadowGenerator.bias = 0.01;
    shadowGenerator.normalBias = 0.05;
    shadowGenerator.contactHardeningLightSizeUVRatio = 0.08;
    //shadowGenerator.forceBackFacesOnly = true;
    this.shadowGenerator = shadowGenerator;    
    
    // Generate a reflective ground
    var ground = this.generateReflectiveGround();
    this.ground = ground;   
    
    // Add a sky box
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
    skybox.material = this.skyboxLibrary["skybox"];
    this.addToScreenSpaceReflections(skybox);
    this.skybox = skybox;    
    
    // Add a helper gizmo for showing x y z directions
    addDirectionGizmo(); // Create a gizmo that shows left/right/up/down directions

    // Register a render loop to repeatedly render the scene
    this.engine.runRenderLoop(function () {
        if(section3d.showFPS == true) {
            fps.text( Math.round(engine.getFps()));
        }
        if(!_self.enabled) return false;
        _self.deltaTime = _self.engine.getDeltaTime(); // for other render phase counters, see https://doc.babylonjs.com/api/classes/babylon.sceneinstrumentation#scene
        if(_self.skybox) _self.skybox.rotation.y += _self.skyRotation * (_self.deltaTime / 1000);
        _self.scene.render();
        if (_self.initialized == false) {
            _self.initialized = true;
            csecLib.startup();
        } // Let's us know the 3d scene is successfully initialized and ready to work with
    });
    
   // section3d.showFps();

    // Controls Mouse Interactivity
    function mouseEvents(e, t) {
        var pickResult = _self.scene.pick(_self.scene.pointerX, _self.scene.pointerY);
        var hitLoc = {};
        if (pickResult.hit && !devlib.util.contains(pickResult.pickedMesh.name, "gizmo")) {
            hitLoc.x = pickResult.pickedPoint.x;
            hitLoc.y = pickResult.pickedPoint.y;
            hitLoc.z = pickResult.pickedPoint.z;
            _self.helperGizmo.position.x = hitLoc.x;
            _self.helperGizmo.position.y = hitLoc.y;
            _self.helperGizmo.position.z = hitLoc.z;
            window.hit = pickResult;
        
            if (pickResult.pickedMesh.parent) {
                window.hitMesh = pickResult.pickedMesh;
                highlightMesh(pickResult.pickedMesh.parent);
                jumpto(pickResult.pickedMesh.parent.id); // Highlight the card for the clicked segment
                _self.activeCard = pickResult.pickedMesh.parent.id || false;
            } else {
                section3d.clearSelection();
            }
        } else {
            section3d.clearSelection();
        }

    }

    // Highlight all submeshes of a mesh with a decal, mainly for the selection decal
    function highlightMesh(parentMesh) {

        var meshes = parentMesh.getChildMeshes();
        if (meshes.length < 1) {
            console.log("No child meshes.");
            return false;
        }
        var thisDecal;

        // Delete old decal first
        _self.clearSelection();

        // Generate new decals
        meshes.forEach(function (mesh, index) {
            thisDecal = new BABYLON.MeshBuilder.CreateDecal("selectionbox", mesh, {
                position: new BABYLON.Vector3(mesh.xpos, 10, 0),
                size: new BABYLON.Vector3(500, 500, _self.sectionLength),
                angle: Math.PI / 2
            }, _self.scene);
            thisDecal.material = _self.decalLibrary.selectionbox;
            thisDecal.showBoundingBox = false; // For debugging
            _self.selectionBox.push(thisDecal);
        });
    }

    this.highlightMesh = highlightMesh;

    // Define Materials AND decals -- All are currently forced to PBR materials, but that will change down the road and rely on the definitions
    function defineMaterials() {
        var matDef = _self.materialDefinitions;
        
        for (var key in matDef) {
            // PBR Material Setup
            if(matDef[key].type == "pbr") {
                var material = new BABYLON.PBRMaterial(matDef[key], scene);
                if(matDef[key].diffuse) {
                    material.albedoTexture = new BABYLON.Texture('3d/textures/' + matDef[key].diffuse, scene);
                    material.albedoTexture.uScale = matDef[key].scale.u / _self.globalScale;
                    material.albedoTexture.vScale = matDef[key].scale.v / _self.globalScale;
                }
                if(matDef[key].color) {
                    material.albedoColor = new BABYLON.Color3(matDef[key].color[0], matDef[key].color[1], matDef[key].color[2]);
                }
                material.metallic = matDef[key].metallic || 0.1;
                material.roughness = matDef[key].roughness || 0.8;
            }
            // Standard Material Setup
            if(matDef[key].type == "standard") {
                var material = new BABYLON.StandardMaterial(matDef[key], scene);
                if(matDef[key].diffuse) {
                    material.diffuseTexture = new BABYLON.Texture('3d/textures/' + matDef[key].diffuse, scene);
                    material.diffuseTexture.uScale = matDef[key].scale.u / _self.globalScale;;
                    material.diffuseTexture.vScale = matDef[key].scale.v / _self.globalScale;;
                }
        
                if(matDef[key].color) {
                    material.diffuseColor = new BABYLON.Color3(matDef[key].color[0], matDef[key].color[1], matDef[key].color[2]);
                }
                material.specularPower = matDef[key].glossiness || 10;
                var roughness = 1 - matDef[key].roughness;
                material.specularColor = new BABYLON.Color3(roughness, roughness, roughness);
                if(matDef[key].specularColor) {
                    material.specularColor = new BABYLON.Color3(matDef[key].specularColor[0], matDef[key].specularColor[1], matDef[key].specularColor[2]);
                }
            }            
            
            // Global material values
            if(matDef[key].bump) {
                material.bumpTexture = new BABYLON.Texture('3d/textures/' + matDef[key].bump, scene); // Locate the normal map for this texture
                material.bumpTexture.uScale = matDef[key].scale.u / _self.globalScale;;
                material.bumpTexture.vScale = matDef[key].scale.v / _self.globalScale;;
            }
            if(matDef[key].height) {
                material.useParallax = true;
            }                
            
            _self.materialLibrary[key] = material;
        }

        /*
        if(_self.renderQuality > 3) {
            for (var key in patternDefinitions) {
                if(key == "grass1") continue;
                var material = new BABYLON.PBRMaterial(patternDefinitions[key], scene);
                material.albedoTexture = new BABYLON.Texture('3d/textures/ground/' + patternDefinitions[key].filename, scene);
                material.albedoTexture.uScale = 0.05;
                material.albedoTexture.vScale = 0.05;
                material.ambientTexture = new BABYLON.Texture('3d/textures/ground/' + patternDefinitions[key].filename, scene);
                material.ambientTexture.uScale = 0.05;
                material.ambientTexture.vScale = 0.05;                
                material.bumpTexture = new BABYLON.Texture('3d/textures/ground/' + devlib.fileSystem.getFileSurname(patternDefinitions["asphalt"].filename) + "_NORMAL." + devlib.fileSystem.getFileExtension(patternDefinitions["asphalt"].filename), scene); // Locate the normal map for this texture
                material.bumpTexture.uScale = 0.05;
                material.bumpTexture.vScale = 0.05;            
                material.metallic = 0;
                material.roughness = 0.75;
                _self.materialLibrary[key] = material;
            }            
        }
        */
        // Enhanced renderers for higher render quality
        var grassEnhanced = new BABYLON.FurMaterial("grassEnhanced", _self.scene);
        grassEnhanced.furLength = 0;
        grassEnhanced.furAngle = 0;
        grassEnhanced.furColor = new BABYLON.Color3(1.45, 1.75, 0.25);
        grassEnhanced.diffuseTexture = _self.materialLibrary.grass1.albedoTexture ||  _self.materialLibrary.grass1.diffuseTexture;
        grassEnhanced.furTexture = BABYLON.FurMaterial.GenerateTexture("furTexture", scene);
        grassEnhanced.furSpacing = 0.25 * _self.globalScale;       // This is actually the height
        grassEnhanced.furDensity = 5 /  _self.globalScale;          // Blade size and density, bigger = smaller blades, denser grass
        grassEnhanced.furSpeed = 1000;         // Bigger is slower
        grassEnhanced.furGravity = new BABYLON.Vector3(0, -0.1, 0);            
        _self.materialLibrary.grassEnhanced = grassEnhanced;
        

        // Add some basic colors to the material library
        var material = new BABYLON.StandardMaterial("red", scene);
        material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        _self.materialLibrary["red"] = material;
        var material = new BABYLON.StandardMaterial("green", scene);
        material.diffuseColor = new BABYLON.Color3(0, 1, 0);
        _self.materialLibrary["green"] = material;
        var material = new BABYLON.StandardMaterial("blue", scene);
        material.diffuseColor = new BABYLON.Color3(0, 0, 1);
        _self.materialLibrary["blue"] = material;
        var material = new BABYLON.StandardMaterial("reflective", scene);
        material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        _self.materialLibrary["reflective"] = material;        

        // Decals
        for (var key in _self.decalMaterials) {
            var material = new BABYLON.StandardMaterial(_self.decalMaterials[key], scene);
            material.diffuseTexture = new BABYLON.Texture('sprites/' + _self.decalMaterials[key], scene);
            material.diffuseTexture.uScale = 1 / _self.globalScale;;
            material.diffuseTexture.vScale = 100 / _self.globalScale;;
            material.diffuseTexture.hasAlpha = false;
            material.zOffset = -0.1 / _self.globalScale;;
            _self.decalLibrary[key] = material;
        }

        // Selection box material
        var material = new BABYLON.StandardMaterial("selectionbox", scene);
        material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        material.zOffset = -2 / _self.globalScale;
        _self.decalLibrary.selectionbox = material;
        _self.decalLibrary.selectionbox.alpha = 0.5;
        _self.decalLibrary.selectionbox.alphaMode = 1;
        
        // Skybox materials
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("3d/textures/skybox/skybox", _self.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0); 
        _self.skyboxLibrary["skybox"] = skyboxMaterial;

    }
    
    function addDirectionGizmo() {
        _self.helperGizmo = new BABYLON.Mesh.CreateBox("gizmo", 0.1, _self.scene);
        _self.helperGizmo.isVisible = false; // Hide the parent mesh.  This will NOT hide its child meshes
        var gizmoX = BABYLON.MeshBuilder.CreateBox("gizmo_x", {
            height: 0.25,
            width: 0.25,
            depth: 10,
        }, _self.scene);
        gizmoX.material = _self.materialLibrary["green"];
        gizmoX.castShadows = true;
        var gizmoY = BABYLON.MeshBuilder.CreateBox("gizmo_y", {
            height: 10,
            width: 0.25,
            depth: 0.25,
        }, _self.scene);
        gizmoY.material = _self.materialLibrary["blue"];

        var gizmoZ = BABYLON.MeshBuilder.CreateBox("gizmo_z", {
            height: 0.25,
            width: 10,
            depth: 0.25,
        }, _self.scene);
        gizmoZ.material = _self.materialLibrary["red"];

        gizmoX.parent = _self.helperGizmo;
        gizmoY.parent = _self.helperGizmo;
        gizmoZ.parent = _self.helperGizmo;
        _self.helperGizmo.position.y = 10 * _self.globalScale;
        _self.helperGizmo.scaling = new BABYLON.Vector3(0.5 * _self.globalScale,0.5 * _self.globalScale,0.5 * _self.globalScale);
        _self.shadowGenerator.addShadowCaster(gizmoX, true);
        _self.shadowGenerator.addShadowCaster(gizmoY, true);
        _self.shadowGenerator.addShadowCaster(gizmoZ, true);
        _self.shadowGenerator.addShadowCaster(_self.helperGizmo, true);
    }

}


// Highlight the given segment per the card that was clicked
section3d.jumpToSegment = function (toolid) {
    var mesh = this.getMeshById(toolid);
    this.highlightMesh(mesh);
}

// Delete selection decals
section3d.clearSelection = function () {
    if (this.selectionBox.length > 0) {
        this.selectionBox.forEach(function (item) {
            item.dispose();
        })
    }
}

// Get a mesh based on its ID
section3d.getMeshById = function (id) {
    return this.segments[id];
}

section3d.resize = function () {
    if (!this.initialized) return false;
    this.$canvas.css({
        "z-index": 10,
        "position": "absolute",
        "border": "1px solid black",
        "background-color": "white"
    });
    this.$canvas.width($("#zoomwindow").width());
    this.$canvas.height($("#zoomwindow").height() - 5);
    this.engine.resize();
}



// Moves a specific vertex in a mesh to position
section3d.moveVertex = function (mesh, vertexNumber, position) {
    var positions = mesh.vertexData || mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var numberOfVertices = positions.length / 3;
    var sharedVertices = this.getSharedVertices(mesh, vertexNumber); // Get all vertices that share the same location as this one.  Includes source vertex in the result.

    if (vertexNumber > numberOfVertices - 1) return false;
    for (var i = 0; i < sharedVertices.length; i++) {
        positions[sharedVertices[i] * 3] = position[0];
        positions[sharedVertices[i] * 3 + 1] = position[1];
        positions[sharedVertices[i] * 3 + 2] = position[2];
    }
    mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
}

// Shift a specific vertex in a mesh by [position]
section3d.shiftVertex = function (mesh, vertexNumber, position) {
    var positions = mesh.vertexData || mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var numberOfVertices = positions.length / 3;
    var sharedVertices = this.getSharedVertices(mesh, vertexNumber); // Get all vertices that share the same location as this one.  Includes source vertex in the result.

    if (vertexNumber > numberOfVertices - 1) return false;
    for (var i = 0; i < sharedVertices.length; i++) {
        positions[sharedVertices[i] * 3] += position[0];
        positions[sharedVertices[i] * 3 + 1] += position[1];
        positions[sharedVertices[i] * 3 + 2] += position[2];
    }
    mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
}

// Return a list of all vertices that share the location of the given vertex.  Includes source vertex in the result.
section3d.getSharedVertices = function (mesh, vertexNumber) {
    var positions = mesh.vertexData || mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var numberOfVertices = positions.length / 3;
    var matchWith = [];
    var matchAgainst = [];
    var matchingVertices = [];
    if (vertexNumber > numberOfVertices - 1) return false;
    // Split the vertex into x,y,z
    matchWith[0] = positions[vertexNumber * 3];
    matchWith[1] = positions[vertexNumber * 3 + 1];
    matchWith[2] = positions[vertexNumber * 3 + 2];

    for (var i = 0; i < numberOfVertices; i++) {
        matchAgainst = [positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]];
        if (matchWith.join() == matchAgainst.join()) matchingVertices.push(i);
    }

    return matchingVertices;

}

// Get a specific vertex position
section3d.GetVertexPosition = function (mesh, vertexNumber) {
    var positions = mesh.vertexData || mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    // console.log(positions);
    var numberOfVertices = positions.length / 3;
    if (vertexNumber > numberOfVertices - 1) return false;
    var x = positions[vertexNumber * 3];
    var y = positions[vertexNumber * 3 + 1];
    var z = positions[vertexNumber * 3 + 2];
    return {
        x: x,
        y: y,
        z: z
    };
}


// ----- COMPLICATED SECTION -------- //

// -- Mesh building functions
// Add a box with 1:1 texture mapping UVs
section3d.drawBox = function (options) {
    var _self = this;
    options = options || {};
    options.width = options.width || 1 * _self.globalScale;
    options.height = options.height || 1 * _self.globalScale;
    options.depth = options.depth || 1 * _self.globalScale;
    options.material = options.material || "asphalt";
    options.x = options.x || 0;
    options.y = options.y || 0;
    options.z = options.z || 0;
    options.id = options.id || "box";
    options.group = options.group || false;
    options.isPersistent = options.isPersistent || false;

    // Prepare texture mapping
    // Scale the UVs for each face: 0=back, 1=front, 2=right, 3=left, 4=top, 5=bottom
    var faceUV = new Array(6); // 6 faces

    //set all values to 1:1, with offsets based on section3d.coordinates.x
    var textureOffset = section3d.coordinates.x;
    faceUV[0] = new BABYLON.Vector4(0, 0, options.width, options.height);
    faceUV[1] = new BABYLON.Vector4(0, 0, options.width, options.height);
    faceUV[2] = new BABYLON.Vector4(0, 0, options.height, options.depth);
    faceUV[3] = new BABYLON.Vector4(0, 0, options.height, options.depth);
    faceUV[4] = new BABYLON.Vector4(0, 0 + textureOffset, options.depth, options.width + textureOffset);
    faceUV[5] = new BABYLON.Vector4(0, 0, options.depth, options.width);

    var box = BABYLON.MeshBuilder.CreateBox(options.id, {
        height: options.height,
        width: options.width,
        depth: options.depth,
        faceUV: faceUV,
        updatable: true
    }, this.scene);
    box.name = options.id;
    box.position.x = options.x;
    box.position.y = options.y;
    box.position.z = options.z;
    // If quality is set to be high, let's add realistic looking grass
    if(options.material == "grass1" && this.renderQuality > 3) {
        box.material = this.materialLibrary["grassEnhanced"];
        var quality = 30;
        var shells = BABYLON.FurMaterial.FurifyMesh(box, quality);  
    } else {
        box.material = this.materialLibrary[options.material];
    } 

    box.receiveShadows = true;
    box.vertexData = box.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    if (options.group) box.parent = options.group;
    this.shadowGenerator.addShadowCaster(box, true);
    this.objects.push(box);
    this.addToScreenSpaceReflections(box);
    this.meshQueue.count++;   // Let's us know that this object is in the mesh generation queue so we know when the section is done being rendered
    // Adds a callback for when the box is done being generated/rendered
    
    box.onAfterRenderObservable.addOnce(function (b,e) {
        _self.meshQueue.count--;
        if (options.onReady) options.onReady(b);
        if(box.material == _self.materialLibrary.dirt) {
            _self.boxMap(box);
        }

    });

    return box;
}

// Apply a universal scale to all elements in the scene.  We're working with inches and feet, and Babylon 1 unit = 1 metric for model imports
section3d.scaleData = function(unscaledData, scale) {
    var data = JSON.parse(JSON.stringify(unscaledData));
    var _self = this;
    scale = scale || this.globalScale;
    for (var i = 0; i < data.length; i++) {
        if (data[i].type == "width") continue;
        for (var property in data[i]) {
          var val = data[i][property];
          if (typeof val != "boolean" && Number(val).toString() != "NaN") {
                data[i][property] = scale * Number( val );
          }
        }        
    }
    return data;
}

// Unused at the moment - this will add striping to all segments
section3d.addAllStriping = function(data) {
    return;
    for (var i = 0; i < data.length; i++) {
        var type = data[i].type;
        if (type == "width") continue;
        this.activeGroup = this.scene.getMeshByID(data[i].toolid); // Let's put the striping into the group that holds this segment mesh
        this.activeCard = data[i].toolid;
        var stripe = JSON.parse(data[i].data3d).striping;
        if(stripe.length > 0) console.log("STRIPING: ", stripe[0]);
        if(stripe.length > 0) this.quickStripe(stripe[0].type);
    }    
}

// Goes through each card and begins drawing its section data to the section
section3d.drawCrossSection = function (unscaledData) {
    var _self = this;
    this.resetScene();
    this.clearSelection();
    var data = this.scaleData(unscaledData);    // Apply a universal scale to all elements in the scene.  We're working with inches and feet, and Babylon 1 unit = 1 metric for model imports
    // this.selectionBox.isPickable = false; // Make sure we can't click on the selection box
    
    // Add striping after adding everything else
    this.scene.onAfterRenderObservable.addOnce(function() {
        _self.addAllStriping(data);
    });

    for (var i = 0; i < data.length; i++) {
        var type = data[i].type;
        if (type == "width") continue;
        var texture = false;
        var yoffset = 0;
        this.activeGroup = new BABYLON.Mesh.CreateBox(data[i].toolid || "section_unnamed", 1, this.scene); // A group that holds all of the items for a segment
        this.activeGroup.isVisible = false;
        this.activeGroup.toolid = data[i].toolid;
        this.activeGroup.segmentWidth = Number(data[i].width); // For drawing the red, transparent hover box
        this.activeGroup.xpos = Number(this.coordinates.x);
        this.segments[data[i].toolid] = this.activeGroup;
        texture = data[i].texture;
        
        // If this card doesn't have any 3d data associated with it, add default data containers
        if(!this.getCardData(data[i].toolid)) {
            this.setCardData(data[i].toolid);
        }
        
        // If this section piece doesn't have any 3d data defined, let's give it some defaults
        this.segmentData[data[i].toolid] = {
            direction : 0,  // 0 = BiDirectional, 1 = Foward, 2 = Reversed
            props : [],     // A list of objects: { modelname, color, position, rotation, scale }
            striping : []   // A list of stripe elements: { type, position, rotation, width }
        }

        var label = data[i].label;

        // Presets for default section piece type
        if (texture && !(type == "median" && data[i].elevated === true) && type != "ditch" && type != "berm") {
            this.drawPiece(data[i], "blank");
        } else
            // Elevated medians are drawn in a special way.  Call the 'draw median' function
            if (texture && type == "median" && data[i].elevated === true) {
                this.drawPiece(data[i], "median");
            } else
                /* Ditches are another special circumstance.  Draw it in a ditch drawing function */
                if (texture && type == "ditch") {
                    this.drawPiece(data[i], "ditch");
                }
        if (texture && type == "berm") {
            this.drawPiece(data[i], "berm");
        }


        /* Add a global dimension line if requested */
        // To be converted
        /*
        if (type == "width") {
            if ($("#checkbox_width").is(':checked')) {
                addWidthDim($("#textbox_width").val());
            }
        }
        */
    }

    /* 
    
    // 2D Functions that may not be converted - still in debate 
    
    // If we have defined custom dimensions, let's draw them up!
    if (customDimension.length > 0) {
        addCustomDimensions();
    }        
    addTitle($("#textbox_title").val());
    
    */

}

// Removes all elements and resets the scene to prepare for the scene update
section3d.resetScene = function () {
    this.segments = {};
    this.coordinates.x = 0;
    this.coordinates.y = 0;
    this.objects.forEach(function (obj) {
        obj.dispose();
    });
    this.objects = [];
}

function gs3d(num) {
    return Number(num);
}


// Draw a single section piece
section3d.drawPiece = function (option, preset) {
    var _self = this;
    var x;
    var y;
    var toolid = option.toolid;
    
    var leftmost = false;
    var rightmost = false;
    if (svgJson[0].toolid == toolid) {
        var leftmost = true;
    }
    if (svgJson[svgJson.length - 1].toolid == toolid) {
        var rightmost = true;
    }
    var striping = JSON.parse(option.data3d).striping;
    var width = Number(option.width);
    var widthvaries = option.widthvaries;
    var texture = option.texture;
    var addSprite = option.sprite;
    var offset = Number(option.offset);
    if (!offset) {
        offset = 0;
    }
    option.curb = option.side || false;
    var fadeout = option.fadeout;
    var blur = option.blur;
    var spritesbehind = option.spritesbehind;
    var subsurface = option.subsurface;
    var opacity = 1;
    var thickness = Number(option.thickness) || 1;
    var thickOffset = (thickness - 1) + (thickness / 2);
    var label = option.label;
    var rightheight = Number(option.rightheight);
    var leftheight = Number(option.leftheight);
    var ditchdepth = Number(option.ditchdepth);
    var ditchtype = option.ditchtype;
    var bermHeight = Number(option.bermheight);
    var bermType = option.bermtype;
    thickness = Number(option.thickness); /* Already has GS (Global Scale) applied later */
    var hidedim = option.hidedim;
    var rollcurb = option.rollcurb;
    var dirtbase = this.groundPlaneThickness; // Standard dirt thickness
    var centerX, centerY;
    var skewableObject; // This is the final surface object that can be skewed to match the surface elevation slope
    var targetHeight = gs3d(dirtbase) + gs3d(offset);

    // Babylon requires numbers to be real numbers, not strings
    y = Number(_self.coordinates.y) + Number(offset); // + Number(options.elevation);
    x = Number(_self.coordinates.x) + (width / 2);
    thickness = Number(thickness);
    rightheight = Number(rightheight);
    leftheight = Number(leftheight) + 0.0000000001; // There's a bizarre bug where if leftheight == -1 exactly, it is never drawn properly.  Weird.  let's just add a minor increment.
    offset = Number(offset);
    
    var groundPlaneOptions = {  // Mandatory data to pass to ground plane construction
        offset : offset,
        width : width,
        thickness : thickness,
        rightheight : rightheight,
        leftheight : leftheight,
        texture : texture
    }

    if (preset == "median" && offset != 0) {
        // Draw an elevated median

        // Draw adjacent asphalt for striping, left
        var asphaltStripeLeft = _self.drawBox({
            width: 0.5 * _self.globalScale, // 6 inch curb width
            height: thickness, // 6 inch curb height
            depth: _self.sectionLength,
            material: "asphalt",
            x: _self.coordinates.x + (0.25 * _self.globalScale),
            y: (_self.groundPlaneThickness / 2) + offset - (thickness / 2) - (0.5 * _self.globalScale),
            group: _self.activeGroup,
            onReady: function () {
                addStripe({
                    mesh: asphaltStripeLeft,
                    x: asphaltStripeLeft.position.x,
                    y: asphaltStripeLeft.position.y + thickness + 2,
                    width: 0.33333 * _self.globalScale,
                    type: "stripe_solid_yellow",
                    group: _self.activeGroup
                });
            }
        });

        // Don't add a stripe decal until the box is completely done rendering/loading otherwise it won't be visible
        // Add striping


        // Draw adjacent asphalt for striping, right
        var asphaltStripeRight = _self.drawBox({
            width: 0.5 * _self.globalScale, // 6 inch curb width
            height: thickness, // 6 inch curb height
            depth: _self.sectionLength,
            material: "asphalt",
            x: _self.coordinates.x - (0.25 * _self.globalScale) + width,
            y: (_self.groundPlaneThickness / 2) + offset - (thickness / 2) - (0.5 * _self.globalScale),
            group: _self.activeGroup,
            onReady: function () {
                addStripe({
                    mesh: asphaltStripeRight,
                    x: asphaltStripeRight.position.x,
                    y: asphaltStripeRight.position.y + thickness + ( 2  * _self.globalScale ),
                    width: 0.33333 * _self.globalScale,
                    type: "stripe_solid_yellow",
                    group: _self.activeGroup,
                });
            }
        });
        // Draw curb left
        var box = _self.drawBox({
            width: 0.5 * _self.globalScale, // 6 inch curb width
            height: thickness + (0.5 * _self.globalScale), // 6 inch curb height
            depth: _self.sectionLength,
            material: "concrete",
            x: _self.coordinates.x + (0.75 * _self.globalScale), // Move over 6 inches from above
            y: (_self.groundPlaneThickness / 2) + offset - (thickness / 2) - (0.25 * _self.globalScale),
            group: _self.activeGroup
        });
        // Draw curb right
        var box = _self.drawBox({
            width: 0.5 * _self.globalScale, // 6 inch curb width
            height: thickness + (0.5 * _self.globalScale), // 6 inch curb height
            depth: _self.sectionLength,
            material: "concrete",
            x: _self.coordinates.x - (0.75 * _self.globalScale) + width, // Move over 6 inches from above
            y: (_self.groundPlaneThickness / 2) + offset - (thickness / 2) - (0.25 * _self.globalScale),
            group: _self.activeGroup
        });
        // Draw median
        var box = _self.drawBox({
            width: width - (2 * _self.globalScale), // width, minus striping and curb
            height: thickness,
            depth: _self.sectionLength,
            material: texture,
            x: _self.coordinates.x + (1 * _self.globalScale) + ((width - (2 * _self.globalScale)) / 2), // Move over 6 inches from above
            y: (_self.groundPlaneThickness / 2) + offset - (thickness / 2),
            group: _self.activeGroup
        });
        // Draw dirt under the median, one directly underneath the surface, another to fit the median width below that
        var box = _self.drawBox({
            width: width - (2 * _self.globalScale), // width, minus striping and curb
            height: (0.5 * _self.globalScale),
            depth: _self.sectionLength,
            material: "dirt",
            x: _self.coordinates.x + (1 * _self.globalScale) + ((width - (2 * _self.globalScale)) / 2), // Move over 6 inches from above
            y: (_self.groundPlaneThickness / 2) + offset - (thickness) - (0.25 * _self.globalScale),
            group: _self.activeGroup
        });


        // Now add the underground plane, move it down half a foot first, then reset the coordinates back to where they need to be
        _self.coordinates.y -= (0.5 * _self.globalScale);
        _self.addGroundPlane({...{nosurface: true}, ...groundPlaneOptions });
        _self.coordinates.y += (0.5 * _self.globalScale);

    } else if (preset == "ditch") {
        // Draw a 3D Ditch
        var ditchHeight = ditchdepth || (1 * _self.globalScale); // Ditch Depth
        var ditchData = this.ditchData[ditchtype] || this.ditchData.Default;    // Regular Ditch types.  Culverts are a special case.
        var ditchElevationAdjustment = 0; // Calculated later - left height and right height difference
        var ditch = {};
        // Draw the ditch, extrusion style (non-culvert)
        if(ditchtype.toLowerCase() != "culvert") {
            var ditch = this.addShapedPiece(ditchData, {
                thickness : thickness,
                depth : _self.sectionLength,
                width : width, 
                height : ditchHeight,
                texture : texture,
            });        
            var bounds = this.getDimensions(ditch);
            ditch.position.x = _self.coordinates.x;
            ditch.position.y = offset - bounds.depth + (2 * _self.globalScale);            
        }
        if(ditchtype.toLowerCase() == "culvert") {
            // Left culvert side
            ditch.left = _self.drawBox({
                width: thickness, // side wall
                height: ditchHeight, // wall height
                depth: _self.sectionLength,
                material: texture,
                x: _self.coordinates.x + (thickness / 2),
                y: (_self.groundPlaneThickness / 2) + offset - (ditchHeight / 2),
                group: _self.activeGroup
            });
            ditch.right = _self.drawBox({
                width: thickness, // side wall
                height: ditchHeight, // wall height
                depth: _self.sectionLength,
                material: texture,
                x: _self.coordinates.x + width - (thickness / 2),
                y: (_self.groundPlaneThickness / 2) + offset - (ditchHeight / 2),
                group: _self.activeGroup
            });
            ditch.bottom = _self.drawBox({
                width: width, // side wall
                height: thickness, // wall height
                depth: _self.sectionLength,
                material: texture,
                x: _self.coordinates.x + (width / 2),
                y: (_self.groundPlaneThickness / 2) + offset - (thickness / 2) - ditchHeight,
                group: _self.activeGroup
            });               

        }
        // Gets the ground plane UNDER the ditch
        var opts = groundPlaneOptions;
        opts.nosurface = true;
        opts.thickness = ditchHeight + thickness;
        var bground = _self.addGroundPlane(opts);
        window.ditch = ditch;

        
    } else if (preset == "berm") {
        // Draw a 3D berm
        var bermHeight = bermHeight || (1 * _self.globalScale); // berm Depth
        var bermData = this.bermData[bermType] || this.bermData.U;
        
        var berm = this.addShapedPiece(bermData, {
            thickness : thickness,
            depth : _self.sectionLength,
            width : width, 
            height : bermHeight,
            texture : texture
        });        
        var bounds = this.getDimensions(berm);
        berm.position.x = _self.coordinates.x;
        berm.position.y = offset - bounds.depth + (2 * _self.globalScale) + bermHeight;        

        // Gets the ground plane UNDER the berm
        var opts = groundPlaneOptions;
        opts.nosurface = true;
        opts.thickness = thickness - (0.05 * _self.globalScale); // Some berms may not completely touch the ground surface, so we'll bring the ground surface up to the berm.
        var bground = _self.addGroundPlane(opts);
        window.berm = berm;
        
        
        
    } else {
        /* Default section piece rectangle */

        if (option.curb) {
            _self.addGroundPlane(groundPlaneOptions);
            addCurb(option.curb, option.rollcurb);
        } else {
            groundPlaneOptions.striping = striping;
            _self.addGroundPlane(groundPlaneOptions);
        }

        // To be converted
        // addSubSurfaces();        
    }

    // Striping
    /*
    if(striping.length != 0) {
        striping.forEach( function(item,indx) {
            console.log("Stripe: ",toolid);
            section3d.activeCard = toolid;
            _self.quickStripe(item.type);
        });
    }
    */

    // Private Functions

    // Adds a sub surface to the model
    function addSubSurfaces(options) {
        if (subsurface) {
            var subsurfaces = JSON.parse(subsurface);
            var currentLevel = gs3d(thickness);
            for (var i = 0; i < subsurfaces.length; i++) {
                texture = pattern[subsurfaces[i].material];
                thickness = subsurfaces[i].thickness;
                var thisPlane = _self.addGroundPlane({...{nounderground: true},...groundPlaneOptions}); // nounderground:true -> Prevent the addGroundPlane function from drawing the underground dirt for sublayers
                thisPlane.dmove(0, currentLevel);
                currentLevel += gs3d(subsurfaces[i].thickness); // subsurfaces[i].thickness;
            }
        }
    }

    // Adds striping to a segment - Z axis is forward/backward on the lane
    function addStripe(stripeData) {
        var stripe;
        var width = stripeData.width || 0.5 * _self.globalScale;
        var type = stripeData.type || "stripe_solid_yellow";
        var x = stripeData.x || 0;
        var y = stripeData.y || 10 * _self.globalScale;
        var thickness = stripeData.thickness || 10 * _self.globalScale;
        var material = _self.decalLibrary[type];
        var group = stripeData.group || false;
        var stripeOffset = rnd(1 * section3d.globalScale); // Gives the striping a little randomized positioning along Z axis
        // No mesh is given, so apply it to every mesh in the scene, except other decals and underground objects
        if (!stripeData.mesh) {
            _self.objects.forEach(function(obj, indx) {
               if(obj._isMesh && obj.id != "underground" && obj.id != "decal_stripe") { 
                   stripeData.mesh = obj; 
                   addStripe(stripeData); 
               }
            });
        }
       
        // Dashed White
        if(type == "stripe_dashed_white") {
            
            for(var z = -(_self.sectionLength/2) - stripeOffset; z < _self.sectionLength; z+=(40*_self.globalScale)) {
                stripe = new BABYLON.MeshBuilder.CreateDecal("decal_stripe", stripeData.mesh, {
                    position: new BABYLON.Vector3(x, y, z),
                    size: new BABYLON.Vector3(width, 1, _self.sectionLength),    // 10 foot stripe
                    angle: Math.PI / 2
                }, _self.scene);
                if (group) stripe.parent = group;
                stripe.material = _self.decalLibrary.stripe_solid_white;
                stripe.scaling.y = 10 * _self.globalScale; // Stretch to 10 feet per stripe
                stripe.position.z = z;
                _self.objects.push(stripe);            
            }
            return stripe;
        }
        // Solid White
        if(type == "stripe_solid_white") {
                stripe = new BABYLON.MeshBuilder.CreateDecal("decal_stripe", stripeData.mesh, {
                    position: new BABYLON.Vector3(x, y, 0),
                    size: new BABYLON.Vector3(width, 1, _self.sectionLength),
                    angle: Math.PI / 2
                }, _self.scene);
                if (group) stripe.parent = group;
                stripe.material = _self.decalLibrary.stripe_solid_white;
                stripe.scaling.y = _self.sectionLength; // Stretch to 10 feet per stripe
                _self.objects.push(stripe);            
        }
        // Dashed Yellow
        if(type == "stripe_dashed_yellow") {
            for(var z = -(_self.sectionLength/2) - stripeOffset; z < _self.sectionLength; z+=(40*_self.globalScale)) {
                stripe = new BABYLON.MeshBuilder.CreateDecal("decal_stripe", stripeData.mesh, {
                    position: new BABYLON.Vector3(x, y, z),
                    size: new BABYLON.Vector3(width, 1, _self.sectionLength),    // 10 foot stripe
                    angle: Math.PI / 2
                }, _self.scene);
                if (group) stripe.parent = group;
                stripe.material = _self.decalLibrary.stripe_solid_yellow;
                stripe.scaling.y = 10 * _self.globalScale; // Stretch to 10 feet per stripe
                stripe.position.z = z;
                _self.objects.push(stripe);            
            }
            return stripe;
        }
        // Solid Yellow
        if(type == "stripe_solid_yellow") {
                stripe = new BABYLON.MeshBuilder.CreateDecal("decal_stripe", stripeData.mesh, {
                    position: new BABYLON.Vector3(x, y, 0),
                    size: new BABYLON.Vector3(width, 1, _self.sectionLength),
                    angle: Math.PI / 2
                }, _self.scene);
                if (group) stripe.parent = group;
                stripe.material = _self.decalLibrary.stripe_solid_yellow;
                stripe.scaling.y = _self.sectionLength; // Stretch to 10 feet per stripe
                _self.objects.push(stripe);            
        }          
        else {
            stripe = new BABYLON.MeshBuilder.CreateDecal("decal_stripe", stripeData.mesh, {
                position: new BABYLON.Vector3(x, y, 0),
                size: new BABYLON.Vector3(width, 1, _self.sectionLength),
                angle: Math.PI / 2
            }, _self.scene);
            if (group) stripe.parent = group;
            stripe.material = material;
            stripe.scaling.y = _self.sectionLength; // Stretch to the length of the section.  These decals are rotated, so Y is the LENGTH of the decal
            _self.objects.push(stripe);
        }
            window.stripe = stripe;
  
        // stripe.showBoundingBox = true; // For debugging
        return stripe;

    }
    
    this.addStripe = addStripe;


    function addCurb(curb, rollCurb) {
        // Roll curb addition 
        if(rollCurb) {
            //var curbData = {};
            //curbData.points = _self.pointStringToArray(`0.0,9.9495674 1.826356,9.7078106 3.5256889,8.7136899 4.3298019,7.9715142 5.0943038,7.0691916 5.8112717,6.0047521 6.4727835,4.7801657 6.7896754,4.0653395 7.1144895,3.2821546 7.4630706,2.48529 7.8433409,1.7216347 8.2790673,1.0419579 8.7781719,0.49313829 9.3683831,0.12596539 10.0,0.0`);
            //curbData.groundParts = [ _self.pointStringToArray(`0.0,0.0 0.0,9.9495674 1.826356,9.7078106 3.5256889,8.7136899 4.3298019,7.9715142 5.0943038,7.0691916 5.8112717,6.0047521 6.4727835,4.7801657 6.7896754,4.0653395 7.1144895,3.2821546 7.4630706,2.48529 7.8433409,1.7216347 8.2790673,1.0419579 8.7781719,0.49313829 9.3683831,0.12596539 10.0,0.0`) ];
            var curbDef = _self.addShapedPiece(_self.curbData[curb], {
                thickness : 0.00001 * _self.globalScale, // We don't want a top of curb that's thick since the curb is only a half foot high
                depth : _self.sectionLength,
                width : 1 * _self.globalScale, 
                height : 0.5 * _self.globalScale,
                texture : texture,
                noSurface : true,           // Deletes the surface of the curb after generating the ground.  The surface is required for math before deleting. 
                groundMaterial : texture    // Curbs need a concrete ground
            });        
            var bounds = _self.getDimensions(curbDef);
            curbDef.position.x = _self.coordinates.x;
            if (curb == "right") {
                curbDef.position.x += width - (1 * _self.globalScale);
            }
            
            curbDef.position.y = offset - bounds.depth + (2 * _self.globalScale) + (0.5 * _self.globalScale);               
        } else {        
        if (curb == "left") {
                var curbDef = _self.drawBox({
                    width: 0.5 * _self.globalScale, // 6 inch curb width
                    height: 0.5 * _self.globalScale, // 6 inch curb height
                    depth: _self.sectionLength,
                    material: texture,
                    x: _self.coordinates.x + ((0.5 * _self.globalScale) / 2),
                    y: _self.coordinates.y + (2.25 * _self.globalScale) + offset + leftheight,
                    group: _self.activeGroup
                });
            }
            if (curb == "right") {
                var curbDef = _self.drawBox({
                    width: 0.5 * _self.globalScale, // 6 inch curb width
                    height: 0.5 * _self.globalScale, // 6 inch curb height
                    depth: _self.sectionLength,
                    material: texture,
                    x: _self.coordinates.x - ((0.5 * _self.globalScale) / 2) + width,
                    y: _self.coordinates.y + (2.25 * _self.globalScale) + offset + leftheight,
                    group: _self.activeGroup
                });
            }
        }
        window.curb = curbDef;
        return curbDef;

    }



    /* Skews the object passed to it by the left and right slope difference */
    function skewFeature(ent) {
        y = _self.coordinates.y - gs3d(offset);
        x = _self.coordinates.x;
        centerX = ent.cx();
        centerY = ent.cy();
        if (leftheight - rightheight < 0) {
            ent.skew(0, (leftheight - rightheight) / 2.1, x, y);
        } else {
            ent.skew(0, (leftheight - rightheight) / 2.1, gs3d(width), y);
        }
    }

    function addRollCurb() {
        // A roll curb was requested
        addGroundPlane(groundPlaneOptions);

        // Roll curb
        if (option.curb == "left") {
            /* Draw Left Side Rollcurb */
            var curb = activeGroup.path("m 368.96875,540.625 0,-16.5 c 8.15143,-0.0867 5.11059,5.1689 12.0809,5.33768");
            curb.attr({
                fill: texture,
                'fill-opacity': 1,
                stroke: "#000",
                'stroke-width': 1,
            });

            var curbHeight = curb.bbox().height;
            curb.move(_self.coordinates.x, _self.coordinates.y - gs3d(offset) - gs3d(0.5) - leftheight);
            curb.width(gs3d(1.5));
        }
        if (option.curb == "right") {
            /* Draw Right Side Rollcurb */
            var curb = activeGroup.path("m 381.04965,540.625 0,-16.5 c -8.15143,-0.0867 -5.11059,5.1689 -12.0809,5.33768");
            curb.attr({
                fill: texture,
                'fill-opacity': 1,
                stroke: "#000",
                'stroke-width': 1,
            });

            var curbHeight = curb.bbox().height;
            curb.move(_self.coordinates.x + gs3d(width) - gs3d(1.5), _self.coordinates.y - gs3d(offset) - gs3d(0.5) - rightheight);
            curb.width(gs3d(1.5));
        }
    }

    if(addSprite) {
        section3d.spritesToMeshes(addSprite);
    }
    
    /* To be converted
    addDimension(width, label, widthvaries, hidedim);

    if (option.centerline == true) {
        addCenterline(_self.coordinates.x + (gs3d(width) / 2));
    }
    centerY -= gs3d(0);
    */

    /* To be converted
    // Add optional sprites to section piece
    
    if (addSprite) {
        var spriteGroup = activeGroup.group();
        spriteGroup.addClass("spritegroup");
        spriteGroup.attr("toolid", toolid);
        spriteGroup.attr("spritegroupid", toolid);
        
        for (var ii = 0; ii < addSprite.length; ii++) {
            (function() {
                var spritedata = addSprite[ii].split(",");
                var imgSprite = sprite.sprites[spritedata[0]] || "";
                if (imgSprite.group == "markings") {
                    hasLaneMarkings = true;
                }
                var img = [];
                var matchtest = devlib.math.rndRangeInt(0, 1000);
                window.totalSprites++;
                var i = window.totalSprites;
                if (imgSprite.sprite == undefined) return;
                if (imgSprite.sprite) spriteLookup[spritedata[5]] = spriteGroup.image("sprites/" + imgSprite.sprite);
                img[i] = spriteLookup[spritedata[5]];

                img[i].uid = spritedata[5];
                img[i].spritedata = spritedata;
                var matchtest = centerX;
                img[i].matchtest = matchtest;



                img[i].on("load", function() {
                    var currentImage = this;
                        $(currentImage.node).attr("spriteobject", "1");
                        $(currentImage.node).attr("uid", spritedata[5]);
                        var originalDims = [currentImage.bbox().width, currentImage.bbox().height];


                    this.spriteForceLoad = function() {
                        var currentImage = this;
                        this.show();
                        currentImage.base = [];

                        var spritedata = currentImage.spritedata;

                        var imgSprite = sprite.sprites[spritedata[0]];      // Sprite name
                        spritedata[1] = Number(spritedata[1]) || 0;         // Horizontal offset
                        spritedata[2] = Number(spritedata[2]) || 0;         // Vertical offset
                        spritedata[3] = Number(spritedata[3] * 0.01 || 0);  // Scale +
                        spritedata[4] = Number(spritedata[4]) || 0;         // Rotation
                                                                            // spritedata[5] = Sprite UID

                        // Thickness of a section piece messes with sprite positioning.  Let's take that into account
                        spritedata[2] -= ((thickness - 1) / 2) * gs3d(1);

                        var currentImage = currentImage;
                        var scaleby;

                        if (originalDims[0] > originalDims[1]) {
                            scaleby = originalDims[0] / imgSprite.scale;
                        } else {
                            scaleby = originalDims[1] / imgSprite.scale;
                        }
                        currentImage.base["scaleby"] = scaleby;
                        currentImage.base["width"] = (originalDims[0] / scaleby);
                        currentImage.base["height"] = (originalDims[1] / scaleby);
                        currentImage.width((originalDims[0] / scaleby) * (1 + spritedata[3]));
                        currentImage.height((originalDims[1] / scaleby) * (1 + spritedata[3]));
                        currentImage.show();
                        var box = currentImage.bbox();
                        var hardCenterX = centerX + (imgSprite.offsetx) + (offset / 2);
                        var hardCenterY = centerY - imgSprite.offsety - gs3d(0.5);

                        currentImage.base["x"] = hardCenterX;
                        currentImage.base["y"] = hardCenterY;
                        currentImage.center(hardCenterX + spritedata[1], hardCenterY - (box.height / 2) + spritedata[2]);
                        var box = currentImage.bbox();
                        currentImage.transform({
                            rotation: spritedata[4]
                        })

                        // Check if it successfully loaded the sprite.  If so, make sure the section title is below the entire cross section
                        if (currentImage.width() == 0) {
                            if (!loadingError) {
                                setTimeout(function() {
                                    prepareCrossSection();
                                }, 100);
                            }
                            loadingError = true;
                        } else {
                            draw.height(draw.bbox().height);

                            if (currentImage.y() > laneMarkingPosition) laneMarkingPosition = currentImage.y();
                            if (svgTitle) {
                              //  console.log("FOrceful!");
                              //  svgTitle.y(laneMarkingPosition + gs3d(titlePositionOffset));
                                draw.height(draw.bbox().height)
                            }
                        }


                    }

                    this.spriteForceLoad();

                });
            })()

        }
        if(spritesbehind) {
            spriteGroup.back();
        }
    }
    
    
    
    
    // Make region clickable

    var clickregion = drawBox(_self.coordinates.x, 10, gs3d(width), gs3d(36), "clickregion", 0);
    clickRegions.push(clickregion);
    clickregion.id("region" + toolid);
    clickregion.front();
    clickregion.attr("toolindex", toolid);
    clickregion.attr("clickregion", "1");
    $("#region" + toolid).clickObject = clickregion;
    $("#region" + toolid).click(function(evt) {
        var thisToolId = $(this).attr("toolindex");
        if (waitingForInput) {
            waitingForInput = false;
            returnToInput(thisToolId);
        } else {
            jumpto(toolid);
        }
    });

    $("#region" + toolid).mouseenter(function() {
        $(this).attr({
            'fill-opacity': 0.5,
        });
    }).mouseleave(function() {
        $(this).attr({
            fill: '#ff0000',
            'fill-opacity': 0,
            stroke: "#000",
            'stroke-width': 0,
            x: x,
            y: 10
        });

    });
    addToContextMenus("#region" + toolid); // Give it a right-click context menu

    if (option.blur) {
        activeGroup.filter(filter.blur);
    }    
    
    if (option.fadeout) {
        activeGroup.opacity(0.5);
    }
    */

    _self.coordinates.x += gs3d(width);

}

// Looks at the 2D data for a sprite object and looks at its 3d definition, to place it into the model
section3d.spritesToMeshes = function(spriteData) {
    spriteData.forEach( function(item, index) {
        var thisItem = section3d.getSprite3dData(item.split(",")[0]);
        // console.log("Add sprite: ", thisItem);
    });
}

section3d.getSprite3dData = function(spriteName) {
    if(!sprite.sprites[spriteName]) { 
        console.warn(`%cTrying to load an unknown sprite as a 3d object: %c${spriteName}`, "padding:5px; color:white; background:rgb(100,0,0);", "padding:5px; color:white; background:rgb(0,30,100);"); return false; 
    };
    let model3d = sprite.sprites[spriteName].model3d;
    return model3d;
}


// Precache 3d model objects
section3d.cacheModels = function() {
    var _self = this;
    popup({ title : "Loading 3d Assets", html : "<div id='loadstate'></div>"});
    this.assetsManager = new BABYLON.AssetsManager(this.scene);
    this.assetsManager.onError = function(task,msg,exception) {
        console.log("Mesh error: ",`${task} | ${msg} | ${exception}`);
    };
    
    for(var key in sprite.sprites) {
        var spriteData = sprite.sprites[key];
        if(spriteData.model3d) {
            var file = spriteData.model3d;
            if(!_self.modelLibrary[file]) {
                var meshTask = this.assetsManager.addMeshTask(`${file}`, "", `3d/models/vehicles/${file}`);
                meshTask.onError = function (task, message, exception) {
                    console.log(message, exception);
                }
                meshTask.onSuccess = function(task) {
                    task.loadedMeshes[0].setEnabled(false);
                    _self.modelLibrary[task.name] = task.loadedMeshes[0];
                }
            }
        }
    }
    this.assetsManager.onProgress = function(remainingCount, totalCount, lastFinishedTask) {
        var filename = lastFinishedTask.rootUrl;
        $("#loadstate").html(`Loading ${filename}<br /><br />Files Remaining: ${remainingCount}, Total files to load: ${totalCount}`);
        // console.log(lastFinishedTask);
    }
    this.assetsManager.onTaskErrorObservable.add(function(task) {
        console.log('task failed', task.errorObject.message, task.errorObject.exception);
    });
    this.assetsManager.onFinish = function(tasks) {
        console.log("Done Loading Assets");
        $("#loadstate").text(`Finished loading all assets`);
        closePopup();
    };   
    this.assetsManager.load(); // Begin loading assets
}

section3d.addGroundPlane = function(options) {
    
    var _self = this;
    options = options || {};
    var elevation = Number(options.elevation) || 0;
    var offset = Number(options.offset) || 0;
    var width = Number(options.width) || 10 * _self.globalScale;
    var thickness = Number(options.thickness);
    var rightheight = Number(options.rightheight);    
    var leftheight = Number(options.leftheight) + 0.0000000001; // There's a bizarre bug where if leftheight == -1 exactly, it is never drawn properly.  Weird.  let's just add a minor increment.
    var y = Number(_self.coordinates.y) + offset + elevation;
    var x = Number(_self.coordinates.x) + (width / 2);
    var texture = options.texture;
    var group = false;
    var striping = options.striping;
    if (options.noGroup != true) group = _self.activeGroup; // Add to the active group by default unless noGroup is specified as true

   
    /* Draw the dirt base first */
    if (options.nounderground != true) {
        var thisBoxHeight = _self.groundPlaneThickness + y - (thickness);
        var box = _self.drawBox({
            width: width,
            height: thisBoxHeight,
            depth: _self.sectionLength,
            material: "dirt",
            x: x,
            y: -(_self.groundPlaneThickness / 2) + (thisBoxHeight / 2),
            id : "underground"
        });
        // Slope the edges if we have an edge elevation difference
        this.shiftVertex(box, this.edge.TOPLEFT[0], [0, leftheight, 0]);
        this.shiftVertex(box, this.edge.TOPLEFT[1], [0, leftheight, 0]);
        this.shiftVertex(box, this.edge.TOPRIGHT[0], [0, rightheight, 0]);
        this.shiftVertex(box, this.edge.TOPRIGHT[1], [0, rightheight, 0]);
        this.boxMap(box);
        if (group) box.parent = group;
        
    }

    if (options.nosurface != true) {
        /* Now draw the surface plane */
        var box = _self.drawBox({
            width: width,
            height: thickness,
            depth: _self.sectionLength,
            material: texture,
            x: x,
            y: (_self.groundPlaneThickness / 2) + offset - (thickness / 2),
            id:"surface",
            onReady : function(mesh) {
                if(striping) section3d.applyStripesToSegment(mesh, striping);
            }
        });

        // Slope the edges if we have an edge elevation difference - Slope the top and bottom equally
        this.shiftVertex(box, this.edge.TOPRIGHT[0], [0, rightheight, 0]);
        this.shiftVertex(box, this.edge.TOPRIGHT[1], [0, rightheight, 0]);
        this.shiftVertex(box, this.edge.BOTTOMRIGHT[0], [0, rightheight, 0]);
        this.shiftVertex(box, this.edge.BOTTOMRIGHT[1], [0, rightheight, 0]);

        this.shiftVertex(box, this.edge.TOPLEFT[0], [0, leftheight, 0]);
        this.shiftVertex(box, this.edge.TOPLEFT[1], [0, leftheight, 0]);
        this.shiftVertex(box, this.edge.BOTTOMLEFT[0], [0, leftheight, 0]);
        this.shiftVertex(box, this.edge.BOTTOMLEFT[1], [0, leftheight, 0]);
        
        if (group) box.parent = group;

    }
    return group;

}

// Quick Stripe will add a specific stripe to the CURRENT card and 3d mesh
section3d.quickStripe = function(type) {
    if(!this.activeCard) {
        popup({html : "You need to select a segment before adding striping", height : 150});
    }
    
    var cardData = this.getCardData();  // Gets card data3d attribute as an object
    var _self = this;
    var toolid = this.activeCard;
    var mesh = this.segments[ this.activeCard ];
    var bounding = this.getDimensionsAlt(mesh);
    var gsc = _self.globalScale;
    var stripeData = [{
        x: 0,           // Not used at this time, just a placeholder
        y: 0,           // Not used at this time, just a placeholder
        width: 10,      // Not used at this time, just a placeholder
        group: mesh,    // This one is used
        type : type     // this one is used
    }];    
    if(type == "3d_stripe_removeall") { 
        cardData.striping = [];     // Remove all stripes from this segment
    } else {
        section3d.applyStripesToSegment(mesh, stripeData);
        cardData.striping.push({ type : type, position : "0", rotation : "0", scale : "1" }); // position, rotation, and scale aren't used at the moment
    }
    this.setCardData(this.activeCard, cardData);
    prepareCrossSection();
    // var stripe = _self.addStripe(stripeData);        
}

// Applies a stripe to a single mesh via the addGroundPlane function.  A mesh may have multiple stripes
section3d.applyStripesToSegment = function(mesh, striping) {
    if(striping.length < 1) return false;
    var pos = section3d.getDimensions(mesh);
    striping.forEach( function(stripe,index) {
        var type = "stripe_yellow_solid";   // Default striping type
        var width = 0.5;                    // Default Width in feet
        if(stripe.type == "3d_stripe_white_dashed_left") { width = 4/12; type="stripe_dashed_white"; var xpos = pos.xmin + (0.25 * section3d.globalScale); }
        if(stripe.type == "3d_stripe_white_dashed_right") { width = 4/12; type="stripe_dashed_white"; var xpos = pos.xmax - (0.25 * section3d.globalScale); }
        if(stripe.type == "3d_stripe_white_solid_left") { width = 4/12; type="stripe_solid_white"; var xpos = pos.xmin + (0.25 * section3d.globalScale); }
        if(stripe.type == "3d_stripe_white_solid_right") { width = 4/12; type="stripe_solid_white"; var xpos = pos.xmax - (0.25 * section3d.globalScale); }  
        if(stripe.type == "3d_stripe_yellow_dashed_left") { width = 4/12; type="stripe_dashed_yellow"; var xpos = pos.xmin + (0.25 * section3d.globalScale); }
        if(stripe.type == "3d_stripe_yellow_dashed_right") { width = 4/12; type="stripe_dashed_yellow"; var xpos = pos.xmax - (0.25 * section3d.globalScale); }
        if(stripe.type == "3d_stripe_yellow_solid_left") { width = 4/12; type="stripe_solid_yellow"; var xpos = pos.xmin + (0.25 * section3d.globalScale); }
        if(stripe.type == "3d_stripe_yellow_solid_right") { width = 4/12; type="stripe_solid_yellow"; var xpos = pos.xmax - (0.25 * section3d.globalScale); }            
        section3d.addStripe({
           mesh : mesh,
           x : xpos,
           y : mesh.position.y + 1,
           width : width * section3d.globalScale,
           type : type,
           group : striping.group || section3d.activeGroup
        }); 
        
    });
}

// Generate screen space reflections for the ground plane
section3d.generateReflectiveGround = function() {
    var _self = this;
    if(this.ground) return false; // Ground already exists

    var scene = this.scene;

    //Creation of a plane
    var mesh = BABYLON.Mesh.CreateGround("plane", 1000 * _self.globalScale, 1000 * _self.globalScale, 1, scene);
    mesh.position.y = -2 * this.globalScale;
    mesh.rotation.y = Math.PI/2;

    //Creation of a repeated textured material
    var materialPlane = new BABYLON.PBRMaterial("texturePlane", scene);
   // materialPlane.metallic = 1;
   // materialPlane.roughness = 1;
    //materialPlane.diffuseTexture = new BABYLON.Texture("textures/grass.jpg", scene);
    //materialPlane.diffuseTexture.uScale = 5.0;//Repeat 5 times on the Vertical Axes
    //materialPlane.diffuseTexture.vScale = 5.0;//Repeat 5 times on the Horizontal Axes
    //materialPlane.backFaceCulling = false;//Allways show the front and the back of an element

    var subMeshIndex = 0; // in case you want to set the plane to a submesh and not the main mesh
    var pointsArray = [];
    var meshWorldMatrix = mesh.computeWorldMatrix(true);
    var verticesPosition = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    //handle submeshes
    var offset = 0;
    if (this.isMultiMaterial) {
        offset = mesh.subMeshes[subMeshIndex].indexStart
    } 
    for (var i = 0; i < 3; i++) {
        var v = mesh.getIndices()[offset + i];
         pointsArray.push(BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(verticesPosition, v*3), meshWorldMatrix));
    }
    var mirrorPlane = BABYLON.Plane.FromPoints(pointsArray[0], pointsArray[1], pointsArray[2]);

    var mirror = new BABYLON.MirrorTexture("mirror", 1024, scene);
    mirror.uAng = Math.PI/2;
    mirror.vAng = Math.PI/2;
    mirror.mirrorPlane = mirrorPlane;
    materialPlane.reflectionTexture = mirror;
    materialPlane.reflectionTexture.level = 1;
    // mirror.adaptiveBlurKernel = 50; // Amount to blur the reflection
    var runOnce = mirror.onAfterRenderObservable.add( 
        function() { 
            mirror.blurKernelX  = 10; 
            mirror.blurKernelY  = 100; 
            mirror.onAfterRenderObservable.remove(runOnce); 
    });
    mesh.material = materialPlane;
    this.mirrorPlane = mirror;
    
    return mesh;
}

// Adds an object to screen space reflections
section3d.addToScreenSpaceReflections = function(mesh) {
    this.mirrorPlane.renderList.push(mesh);
}


// Gets the save data to add to the sm.core.js section3d JSON object
section3d.getSaveData = function () {
    var sceneData = {
        cameraPosition : this.camera.position,
        cameraTarget : this.camera.target,
        lightDirection : this.light.direction,
        ambientLight : this.ambientLight.intensity,
        directionalLight : this.light.intensity,
        skybox : false, // this.skybox.material,    // Switch to sky box material name once it's programmed in
        animate : false                             // Animation isn't used yet.  Keep false for now.
    }
    return { sceneData : sceneData, segmentData : this.segmentData };
}

// Applies data supplied from an undo/redo or file load event
section3d.applyData = function(data) {
    // Segment data isn't supplied yet.  Coming soon.
    var cameraPosition = data.sceneData.cameraPosition;
    var cameraTarget = data.sceneData.cameraTarget;
    var lightDirection = data.sceneData.lightDirection;
    this.camera.setPosition( new BABYLON.Vector3( cameraPosition.x, cameraPosition.y, cameraPosition.z) );
    this.camera.setTarget( new BABYLON.Vector3( cameraTarget.x, cameraTarget.y, cameraTarget.z) );
    this.light._setDirection( new BABYLON.Vector3( lightDirection.x, lightDirection.y, lightDirection.z) );
    this.light.intensity = data.sceneData.directionalLight;
    this.ambientLight.intensity = data.sceneData.ambientLight;
}


// Draw ditches and berms
section3d.addShapedPiece = function(meshData, options) {
    options = options || {};
    var thickness = options.thickness || 0;
    var depth = options.depth || this.sectionLength;
    var width = options.width || 1 * _self.globalScale;
    var height = options.height || 1 * _self.globalScale;
    var elevation = options.elevation || 0;  // This is the "raised" value of this segment
    var texture = options.texture || "dirt";
    var groundParts = meshData.groundParts || [];

     // Convert the 2D polyline to a 3d mesh.  Make sure the option to ignore the surface isn't enabled.
        var mesh = this.linesToMesh({
            points:meshData.points, 
            width : width,
            thickness:thickness,
            height:height,
            depth:depth,
            extrude:!options.extrude    // If extrude == false, then it won't extrude this polyline and keep it flat
        });
        mesh.material = section3d.materialLibrary[texture];
        this.addToScreenSpaceReflections(mesh);
        this.boxMap(mesh);  // Wrap a texture around this mesh without skewing the UVs

    var calc = this.getMinMax2D(meshData.points);   // Get the scaling that was applied to the first mesh, so we know how to scale ground elements
    // If ground objects underneath this shape are defined, let's draw those too
    for(var i = 0; i < groundParts.length; i++) {
        var groundElement = this.extrudePolygon({ 
            points: groundParts[i], 
            width : width * calc.width,
            thickness:thickness,
            height:height * calc.height,
            depth:depth,
        });
        var offset = this.getDimensions(mesh);
        
        groundElement.material = this.materialLibrary[options.groundMaterial] || this.materialLibrary["dirt"];
        groundElement.onAfterRenderObservable.addOnce( function(e) { 
            e.position.y = mesh.getBoundingInfo().boundingBox.minimum.y; 
            e.position.x = mesh.getBoundingInfo().boundingBox.minimum.x;
            if(options.noSurface) mesh.dispose();
        })
        groundElement.position.x = width;
        groundElement.parent = this.activeGroup;
        this.objects.push(groundElement);
        this.boxMap(groundElement);
        this.addToScreenSpaceReflections(groundElement);
    }
    if(!options.noSurface) {
        mesh.parent = this.activeGroup;
        this.objects.push(mesh);
        mesh.receiveShadows = true;
        return mesh;   // Returns the group of meshes that make up this shaped piece
    }
    return mesh;
}



section3d.extrudePolygon = function(options) {
    var _self = this;
    var scene = this.scene;
    var points = options.points || [ [0,0],[0,1],[1,1],[]];
    var width = options.width || 1 * _self.globalScale;
    var thickness = options.thickness || 1 * _self.globalScale;
    var height = options.height || 1 * _self.globalScale;
    var depth = options.depth || 1 * _self.globalScale;
    if(points.length < 1) return false;
    var lineVectors = JSON.parse(JSON.stringify(points)); // Don't modify the original points.  Clone them instead.

    // Multiply source polyline by width and height
    lineVectors.forEach( function(v,i) {
        v[0] = v[0] * width;
        v[1] = v[1] * height;
    });
    var vectors3 = [];  // Array of 3d vectors for building the mesh
    lineVectors.forEach( function(v,i) {
        vectors3.push( new BABYLON.Vector3(v[0],0,v[1]) );
    });  
    var polygon = BABYLON.MeshBuilder.ExtrudePolygon("polygon", {shape:vectors3,depth: depth, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    polygon.rotation.x = -Math.PI/2; // Rotate the mesh so it's parallel with the ground    
    polygon.position.z = depth/2 * -1;   
    this.objects.push(polygon);
    return polygon;
}

// Return the 
section3d.getMinMax2D = function(vectors) {
    var calcWidth = 0;
    var calcHeight = 0;   
    
    vectors.forEach( function(v,i) {
        if(v[0] > calcWidth) calcWidth = v[0]; // Scale to 1 unit wide before adding width adjustment
        if(v[1] > calcHeight) calcHeight = v[1]; // Scale to 1 unit height before adding height adjustment
    });
    calcWidth = (1/calcWidth);
    calcHeight = (1/calcHeight);
    return { width : calcWidth, height : calcHeight }
}

// Converts a 2D open polyline to a 3d mesh - thickness = surface thickness.  height = depth/height of the ditch/berm
section3d.linesToMesh = function(options) {
    var _self = this;
    var points = options.points || [];
    var width = options.width || 1 * this.globalScale;
    var thickness = options.thickness || 1 * this.globalScale;
    var height = options.height || 1 * this.globalScale;
    var depth = options.depth || 1 * this.globalScale;
    var extrude = options.extrude || false; // Do we want to close this polygon by extruding its vertices?  If false, we assume this polygon is already closed.
    if(points.length < 1) return false;    
    
    
    // Get the total width of this object when width = 1, then use it as a multiplier to fit 1:1 in the segment (i.e. a 10 foot ditch should be 10 feet wide)
    // Ditto for height
    var lineVectors = JSON.parse(JSON.stringify(points)); // Don't modify the original points.  Clone them instead.
    var calc = this.getMinMax2D(lineVectors);
    width = width * calc.width;
    height = height * calc.height;

    // Multiply source polyline by width and height
    lineVectors.forEach( function(v,i) {
        v[0] = v[0] * width;
        v[1] = v[1] * height;
    });
    
    // Reverse the polyline direction for the extruded top if we have extrude set to true
    if(options.extrude) {
        var reversedLines = JSON.parse(JSON.stringify(lineVectors)).reverse();   // Ellipses "..." basically means "each of the items in".  An array can be cloned with [...myArray]
        reversedLines.forEach( function(v,i) {
            v[1] = v[1] + thickness;    // Add surface thickness
            lineVectors.push(v);
        });
    }
    // Convert polyline vertices to Babylon 2D Vertex objects
    var vectors2 = [];
    lineVectors.forEach( function(v,i) {
        vectors2.push( new BABYLON.Vector2(v[0],v[1]) );
    });        

    // Begin extruding the vectors into 3d space
    var poly_tri = new BABYLON.PolygonMeshBuilder("shapedPiece", vectors2, this.scene);
    var polygon = poly_tri.build(null, depth);
    polygon.rotation.x = -Math.PI/2; // Rotate the mesh so it's parallel with the ground    
    polygon.position.z = depth/2 * -1;
    return polygon;
}

// Converts a mesh's material to a triplane material so it wraps equally around the model
section3d.boxMap = function(mesh) {
    var triPlanarMaterial;
     // mesh.bakeCurrentTransformIntoVertices(); 
    if(mesh.material.name != "triplanar") { // If this object already has a triplanar material, don't reapply it again.  Just adjust the scaling instead.
        var texture = mesh.material.albedoTexture || mesh.material.diffuseTexture;
        var bump = mesh.material.bumpTexture;
        var uScale = texture.uScale;
        var vScale = texture.vScale;    
        triPlanarMaterial = new BABYLON.TriPlanarMaterial("triplanar", this.scene);
        this.objects.push(triPlanarMaterial); // Make sure this material is destroyed on a refresh
        // The 3 diffuse textures must be set, even if they share the same texture reference
        triPlanarMaterial.diffuseTextureX = texture;
        triPlanarMaterial.diffuseTextureY = texture;
        triPlanarMaterial.diffuseTextureZ = texture;
        // mesh.bakeCurrentTransformIntoVertices(); // Since some objects are rotated, i.e. ditches and berms, this will bake its rotated vertices into standard orientation
        
        if(bump) {
            triPlanarMaterial.normalTextureX = bump;
            triPlanarMaterial.normalTextureY = bump;
            triPlanarMaterial.normalTextureZ = bump;            
        } else {
            bump = this.materialLibrary.flat.bumpTexture;
            triPlanarMaterial.normalTextureX = bump;
            triPlanarMaterial.normalTextureY = bump;
            triPlanarMaterial.normalTextureZ = bump;              
        }
       // bump = this.materialLibrary.flat.bumpTexture;
        triPlanarMaterial.tileSize = 1/uScale;  // Scale based on defined UV
    } else {
        triPlanarMaterial = mesh.material;
    }
    // When the material and mesh are both fully ready, bake the mesh transforms
    // Since some objects are rotated, i.e. ditches and berms, this will bake its rotated vertices into 0,0,0 rotation
    mesh.onAfterRenderObservable.addOnce( 
        function() {
            //var matrix = BABYLON.Matrix.RotationYawPitchRoll(0, Math.PI / 2, 0);
            // mesh.bakeTransformIntoVertices(matrix);  
            mesh.material = triPlanarMaterial;
            mesh.bakeCurrentTransformIntoVertices(); 
            var indices = mesh.getIndices();
            var normals = mesh.getVerticesData("normal");
            var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            BABYLON.VertexData.ComputeNormals(positions, indices, normals);
            mesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals, false, false);            
            // mesh.bakeTransformIntoVertices(mesh.getWorldMatrix()); 
        } 
    );    
      
}

// Attempting to fix box mapping issue where normal maps are improperly calculated
section3d.boxMapTest = function(mesh) {
    var rotation = mesh.rotation.clone();
    mesh.rotation.x = Math.PI / 2;
    var scene = this.scene;
    var triPlanarMaterial = new BABYLON.TriPlanarMaterial("triplanar", scene);

    // The 3 diffuse textures must be set, even if they share the same texture reference
    triPlanarMaterial.diffuseTextureX = new BABYLON.Texture("3d/textures/ground/dirt_D.jpg", scene);
    triPlanarMaterial.diffuseTextureY = new BABYLON.Texture("3d/textures/ground/dirt2_D.jpg", scene);
    triPlanarMaterial.diffuseTextureZ = triPlanarMaterial.diffuseTextureX;
    triPlanarMaterial.normalTextureX = new BABYLON.Texture("3d/textures/ground/dirt_N.jpg", scene);
    triPlanarMaterial.normalTextureY = new BABYLON.Texture("3d/textures/ground/dirt2_N.jpg", scene);
    triPlanarMaterial.normalTextureZ = triPlanarMaterial.normalTextureX;  
    triPlanarMaterial.tileSize = 1;
    mesh.material = triPlanarMaterial;
    mesh.rotation.x = rotation.x;
}



// Attempt to wrap a PBR material around a mesh since tri-plane doesn't allow PBR materials
section3d.boxMapAdvanced = function(mesh) {
    var clonedMaterial = mesh.material.clone();
    section3d.objects.push(clonedMaterial); // Make sure this material is destroyed on a refresh
    var texture = clonedMaterial.albedoTexture || clonedMaterial.diffuseTexture;
    var normal = clonedMaterial.bumpTexture;
    var uScale = texture.uScale;
    var vScale = texture.vScale;
    
    var dims = this.getDimensions(mesh);
    // U and V scales BOTH affect the top surface of a ditch.
    uScale = uScale * dims.width;   // Top of ditch
    vScale = vScale * (dims.height + dims.depth);  // Front of ditch
    texture.uScale = uScale;
    texture.vScale = vScale;
    if(normal) {
        normal.uScale = uScale;
        normal.vScale = vScale;    
    }
    mesh.material = clonedMaterial;
    
}

// OPTIMIZED CODE: Gets the bounding data for a mesh.  Will go through all child meshes and use them in the calculation as well. 
// This ignores any invisible mesh data, including parent mesh data if it's invisible.  It will still calculate visible child meshes.
section3d.getDimensionsAlt = function(mesh) {
    var bounds = mesh.getHierarchyBoundingVectors(true, predicate);
    
    function predicate(mesh) {
        if(mesh.isVisible) return true;    // If the mesh is visible, don't hide its data (false = include this data);
    }
    var xmin = bounds.min.x;
    var ymin = bounds.min.y;
    var zmin = bounds.min.z;
    var xmax = bounds.max.x;
    var ymax = bounds.max.y;
    var zmax = bounds.max.z;     
    var width = Math.abs(xmax - xmin);
    var height = Math.abs(ymax - ymin);
    var depth = Math.abs(zmax - zmin);
    var center = new BABYLON.Vector3(xmin + (width / 2),ymin + (height / 2),zmin + (depth / 2));
    console.log({ width : width, height : height, depth : depth, center : center, xmin : xmin, ymin : ymin, zmin : zmin, zmax : zmax, xmax : xmax, ymax : ymax });
    return { width : width, height : height, depth : depth, center : center, xmin : xmin, ymin : ymin, zmin : zmin, zmax : zmax, xmax : xmax, ymax : ymax };
   // return bounds;
}


// UNOPTIMIZED CODE: This works more accurately than the alt version.  Will determine why later.
// Gets the bounding data for a mesh.  Will go through all child meshes and use them in the calculation as well. 
// This ignores any invisible mesh data, including parent mesh data if it's invisible.  It will still calculate visible child meshes.
section3d.getDimensions = function(mesh) {
    var _self = this;
    var b = mesh.getBoundingInfo().boundingBox;
    if(!mesh.isVisible) var b = mesh.getChildren()[0].getBoundingInfo().boundingBox;
    var width = b.maximum.x - b.minimum.x;
    var height = b.maximum.y - b.minimum.y;
    var depth = b.maximum.z - b.minimum.z;
    var center = b.centerWorld;
    var xmin = b.minimumWorld.x;
    var xmax = b.maximumWorld.x;
    var ymin = b.minimumWorld.y;
    var ymax = b.maximumWorld.y;  
    var zmin = b.minimumWorld.z;
    var zmax = b.maximumWorld.z;      
    
    if(mesh.getChildren().length > 0) {
        mesh._children.forEach(function(thisMesh,id) {
            thisMesh.computeWorldMatrix();
            var dims = _self.getDimensions(thisMesh);
            if(dims.xmin < xmin) xmin = dims.xmin;
            if(dims.xmax > xmax) xmax = dims.xmax;
            if(dims.ymin < ymin) ymin = dims.ymin;
            if(dims.ymax > ymax) ymax = dims.ymax;
            if(dims.zmin < zmin) zmin = dims.zmin;
            if(dims.zmax > zmax) zmax = dims.zmax;
            width = Math.abs(xmax - xmin);
            height = Math.abs(ymax - ymin);
            depth = Math.abs(zmax - zmin);
            center = new BABYLON.Vector3(xmin + (width / 2),ymin + (height / 2),zmin + (depth / 2));
           // console.log({ width : width, height : height, depth : depth, center : center, xmin : xmin, ymin : ymin, zmin : zmin, zmax : zmax, xmax : xmax, ymax : ymax });
        });
    }
    if(!mesh.isVisible) {
        var min = new BABYLON.Vector3(xmin,ymin,zmin);
        var max = new BABYLON.Vector3(xmax,ymax,zmax);
        mesh.setBoundingInfo( new BABYLON.BoundingInfo(min,max));
       // mesh.showBoundingBox = true;
       // window.boxx = _self.drawBox({x:center.x,y:center.y,depth:depth,width:width,height:height,x:xmin + (width/2)});
    }
    return { width : width, height : height, depth : depth, center : center, xmin : xmin, ymin : ymin, zmin : zmin, zmax : zmax, xmax : xmax, ymax : ymax };
}


// Found online, this function will smooth all vertices
BABYLON.Mesh.prototype.minimizeVertices = function() {

    var _pdata = this.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var _ndata = this.getVerticesData(BABYLON.VertexBuffer.NormalKind);
    var _idata = this.getIndices();    

    var _newPdata = []; //new positions array
    var _newIdata =[]; //new indices array

    var _mapPtr =0; // new index;
    var _uniquePositions = []; // unique vertex positions
    for(var _i=0; _i<_idata.length; _i+=3) {
        var _facet = [_idata[_i], _idata[_i + 1], _idata[_i+2]]; //facet vertex indices
        var _pstring = []; //lists facet vertex positions (x,y,z) as string "xyz""
        for(var _j = 0; _j<3; _j++) { //
            _pstring[_j] = "";
            for(var _k = 0; _k<3; _k++) {
                //small values make 0
                if (Math.abs(_pdata[3*_facet[_j] + _k]) < 0.0001) {
                    _pdata[3*_facet[_j] + _k] = 0;
                }
                _pstring[_j] += _pdata[3*_facet[_j] + _k] + "|";
            }
            _pstring[_j] = _pstring[_j].slice(0, -1);        
        }
        //check facet vertices to see that none are repeated
        // do not process any facet that has a repeated vertex, ie is a line
        if(!(_pstring[0] == _pstring[1] || _pstring[0] == _pstring[2] || _pstring[1] == _pstring[2])) {        
            //for each facet position check if already listed in uniquePositions
            // if not listed add to uniquePositions and set index pointer
            // if listed use its index in uniquePositions and new index pointer
            for(var _j = 0; _j<3; _j++) { 
                var _ptr = _uniquePositions.indexOf(_pstring[_j])
                if(_ptr < 0) {
                    _uniquePositions.push(_pstring[_j]);
                    _ptr = _mapPtr++;
                    //not listed so add individual x, y, z coordinates to new positions array newPdata
                    //and add matching normal data to new normals array newNdata
                    for(var _k = 0; _k<3; _k++) {
                        _newPdata.push(_pdata[3*_facet[_j] + _k]);
                    }
                }
                // add new index pointer to new indices array newIdata
                _newIdata.push(_ptr);
            }
        }
    }

    _newNdata =[]; //new normal data

    BABYLON.VertexData.ComputeNormals(_newPdata, _newIdata, _newNdata);

    //create new vertex data object and update
    var _vertexData = new BABYLON.VertexData();
    _vertexData.positions = _newPdata;
    _vertexData.indices = _newIdata;
    _vertexData.normals = _newNdata;

    _vertexData.applyToMesh(this);

}


// Gets 3d data from a card, returned as an object.  If no card ID is given, use the active card ID
section3d.getCardData = function(cardId) {
    if(!cardId) {
        var $card = $(getCardDOM(this.activeCard));  // Get the card DOM element so we can add extra 3d data to it
    } else {
        var $card = $(getCardDOM(cardId));
    }
    if($card.length == 0) return false;                        // No matching card found
    
    var cardDataJson = $card.attr("data3d");
    var cardData3d = false;
    if(cardDataJson) {
        var cardData3d = JSON.parse(cardDataJson);
    }    
    if(!cardData3d) {
        cardData3d = JSON.parse(JSON.stringify(this.defaultCardData));      // Gets default card data for 3d if none is defined.  Prevents issues with undefined variables.
    }    
    return cardData3d;
}

// Gets 3d data from a card, returned as an object.  If no card ID is given, use the active card ID
section3d.setCardData = function(cardId, data) {
    if(!cardId) {
        var $card = $(getCardDOM(this.activeCard));  // Get the card DOM element so we can add extra 3d data to it
    } else {
        var $card = $(getCardDOM(cardId));
    }
    if(!data) {
        data = JSON.parse(JSON.stringify(this.defaultCardData));      // Gets default card data for 3d if none is defined.  Prevents issues with undefined variables.
    }
    $card.attr("data3d", JSON.stringify(data));
    return $card;
}

// Utilities
section3d.util = {};

section3d.util.toDegrees = function (angle) {
    return angle * (180 / Math.PI);
}

section3d.util.toRadians = function (angle) {
    return angle * (Math.PI / 180);
}

function debugBox() {
    window.light = section3d.light;
    window.box = section3d.drawBox({ width : 3, height : 3, depth : 3, x : 15, y : 2}); 
    box.material = (section3d.materialLibrary.concrete); 
    window.shade = section3d.shadowGenerator.addShadowCaster(box);
    section3d.gizmoManager = new BABYLON.GizmoManager(section3d.scene);
    section3d.gizmoManager.positionGizmoEnabled = true;
}

section3d.showFps = function() {
    $("#fps").show();
    $("#fps").offset({ top : $(window).height() - 50 }) ;
    this.showFPS = true;
    section3d.engine.renderEvenInBackground = true;
}

section3d.description = ["sm.section3d.js", "3D Cross Section functionality - Currently API capable, but not properly initialized yet."]

// [Issue C0004] Add the section3d stuff into the cross section API.  This needs to become native to the API in the future!
SmartModule.fn.module("section3d", section3d);
})();

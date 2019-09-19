/*
    Section 3D Model Loader
    This will import a gltf model and assign bump maps, diffuse textures, shininess, roughness, etc. based on the material name that is imported.
    Name a material with a JSON string to keep it easier, otherwise it will look for key words such as "metal" or "glass" in the material name on import.
    Example JSON Material Name (Yes, this is the full material name to assign in Sketchup)
    
    MyMaterial = m:1 r:0.5 b:"rubber.jpg" o:1
    
    * In the above example, m=metallic, r=roughness, b=bump file to use, o=opacity
    * If b (bump) doesn't have a value assigned, it will attempt to find a matching bump file in 3d/textures/meshimporter.  Add _N to the filename so it knows it's a normal map.
        - i.e. if the material is named:   "MyMaterial = m:0.5 r:0 b o:1" it will search for "MyMaterial_N.jpg" for the normal map file.
        - If a filename is given, it still looks in the meshimporter directory:  MyMaterial = m:0.5 r:0 b:"mybump.png" o:1
        - Availble Variables: 
            -  m=metallic, r=roughness, b=bumpmap (normal map), o=opacity override, 
               h=use heightmap with this strength, e=emissive power, 
               ec=emissive color (1,1,1 = white)
    \
    
*/
csecLib.showModuleInfo("sm.importer3d.js", "3D File importer for BabylonJS");	
(function(){

let section3d = csecLib.section3d;

var pathDebug = "vehicles/hatchback01.gltf";

section3d.loadModel = function(path, callback) {
    var _self = this;
    var mesh;
    var parsed;
    BABYLON.GLTFFileLoader.IncrementalLoading = false; // Set this property to false to disable incremental loading which delays the loader from calling the success callback until after loading the meshes and shaders. 
    var fullPath = devlib.fileSystem.getPath("3d/models/" + path);
    var filename = devlib.fileSystem.getFileName(path);
    console.log("Loading " + fullPath);
    var loader = BABYLON.SceneLoader.LoadAssetContainer(fullPath, filename, this.scene, function (container) {
        var meshes = container.meshes;
        var materials = container.materials;
        window.mats = materials;
        console.log(materials);
        //...

        // Adds all elements to the scene
        container.addAllToScene();
        mesh = container.createRootMesh();
       // mesh.
        window.cont = container;
        if(callback) callback(mesh);
    });
    window.loaded = loader;
    loader.compileMaterials = true;

    loader.onMaterialLoaded  = function(data) { 
        window.data = data;
        console.log(data);
        _self.processLoadedMaterial(data);
    };
    loader.onMeshLoadedObservable  = function(thisMesh) { 
        _self.shadowGenerator.add(thisMesh);
    };    
    
}

// Go through the materials and assign values based on their material names
section3d.processLoadedMaterial = function(material) {
    var _self = this;
    if(devlib.util.contains(material.name,"=") && devlib.util.contains(material.name,":")) {
        var matVars = material.name.split("=")[1].split(" ");
        matVars.forEach( function(matvar, i) {
            var thisMat = matvar.split(":");
            if(thisMat.length < 2) thisMat = [];
            if(thisMat[0] == "m") material.metallic = Number(thisMat[1]);
            if(thisMat[0] == "r") material.roughness = Number(thisMat[1]);
            // Bump map loader
            if(thisMat[0] == "b") { 
                var textureTask = _self.assetsManager.addTextureTask("image task", "3d/textures/meshimporter/" + thisMat[1]);
                textureTask.onSuccess = function(texture) {
                    material.bumpTexture = texture;
                }
            }

        });
    }
    if(material.name.toLowerCase() == "default material") {
        material.metallic = 0.5;
        material.roughness = 0;
        material.albedoColor = new BABYLON.Color3(1,0,0);
        window.reflector = material;
    }
}

function debugMesh() {
    section3d.loadModel(pathDebug, function(m) { window.m = m; m.position = new BABYLON.Vector3(2, 1, -19); });
    section3d.showFps();
    
}

});
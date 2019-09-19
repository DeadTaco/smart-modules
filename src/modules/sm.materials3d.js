csecLib.showModuleInfo("sm.materials3d.js", "3D Textures/materials for segment surfaces and objects");	
csecLib.section3d.materialDefinitions = {
    asphalt : { 
        name : "Asphalt",
        type : "standard",
        diffuse : "ground/asphalt_D.jpg",
        bump : "ground/asphalt_N.jpg",
        glossiness : 5,
        roughness : 0.8,
        opacity : 1,
        scale : { u : 0.05, v : 0.05 }
    },
    asphalt_striped_tight  : { 
        name : "Snow",
        type : "standard",
        diffuse : "ground/asphalt_striped_tight_D.jpg",
        bump : "ground/asphalt_N.jpg",
        glossiness : 0,
        roughness : 0.75,
        opacity : 1,
        scale : { u : 0.05, v : 0.05 }
    },    
    concrete : { 
        name : "Concrete",
        type : "standard",
        diffuse : "ground/concrete_D.jpg",
        bump : "ground/concrete_N.jpg",
        glossiness : 0,
        roughness : 0.75,
        opacity : 1,
        scale : { u : 0.05, v : 0.05 }
    },
                
    dirt : { 
        name : "Dirt",
        type : "standard",
        diffuse : "ground/dirt_D.jpg",
        bump : "ground/dirt_N.jpg",
        glossiness : 5,
        roughness : 0.75,
        opacity : 1,
        scale : { u : 0.05, v : 0.05 }
    },
    dirt2 : { 
        name : "Dirt, Compacted",
        type : "standard",
        diffuse : "ground/dirt2_D.jpg",
        bump : "ground/dirt2_N.jpg",
        glossiness : 0,
        roughness : 0.75,
        opacity : 1,
        scale : { u : 0.05, v : 0.05 }
    },     
    grass1 : { 
        name : "Grass 1",
        type : "standard",
        diffuse : "ground/grass1_D.jpg",
        glossiness : 0,
        roughness : 0.9,
        opacity : 1,
        scale : { u : 0.05, v : 0.05 }
    },
    grass2 : { 
        name : "Grass 2",
        type : "standard",
        diffuse : "ground/grass2_D.jpg",
        bump : "ground/grass2_N.jpg",
        glossiness : 0,
        roughness : 0.9,
        opacity : 1,
        scale : { u : 0.05, v : 0.05 }
    },
                
    mulch : { 
        name : "Wood Mulch",
        type : "standard",
        diffuse : "ground/mulch_D.jpg",
        bump : "ground/mulch_N.jpg",
        glossiness : 0,
        roughness : 1,
        opacity : 1,
        scale : { u : 0.05, v : 0.05 }
    },
    rocks : { 
        name : "Rocks",
        type : "standard",
        diffuse : "ground/rocks_D.jpg",
        bump : "ground/rocks_N.png",
        glossiness : 0.1,
        specularColor : [1,1,1],
        opacity : 1,
        scale : { u : 0.05, v : 0.05 }
    },    
    rocks2 : { 
        name : "Aggregate Base",
        type : "standard",
        diffuse : "ground/rocks_agbase_D.jpg",
        bump : "ground/rocks_agbase_N.jpg",
        glossiness : 0,
        roughness : 1,
        opacity : 1,
        scale : { u : 0.05, v : 0.05 }
    },  
    pavers : { 
        name : "Pavers",
        type : "standard",
        diffuse : "ground/pavers_D.jpg",
        bump : "ground/pavers_N.jpg",
        glossiness : 0,
        roughness : 0.5,
        opacity : 1,
        scale : { u : 0.05, v : 0.05 }
    },  

    water : { 
        name : "Water",
        type : "standard",
        diffuse : "ground/water_D.jpg",
        bump : "ground/water_N.jpg",
        glossiness : 0,
        roughness : 0,
        opacity : 1,
        scale : { u : 0.05, v : 0.05 }
    },
    
    water2 : { 
        name : "Water 2",
        type : "standard",
        diffuse : "ground/water_D.jpg",
        bump : "ground/water_N.jpg",
        glossiness : 0,
        roughness : 0,
        opacity : 0.5,
        scale : { u : 0.05, v : 0.05 }
    },
    snow : { 
        name : "Snow",
        type : "standard",
        diffuse : "ground/snow_D.jpg",
        bump : "ground/snow_N.jpg",
        glossiness : 0,
        roughness : 0.25,
        opacity : 1,
        scale : { u : 0.05, v : 0.05 }
    }, 
    flat : { 
        name : "Flat",
        type : "standard",
        diffuse : false,
        bump : "ground/flat_N.jpg",
        glossiness : 0,
        roughness : 1,
        opacity : 1,
        scale : { u : 0.05, v : 0.05 },
        color : [1,1,1]
    },     


}
        

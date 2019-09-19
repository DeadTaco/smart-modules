csecLib.showModuleInfo("sm.sprites.js", "Definitions for all of the sprite objects to choose from in the sprite object library");	

function defineSprites() {
    /* 
        NOTE: Everything is scaled by globalscale to get actual size.
        For example, a pole with a scale of 110 would be 10' tall if global scale is 11 (110/11 = 10).
        This may be updated later so global scale is applied automatically, and then scale will be in feet.
        
        Groups separate the sprites into groups in the sprite selector window.
        Templates are used to randomly draw sprites to a section whenever a template is chosen.
    */
    sprite = {
        "groups": {
            "vehicle_back": "<div><img src='sprites/carback1.gif'></div>Vehicles, back",
            "vehicle_front": "<div><img src='sprites/carfront3.gif'></div>Vehicles, front",
            "vehicle_side": "<div><img src='sprites/carside_kia.png'></div>Vehicles, angled",     
            "peds": "<div><img src='sprites/ped1.gif'></div>Pedestrians",            
            "trees": "<div><img src='sprites/tree2.gif'></div>Trees",
            "plants": "<div><img src='sprites/shrub1.gif'></div>Plants and Shrubs",
            "streetfurniture": "<div><img src='sprites/lamppost2.gif'></div>Street Furniture, Lighting, & Buildings",
            "markings": "<div><img src='sprites/sym_turn_right.svg'></div>Markings and Symbols",
            "other": "<div><img src='sprites/misc_FREEDOM.png'></div>Other / Miscellaneous"
        },
        "templates" : {
				"snowytrees" : "tree_winter,tree_snowy1,tree_snowy2,tree_snowy3,tree_snowy4",
                "deserttrees" : "tree_palm1,tree_palm2,tree_palm_stubby",
                "desertplants" : "shrub5,shrub3,shrub9",
                "groundcover" : "shrub3,shrub5,shrub_marigold,shrub_flowers",
                "trees" : "tree1,tree2,tree3,tree4,tree5,tree6,tree7,tree_decid_med,tree_decid_large,tree_decid_skinny,tree_decid_young,tree_decid1,tree_decid3,tree_decid4,tree_elm,tree_evergreen_young,tree_fall,tree_sparse,tree_tall",
                "plants" : "shrub1,shrub2,shrub3,shrub4,shrub5,shrub6,shrub7,shrub8,shrub9,shrub10,shrub11,shrub12,shrub_barberry,shrub_bigleaf,shrub_clover,shrub_flowers,shrub_grass1,shrub_grassball,shrub_juniper1,shrub_juniper2,shrub_lavender,shrub_leafy,shrub_lungwort,shrub_marigold,shrub_medleaf,shrub_spirea,shrub_spirea2,shrub_wide,shrub_willow,shrub_woodrush,shrub_young",
                "pedestrians" : "ped_jogging_div01,ped_group_div01,ped_front_div07,ped_front_div06,ped_front_div04,ped_front_div03,ped_front_div02,ped_front_div01,ped_family_div01,ped_couple_div01,ped_back_div04,ped_back_div03,ped_back_div02,ped_back_div01,ped_back_couple_div01,ped_woman,ped_woman2,ped_woman_back,ped1,ped_couple1,ped_couple2,ped_family1,ped_family2,ped2,ped_kids,ped_barefoot",
                "carsfront" : "carfront_acura1,carfront_acura2,carfront_acura3,carfront_jeep,carfront_honda1,carfront_honda2,carfront_kia,carfront_subaru1,carfront_van,carfront_chevy,carfront_dodge,carfront_ford",
                "largevehiclefront" : "carfront_van,truckfront_1,truckfront_2,truckfront_3,truckfront_fire,busfront,busfront_electric,busfront_tall,busfront_school",
                "carsback" : "carback_acura1,carback_acura2,carback_acura3,carback_jeep,carback_kia,carback_subaru1,carback_van,carback_chevy,carback_dodge,carback_ford",
                "largevehicleback" : "carback_van,busback,busback2,busback_school,truckback",
        },
        "sprites": {



            /* VEHICLE FRONTS */
            "carfront_acura1": {
                "description": "Sedan 1",
                "sprite": "carfront_acura1.png",
                "model3d" : "sedan05.gltf",
                "colorable" : true,
                "scale": 74,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "carfront_acura2": {
                "description": "Sedan 2",
                "sprite": "carfront_acura2.png",
                "model3d" : "sedan06.gltf",
                "colorable" : true,
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "carfront_acura3": {
                "description": "Sedan 3",
                "sprite": "carfront_acura3.png",
                "model3d" : "sedan07.gltf",
                "colorable" : true,
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "carfront_jeep": {
                "description": "Jeep",
                "sprite": "carfront_jeep.png",
                "model3d" : "jeep.gltf",
                "colorable" : true,
                "scale": 74,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },            
            "carfront_honda1": {
                "description": "Sedan 4",
                "sprite": "carfront_honda1.png",
                "model3d" : "sedan08.gltf",
                "colorable" : true,
                "scale": 72,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "carfront_honda2": {
                "description": "Sedan 5",
                "sprite": "carfront_honda2.png",
                "model3d" : "sedan09.gltf",
                "colorable" : true,
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "carfront_kia": {
                "description": "Hatchback",
                "sprite": "carfront_kia.png",
                "model3d" : "hatchback01.gltf",
                "colorable" : true,
                "scale": 68,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            }, 
            "carfront_subaru1": {
                "description": "Sedan 6",
                "sprite": "carfront_subaru1.png",
                "model3d" : "sedan10.gltf",
                "colorable" : true,
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "carfront_van": {
                "description": "Van",
                "sprite": "carfront_van.png",
                "model3d" : "van01.gltf",
                "colorable" : true,
                "scale": 83,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            }, 
            "carfront_chevy": {
                "description": "Truck 1",
                "sprite": "carfront_chevy.png",
                "model3d" : "pickup01.gltf",
                "colorable" : true,
                "scale": 83,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            }, 
            "carfront_dodge": {
                "description": "Truck 2",
                "sprite": "carfront_dodge.png",
                "model3d" : "pickup02.gltf",
                "colorable" : true,
                "scale": 83,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "carfront_ford": {
                "description": "Truck 3",
                "sprite": "carfront_ford.png",
                "model3d" : "pickup02.gltf",
                "colorable" : true,
                "scale": 84,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "truckfront_1": {
                "description": "Semi 1",
                "sprite": "truckfront_1.png",
                "model3d" : "semi01.gltf",
                "colorable" : true,
                "scale": 114,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "truckfront_2": {
                "description": "Semi 2",
                "sprite": "truckfront_2.png",
                "model3d" : "semi02.gltf",
                "colorable" : true,
                "scale": 114,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "truckfront_3": {
                "description": "Semi 3",
                "sprite": "truckfront_3.png",
                "model3d" : "semi02.gltf",
                "colorable" : true,
                "scale": 114,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "truckfront_fire": {
                "description": "Fire Truck",
                "sprite": "truckfront_fire.png",
                "model3d" : "firetruck.gltf",
                "colorable" : true,
                "scale": 104,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            }, 
            "busfront": {
                "description": "RTC North Bus",
                "sprite": "busfront.gif",
                "model3d" : "bus_rtc_n.gltf",
                "colorable" : true,
                "scale": 104.5,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "busfront_rtc_lv": {
                "description": "RTC South Bus",
                "sprite": "busfront2.png",
                "model3d" : "bus_rtc_s.gltf",
                "colorable" : true,
                "scale": 104.5,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
               
            "busfront_electric": {
                "description": "Electric Bus",
                "sprite": "busfront_electric.png",
                "model3d" : "bus_electric.gltf",
                "colorable" : true,
                "scale": 104.5,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "busfront_tall": {
                "description": "Standard Bus",
                "sprite": "busfront_tall.png",
                "model3d" : "bus_standard.gltf",
                "colorable" : true,                
                "scale": 104.5,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },             
            "busfront_school": {
                "description": "School Bus",
                "sprite": "busfront_school.png",
                "model3d" : "bus_school.gltf",
                "colorable" : true,
                "scale": 104.5,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "train_front": {
                "description": "Train",
                "sprite": "train_front.png",
                // "model3d" : "train.gltf",
                "colorable" : false,
                "scale": 183,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            }, 
            "lightrail": {
                "description": "Light Rail",
                "sprite": "lightrail.png",
                // "model3d" : "lightrail.gltf",
                "colorable" : false,
                "scale": 195,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },               
            "carfront_outline1": {
                "description": "Outline Jeep",
                "sprite": "carfront_outline1.png",
                "model3d" : "jeep.gltf",
                "colorable" : true,
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },             
            "carfront_outline2": {
                "description": "Outline Sedan",
                "sprite": "carfront_outline2.png",
                "model3d" : "sedan05.gltf",
                "colorable" : true,
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },
            "busfront_outline": {
                "description": "Bus Outline",
                "sprite": "busfront_outline.png",
                "model3d" : "bus_standard.gltf",
                "colorable" : true,
                "scale": 104.5,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_front"
            },            
            
            /* VEHICLE BACKS */
            "carback_acura1": {
                "description": "Sedan 1",
                "sprite": "carback_acura1.png",
                "scale": 75.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "sedan05.gltf",
                "colorable" : true
            },
            "carback_acura2": {
                "description": "Sedan 2",
                "sprite": "carback_acura2.png",
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "sedan06.gltf",
                "colorable" : true
            },
            "carback_acura3": {
                "description": "Sedan 3",
                "sprite": "carback_acura3.png",
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "sedan07.gltf",
                "colorable" : true
            },
            "carback_jeep": {
                "description": "Jeep",
                "sprite": "carback_jeep.png",
                "scale": 72,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "jeep.gltf",
                "colorable" : true
            },            
            "carback_kia": {
                "description": "Hatchback",
                "sprite": "carback_kia.png",
                "scale": 68,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "hatchback01.gltf",
                "colorable" : true
            }, 
            "carback_subaru1": {
                "description": "Sedan 5",
                "sprite": "carback_subaru1.png",
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "sedan09.gltf",
                "colorable" : true
            },
            "carback_van": {
                "description": "Van",
                "sprite": "carback_van.png",
                "scale": 80,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "van01.gltf",
                "colorable" : true
            }, 
            "carback_chevy": {
                "description": "Truck 1",
                "sprite": "carback_chevy.png",
                "scale": 78,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "pickup01.gltf",
                "colorable" : true
            }, 
            "carback_dodge": {
                "description": "Truck 2",
                "sprite": "carback_dodge.png",
                "scale": 80,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "pickup02.gltf",
                "colorable" : true
            },
            "carback_ford": {
                "description": "Truck 3",
                "sprite": "carback_ford.png",
                "scale": 82,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "pickup02.gltf",
                "colorable" : true
            },
            "busback": {
                "description": "RTC Bus",
                "sprite": "busback.gif",
                "scale": 104.5,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "sedan05.gltf",
                "colorable" : true,
                "model3d" : "bus_rtc_n.gltf",
                "colorable" : true
            },
            "busback2": {
                "description": "RTC South Bus",
                "sprite": "busback2.png",
                "scale": 104.5,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "bus_rtc_s.gltf",
                "colorable" : true
            },              
            "busback_school": {
                "description": "School Bus",
                "sprite": "busback_school.png",
                "scale": 104.5,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "bus_school.gltf",
                "colorable" : true
            },
            "truckback": {
                "description": "Semi Truck",
                "sprite": "truckback.png",
                "scale": 125.5,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "semi01.gltf",
                "colorable" : true
            },
            "carback_outline1": {
                "description": "Outline Jeep",
                "sprite": "carback_outline1.png",
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "jeep.gltf",
                "colorable" : true
            },             
            "carback_outline2": {
                "description": "Outline Sedan",
                "sprite": "carback_outline2.png",
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back"
            },
            "busback_outline": {
                "description": "Bus Outline",
                "sprite": "busback_outline.png",
                "scale": 104.5,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_back",
                "model3d" : "bus_standard.gltf",
                "colorable" : true
                
            },  
            
            /* VEHICLE ANGLED */
            
            "carside_sedan_l": {
                "description": "Sedan Left",
                "sprite": "carside_kia.png",
                "scale": 160,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side",
                "model3d" : "sedan05.gltf",
                "colorable" : true
            },
            "carside_sedan_r": {
                "description": "Sedan Right",
                "sprite": "carside_kia2.png",
                "scale": 160,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side",
                "model3d" : "sedan05.gltf",
                "colorable" : true
            },  
            "carside_pickup_l": {
                "description": "Pickup Left",
                "sprite": "carside_ford.png",
                "scale": 210,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side",
                "model3d" : "pickup01.gltf",
                "colorable" : true
            },
            "carside_pickup_r": {
                "description": "Pickup Right",
                "sprite": "carside_ford2.png",
                "scale": 210,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side",
                "model3d" : "pickup01.gltf",
                "colorable" : true
            }, 
            "carangled_minivan1": {
                "description": "Minivan Angle 1",
                "sprite": "minivan_angled1.png",
                "scale": 150,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side",
                "model3d" : "minivan01.gltf",
                "colorable" : true
            },
            "carangled_minivan2": {
                "description": "Minivan Angle 2",
                "sprite": "minivan_angled2.png",
                "scale": 150,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side",
                "model3d" : "minivan01.gltf",
                "colorable" : true
            },
            "carangled_truck1": {
                "description": "Truck Angle 1",
                "sprite": "truck_angled1.png",
                "scale": 210,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },
            "carangled_truck2": {
                "description": "Truck Angle 2",
                "sprite": "truck_angled2.png",
                "scale": 210,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },
            "carangled_hatch1": {
                "description": "Hatchback Angle 1",
                "sprite": "hatchback_angled1.png",
                "scale": 140,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },
            "carangled_hatch2": {
                "description": "Hatchback Angle 2",
                "sprite": "hatchback_angled2.png",
                "scale": 140,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },
            "carangled_30dfl": {
                "description": "Sedan, 30&deg; fl",
                "sprite": "jaguar_30degree_frontleft.png",
                "scale": 153,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },
            "carangled_30dfr": {
                "description": "Sedan, 30&deg; fr",
                "sprite": "jaguar_30degree_frontright.png",
                "scale": 153,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },
            "carangled_30drl": {
                "description": "Sedan, 30&deg; rl",
                "sprite": "jaguar_30degree_rearleft.png",
                "scale": 150,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },
            "carangled_30drr": {
                "description": "Sedan, 30&deg; rr",
                "sprite": "jaguar_30degree_rearright.png",
                "scale": 150,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },
            "carangled_45dfl": {
                "description": "Sedan, 45&deg; fl",
                "sprite": "jaguar_45degree_frontleft.png",
                "scale": 149.6,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },
            "carangled_45dfr": {
                "description": "Sedan, 45&deg; fr",
                "sprite": "jaguar_45degree_frontright.png",
                "scale": 149.6,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },
            "carangled_45drl": {
                "description": "Sedan, 45&deg; rl",
                "sprite": "jaguar_45degree_rearleft.png",
                "scale": 139.4,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },
            "carangled_45drr": {
                "description": "Sedan, 45&deg; rr",
                "sprite": "jaguar_45degree_rearright.png",
                "scale": 139.4,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },  
            "carangled_60dfl": {
                "description": "Sedan, 60&deg; fl",
                "sprite": "jaguar_60degree_frontleft.png",
                "scale": 124,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },   
            "carangled_60dfr": {
                "description": "Sedan, 60&deg; fr",
                "sprite": "jaguar_60degree_frontright.png",
                "scale": 119,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },
            "carangled_60drl": {
                "description": "Sedan, 60&deg; rl",
                "sprite": "jaguar_60degree_rearleft.png",
                "scale": 117,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },
            "carangled_60drr": {
                "description": "Sedan, 60&deg; rr",
                "sprite": "jaguar_60degree_rearright.png",
                "scale": 123.552,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            }, 
            "carangled_90dr": {
                "description": "Sedan, 90&deg; r",
                "sprite": "jaguar_90degree_right.png",
                "scale": 167.2,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },
            "carangled_90dl": {
                "description": "Sedan, 90&deg; l",
                "sprite": "jaguar_90degree_left.png",
                "scale": 167.2,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            }, 
            "train_side": {
                "description": "Train Side",
                "sprite": "train_side.png",
                // "model3d" : "train.gltf",
                "colorable" : false,
                "scale": 678,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "vehicle_side"
            },             
            
            /* TREES */
            
            "tree1": {
                "description": "15' Aspen Tree",
                "sprite": "tree1.gif",
                "scale": 165,
                "scalex": 1,
                "scaley": 1,
                "offsetx": -1.1,
                "offsety": 0,
                "group" : "trees"
            },
            "tree2": {
                "description": "15' Oak Tree",
                "sprite": "tree2.gif",
                "scale": 165,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree3": {
                "description": "15' Maple Tree",
                "sprite": "tree3.gif",
                "scale": 165,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree4": {
                "description": "15' Spruce",
                "sprite": "tree4.gif",
                "scale": 165,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree5": {
                "description": "15' Pine",
                "sprite": "tree5.gif",
                "scale": 165,
                "scalex": 0.7,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree6": {
                "description": "15' Elm",
                "sprite": "tree6.gif",
                "scale": 165,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 11,
                "offsety": 0,
                "group" : "trees"
            },
            "tree7": {
                "description": "18' Young",
                "sprite": "tree7.gif",
                "scale": 198,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_accent_evergreen": {
                "description": "10' Narrow Pine",
                "sprite": "tree_accent_evergreen.png",
                "scale": 128,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_juniper": {
                "description": "10' Juniper",
                "sprite": "tree_juniper.png",
                "scale": 128,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_evergreen01": {
                "description": "Evergreen01",
                "sprite": "tree_evergreen_01.png",
                "scale": 128,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            }, 
            "tree_evergreen02": {
                "description": "Evergreen02",
                "sprite": "tree_evergreen_02.png",
                "scale": 128,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },  
            "tree_evergreen03": {
                "description": "Evergreen03",
                "sprite": "tree_evergreen_03.png",
                "scale": 128,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },  
            "tree_evergreen04": {
                "description": "Evergreen04",
                "sprite": "tree_evergreen_04.png",
                "scale": 128,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },  
            "tree_evergreen05": {
                "description": "Evergreen05",
                "sprite": "tree_evergreen_05.png",
                "scale": 128,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },              
            "tree_decid_med": {
                "description": "12' Young Maple",
                "sprite": "tree_decid_med.png",
                "scale": 150,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_decid_large": {
                "description": "20' Large Elm",
                "sprite": "tree_decid_large.png",
                "scale": 228,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_decid_skinny": {
                "description": "10' Young Elm",
                "sprite": "tree_decid_skinny.png",
                "scale": 120,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            

            "tree_decid_young": {
                "description": "12' Young Maple",
                "sprite": "tree_decid_young.png",
                "scale": 120,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },   
            "tree_decid1": {
                "description": "12' Young Maple",
                "sprite": "tree_decid1.png",
                "scale": 120,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_decid3": {
                "description": "15' Cottonwood",
                "sprite": "tree_decid3.png",
                "scale": 120,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_decid4": {
                "description": "12' Young Deciduous",
                "sprite": "tree_decid4.png",
                "scale": 120,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_elm": {
                "description": "12' Young Elm",
                "sprite": "tree_elm.png",
                "scale": 120,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_evergreen_young": {
                "description": "10' Spruce",
                "sprite": "tree_evergreen_young.png",
                "scale": 100,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_fall": {
                "description": "12' Elm, Fall",
                "sprite": "tree_fall.png",
                "scale": 100,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_giant1": {
                "description": "30' Deciduous",
                "sprite": "tree_giant1.png",
                "scale": 300,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            }, 
            "tree_giant2": {
                "description": "20' Deciduous",
                "sprite": "tree_giant2.png",
                "scale": 250,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 20,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_palm1": {
                "description": "25' Palm #1",
                "sprite": "tree_palm.png",
                "scale": 300,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },              
            "tree_palm2": {
                "description": "25' Palm #2",
                "sprite": "tree_palm2.png",
                "scale": 300,
                "scalex": 1,
                "scaley": 1,
                "offsetx": -20,
                "offsety": 0,
                "group" : "trees"
            },               
            "tree_palm_stubby": {
                "description": "8' Stubby Palm",
                "sprite": "tree_palm_stubby.png",
                "scale": 110,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_sparse": {
                "description": "12' Sparse leaf",
                "sprite": "tree_sparse.png",
                "scale": 140,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            }, 
            "tree_tall": {
                "description": "25' Deciduous",
                "sprite": "tree_tall.png",
                "scale": 280,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_winter": {
                "description": "20' Winter",
                "sprite": "tree_winter.png",
                "scale": 300,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },
            "tree_snowy1": {
                "description": "Tree Snowy 1",
                "sprite": "pine_snowy01.png",
                "scale": 150,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": -5,
                "group" : "trees"
            },
            "tree_snowy2": {
                "description": "Tree Snowy 2",
                "sprite": "pine_snowy02.png",
                "scale": 150,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": -5,
                "group" : "trees"
            }, 
            "tree_snowy3": {
                "description": "Tree Snowy 3",
                "sprite": "pine_snowy03.png",
                "scale": 150,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": -9,
                "group" : "trees"
            }, 
            "tree_snowy4": {
                "description": "Tree Snowy 4",
                "sprite": "deciduous_snowy01.png",
                "scale": 150,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "trees"
            },             
     
             
            
            /* SHRUBS AND PLANTS */
            
            "shrub1": {
                "description": "4' Shrub",
                "sprite": "shrub1.gif",
                "scale": 44,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub2": {
                "description": "6' Narrow Leaf",
                "sprite": "shrub2.gif",
                "scale": 66,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub3": {
                "description": "4' Shrub",
                "sprite": "shrub3.gif",
                "scale": 44,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub4": {
                "description": "6' Shrub",
                "sprite": "shrub4.gif",
                "scale": 66,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub5": {
                "description": "Grass/Lawn",
                "sprite": "shrub5.png",
                "scale": 80,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub6": {
                "description": "6' Shrub",
                "sprite": "shrub6.gif",
                "scale": 66,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub7": {
                "description": "3' Shrub",
                "sprite": "shrub7.gif",
                "scale": 33,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub8": {
                "description": "4' Shrub",
                "sprite": "shrub8.gif",
                "scale": 44,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub9": {
                "description": "6' Shrub",
                "sprite": "shrub9.gif",
                "scale": 66,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": -3,
                "group" : "plants"
            },
            "shrub10": {
                "description": "7' Shrub",
                "sprite": "shrub10.gif",
                "scale": 77,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub11": {
                "description": "6' Shrub",
                "sprite": "shrub11.gif",
                "scale": 66,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub12": {
                "description": "6' Shrub",
                "sprite": "shrub12.gif",
                "scale": 66,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub_barberry": {
                "description": "4' Barberry",
                "sprite": "shrub_barberry.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub_bigleaf": {
                "description": "Small broadleaf",
                "sprite": "shrub_bigleaf.png",
                "scale": 30,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": -7,
                "group" : "plants"
            },
            "shrub_clover": {
                "description": "Clover",
                "sprite": "shrub_clover.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },  
            "shrub_dense": {
                "description": "Dense Shrub",
                "sprite": "shrub_dense.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub_flowers": {
                "description": "Pink Flowers",
                "sprite": "shrub_flowers.png",
                "scale": 25,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },  
            "shrub_grass1": {
                "description": "Grass ball 1",
                "sprite": "shrub_grass1.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },  
            "shrub_grassball": {
                "description": "Grass ball 2",
                "sprite": "shrub_grassball.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },  
            "shrub_hedge": {
                "description": "Hedge",
                "sprite": "shrub_hedge.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },  
            "shrub_ivy": {
                "description": "Ivy",
                "sprite": "shrub_ivy.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },  
            "shrub_juniper1": {
                "description": "Juniper 1",
                "sprite": "shrub_juniper1.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },  
            "shrub_juniper2": {
                "description": "Juniper 2",
                "sprite": "shrub_juniper2.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },  
            "shrub_lavender": {
                "description": "Lavender",
                "sprite": "shrub_lavender.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },  
            "shrub_leafy": {
                "description": "Small leafy plant",
                "sprite": "shrub_leafy.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },  
            "shrub_lungwort": {
                "description": "Lungwort",
                "sprite": "shrub_lungwort.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            }, 
            "shrub_marigold": {
                "description": "Marigold",
                "sprite": "shrub_marigold.png",
                "scale": 15,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub_medleaf": {
                "description": "Short medium-leaf",
                "sprite": "shrub_medleaf.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },
            "shrub_planter1": {
                "description": "Planter 1",
                "sprite": "shrub_planter1.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },   
            "shrub_planter2": {
                "description": "Planter 2",
                "sprite": "shrub_planter2.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            }, 
            "shrub_rose": {
                "description": "Rose bush",
                "sprite": "shrub_rose.png",
                "scale": 90,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            }, 
            "shrub_spirea1": {
                "description": "Spirea 1",
                "sprite": "shrub_spirea.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            }, 
            "shrub_spirea2": {
                "description": "Spirea 2",
                "sprite": "shrub_spirea2.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            }, 
            "shrub_wide": {
                "description": "Short, wide base",
                "sprite": "shrub_wide.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            }, 
            "shrub_willow": {
                "description": "Willow bush",
                "sprite": "shrub_willow.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            }, 
            "shrub_woodrush": {
                "description": "Woodrush",
                "sprite": "shrub_woodrush.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            }, 
            "shrub_young": {
                "description": "Young Leafy",
                "sprite": "shrub_young.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "plants"
            },             
                        
            
            /* PEDESTRIANS */
            
            "ped_woman": {
                "description": "Woman",
                "sprite": "ped_woman.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_woman2": {
                "description": "Woman 2",
                "sprite": "ped_woman2.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_woman_back": {
                "description": "Woman 3",
                "sprite": "ped_woman_back1.png",
                "scale": 60,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped1": {
                "description": "Couple, Back",
                "sprite": "ped1.gif",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_couple1": {
                "description": "Couple, Back 2",
                "sprite": "ped_couple1.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_couple2": {
                "description": "Couple, Front",
                "sprite": "ped_couple2.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_family1": {
                "description": "Family Group",
                "sprite": "ped_family1.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_family2": {
                "description": "Mother/Daughter",
                "sprite": "ped_family2.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_side1": {
                "description": "Side, Dog Walking",
                "sprite": "ped_side1.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_side2": {
                "description": "Side, Man Standing",
                "sprite": "ped_side2.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },              
            "ped2": {
                "description": "Man",
                "sprite": "ped2.gif",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_kids": {
                "description": "Kids",
                "sprite": "ped_kids_back.png",
                "scale": 48,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_barefoot": {
                "description": "Barefoot",
                "sprite": "ped_girl_barefoot.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_barefoot": {
                "description": "Barefoot",
                "sprite": "ped_girl_barefoot.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_back_couple_div01": {
                "description": "Couple Back 3",
                "sprite": "ped_back_couple_div01.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_back_div01": {
                "description": "Back 5",
                "sprite": "ped_back_div01.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_back_div02": {
                "description": "Back 6",
                "sprite": "ped_back_div02.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_back_div03": {
                "description": "Back 7",
                "sprite": "ped_back_div03.png",
                "scale": 61,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },              
            "ped_back_div04": {
                "description": "Back 8",
                "sprite": "ped_back_div04.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_couple_div01": {
                "description": "Front 5",
                "sprite": "ped_couple_div01.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_family_div01": {
                "description": "Front Family 2",
                "sprite": "ped_family_div01.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_front_blind": {
                "description": "Front, Blind",
                "sprite": "ped_front_blind.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_front_div01": {
                "description": "Front 6",
                "sprite": "ped_front_div01.png",
                "scale": 63.7,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_front_div02": {
                "description": "Front 7",
                "sprite": "ped_front_div02.png",
                "scale": 61.1,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_front_div03": {
                "description": "Front 8",
                "sprite": "ped_front_div03.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_front_div04": {
                "description": "Front 9",
                "sprite": "ped_front_div04.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_front_div05": {
                "description": "Front 10",
                "sprite": "ped_front_div05.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_front_div06": {
                "description": "Front 11",
                "sprite": "ped_front_div06.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_front_div07": {
                "description": "Front 12",
                "sprite": "ped_front_div07.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_front_div08": {
                "description": "Front 13",
                "sprite": "ped_front_div08.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_group_div01": {
                "description": "Group Front4",
                "sprite": "ped_group_div01.png",
                "scale": 81.25,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_group_div02": {
                "description": "Group Rear",
                "sprite": "ped_group_div02.png",
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_hoverboard": {
                "description": "Hoverboard",
                "sprite": "ped_hoverboard.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_jogging_div01": {
                "description": "Jogging",
                "sprite": "ped_jogging_div01.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_side_div01": {
                "description": "Side 3",
                "sprite": "ped_side_div01.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "ped_side_div02": {
                "description": "Side 4",
                "sprite": "ped_side_div02.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },            
            "bikeback": {
                "description": "Cyclist, Back",
                "sprite": "bikeback.gif",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "bikefront": {
                "description": "Cyclist, Front",
                "sprite": "bikefront.gif",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_back_cyclist02": {
                "description": "Cyclist Back 2",
                "sprite": "ped_back_cyclist02.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            }, 
            "ped_cyclist_front2": {
                "description": "Cyclist Front 2",
                "sprite": "ped_cyclist_front01.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },             
            "ped_cyclist_side01": {
                "description": "Cyclist Side 1",
                "sprite": "ped_cyclist_side01.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "ped_side_bike_div01": {
                "description": "Cyclist Side 2",
                "sprite": "ped_side_bike_div01.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "equestrian": {
                "description": "Equestrian",
                "sprite": "equestrian.png",
                "scale": 95.0,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },
            "equestrian2": {
                "description": "Equestrian Backside",
                "sprite": "equestrian_back.png",
                "scale": 95.0,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },   
            "ped_skier01": {
                "description": "Skier 1",
                "sprite": "pedestrian_skier01.png",
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": -3,
                "group" : "peds"
            },
            "ped_skier02": {
                "description": "Skier 2",
                "sprite": "pedestrian_skier02.png",
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },         
            "ped_skier03": {
                "description": "Skier 3",
                "sprite": "pedestrian_skier03.png",
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },         
            "ped_skier04": {
                "description": "Skier 4",
                "sprite": "pedestrian_skier04.png",
                "scale": 70,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },         
            "ped_skier05": {
                "description": "Skier 5",
                "sprite": "pedestrian_skier05.png",
                "scale": 65,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },         
            "ped_skier06": {
                "description": "Skier 6",
                "sprite": "pedestrian_skier06.png",
                "scale": 65,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "peds"
            },                     
            
            /* STREET FURNITURE */
         
            "lightpole_cobra1_lt": {
                "description": "Cobra Left 1",
                "sprite": "lightpole_cobra1_lt.png",
                "scale": 230,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "lightpole_cobra1_rt": {
                "description": "Cobra Right 1",
                "sprite": "lightpole_cobra1_rt.png",
                "scale": 230,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "lightpole_cobra2_short_lt": {
                "description": "Cobra Short Left",
                "sprite": "lightpole_cobra2_short_lt.png",
                "scale": 165,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "lightpole_cobra2_short_rt": {
                "description": "Cobra Short Right",
                "sprite": "lightpole_cobra2_short_rt.png",
                "scale": 165,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            }, 
            "lightpole_cobra2_tall_lt": {
                "description": "Cobra Left 2",
                "sprite": "lightpole_cobra2_tall_lt.png",
                "scale": 230,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            }, 
            "lightpole_cobra2_tall_rt": {
                "description": "Cobra Right 2",
                "sprite": "lightpole_cobra2_tall_rt.png",
                "scale": 2301,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },             
            "lamppost1": {
                "description": "Lamp, double",
                "sprite": "lamppost1.gif",
                "scale": 165,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "lamppost2": {
                "description": "Lamp, traditional",
                "sprite": "lamppost2.gif",
                "scale": 165,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "lamppost3": {
                "description": "Lamp, Globe",
                "sprite": "lamppost3.png",
                "scale": 165,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "lamppost4": {
                "description": "Lamp, Lantern",
                "sprite": "lamppost4.png",
                "scale": 165,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "lamppost5": {
                "description": "Lamp, Teardrop",
                "sprite": "lamppost5.png",
                "scale": 165,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            }, 
            "lamppost6": {
                "description": "Lamp, Decorative",
                "sprite": "lamp_decorative_01.png",
                "scale": 190,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            }, 	
            "bench_sitting1": {
                "description": "Bench & Man 1",
                "sprite": "man_sitting_left.png",
                "scale": 47,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "bench_sitting2": {
                "description": "Bench & Man 2",
                "sprite": "man_sitting_right.png",
                "scale": 47,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },	
            "trashcan": {
                "description": "Trash",
                "sprite": "trashcan.png",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },	
            "bench_right": {
                "description": "Bench 1",
                "sprite": "bench_right.png",
                "scale": 30,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "bench_left": {
                "description": "Bench 2",
                "sprite": "bench_left.png",
                "scale": 30,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "bollard1": {
                "description": "Lit Bollard",
                "sprite": "bollard_lit.png",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },	
            "planterbox01": {
                "description": "Planter Box 1",
                "sprite": "planterbox01.png",
                "scale": 43,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },	
            "planterbox02": {
                "description": "Planter Box 2",
                "sprite": "planterbox02.png",
                "scale": 58,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "bench_flat": {
                "description": "Bench flat",
                "sprite": "bench_flat.png",
                "scale": 24,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },	
            "treeguard": {
                "description": "Tree Guard",
                "sprite": "treeguard.png",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },				
            "busstop1_left": {
                "description": "Bus Stop, Left",
                "sprite": "busstop1_left.png",
                "scale": 150,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "busstop1_right": {
                "description": "Bus Stop, Right",
                "sprite": "busstop1_right.png",
                "scale": 150,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            }, 
            "house_front": {
                "description": "House Front",
                "sprite": "bldg_house_01.png",
                "scale": 450,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "house_left": {
                "description": "House Left",
                "sprite": "bldg_house_02_L.png",
                "scale": 450,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "house_right": {
                "description": "House Right",
                "sprite": "bldg_house_02_R.png",
                "scale": 450,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            }, 
            "house_left_2story_l": {
                "description": "House 2ST L",
                "sprite": "house_2story_l.png",
                "scale": 396,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "house_left_2story_r": {
                "description": "House 2ST R",
                "sprite": "house_2story_r.png",
                "scale": 396,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },   
            "house_left_2story_l_fade": {
                "description": "House 2ST L F",
                "sprite": "house_2story_half_l.png",
                "scale": 297,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "house_left_2story_r_fade": {
                "description": "House 2ST R F",
                "sprite": "house_2story_half_r.png",
                "scale": 297,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },              
             
            "building_front": {
                "description": "Building Front",
                "sprite": "bldg_com_01.png",
                "scale": 450,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            }, 
            "building_left": {
                "description": "Building Left",
                "sprite": "bldg_com_02_l.png",
                "scale": 450,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            }, 
            "building_right": {
                "description": "Building Right",
                "sprite": "bldg_com_02_r.png",
                "scale": 450,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "building_faded_right": {
                "description": "Building Faded, Right",
                "sprite": "bldg_com_fade_r.png",
                "scale": 250,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },  
            "building_faded_left": {
                "description": "Building Faded, Left",
                "sprite": "bldg_com_fade_l.png",
                "scale": 250,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "house_faded_right": {
                "description": "House Faded Right",
                "sprite": "bldg_house_fade_R.png",
                "scale": 200,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },
            "house_faded_left": {
                "description": "House Faded Left",
                "sprite": "bldg_house_fade_l.png",
                "scale": 200,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "streetfurniture"
            },              
            
            /* MISC & OTHER */
            "utility_pole": {
                "description": "Utility Pole",
                "sprite": "utilitypole.png",
                "scale": 290,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },               
            
			"sign_pedpath": {
                "description": "Ped Sign 1",
                "sprite": "sign_pedpath.png",
                "scale": 42,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
			"krail": {
                "description": "K Rail",
                "sprite": "krail.png",
                "scale": 36,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },            
			"guard01": {
                "description": "Guard Rail Wood",
                "sprite": "guardrail_wood.png",
                "scale": 36,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            }, 
			"guard01_rt": {
                "description": "GuardRail Wood Rt",
                "sprite": "guardrail_wood_r.png",
                "scale": 36,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },             
			"guard02": {
                "description": "Guard Rail Double",
                "sprite": "guardrail_double.png",
                "scale": 36,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },  
			"guard03": {
                "description": "Guard Rail Flagged",
                "sprite": "guardrail_flag.png",
                "scale": 36,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
			"guard03_rt": {
                "description": "GuardRail Flag Rt",
                "sprite": "guardrail_flag_r.png",
                "scale": 36,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            }, 
			"guard04": {
                "description": "Guard Rail Round",
                "sprite": "guardrail_roundcap.png",
                "scale": 36,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },               
			"guard04_rt": {
                "description": "GuardRail Round Rt",
                "sprite": "guardrail_roundcap_r.png",
                "scale": 36,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
			"guard05": {
                "description": "GuardRail Plain",
                "sprite": "guardrail_round_plain.png",
                "scale": 36,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
			"guard05_rt": {
                "description": "GuardRail Plain Rt",
                "sprite": "guardrail_round_plain_r.png",
                "scale": 36,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },            
            "fence1": {
                "description": "Splitrail Fence 1",
                "sprite": "fence_splitrail01.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "fence2": {
                "description": "Splitrail Fence 2",
                "sprite": "fence_splitrail02.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "fence3": {
                "description": "Splitrail Fence 3",
                "sprite": "fence_splitrail03.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "fence4": {
                "description": "Splitrail Fence 4",
                "sprite": "fence_splitrail04.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            }, 
            "fence_iron1": {
                "description": "Iron Fence Front 1",
                "sprite": "fence_iron01_front.png",
                "scale": 80,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "fence_iron2": {
                "description": "Iron Fence Front 2",
                "sprite": "fence_iron02_front.png",
                "scale": 80,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            }, 
            "fence_chainlink": {
                "description": "Chainlink Front",
                "sprite": "fence_chainlink_front.png",
                "scale": 112,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "fence_chainpost": {
                "description": "Chainlink Side",
                "sprite": "fence_chainlink_post.png",
                "scale": 67,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },              
            "misc_bird1": {
                "description": "Bird",
                "sprite": "misc_bird1.png",
                "scale": 12,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 200.1,
                "group" : "other"
            }, 
            "misc_bird2": {
                "description": "Bird Group",
                "sprite": "misc_bird2.png",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 201.1,
                "group" : "other"
            },
            "misc_freedombird": {
                "description": "FREEDOM!",
                "sprite": "misc_FREEDOM.png",
                "scale": 25,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 201.1,
                "group" : "other"
            },
            "misc_dog1": {
                "description": "Dog 1",
                "sprite": "misc_dog1.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 13,
                "group" : "other"
            },
            "misc_dog2": {
                "description": "Dog 2",
                "sprite": "misc_dog2.png",
                "scale": 40,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 4,
                "group" : "other"
            },
            "misc_hydrant": {
                "description": "Fire Hydrant",
                "sprite": "misc_hydrant.png",
                "scale": 30,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 2,
                "group" : "other"
            },            
            "misc_flagpole": {
                "description": "Flag Pole",
                "sprite": "misc_flagpole.png",
                "scale": 300,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 30,
                "offsety": 1.1,
                "group" : "other"
            },
            "misc_rocks": {
                "description": "Rocks",
                "sprite": "riprap.png",
                "scale": 150,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "snowpile": {
                "description": "Snow Pile",
                "sprite": "snowpile.png",
                "scale": 150,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },			
            "misc_boulder2": {
                "description": "Boulder 2",
                "sprite": "misc_boulder2.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            }, 
            "misc_boulder3": {
                "description": "Boulder 3",
                "sprite": "misc_boulder3.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },  
            "misc_boulder5": {
                "description": "Boulder 5",
                "sprite": "misc_boulder5.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "misc_boulder6": {
                "description": "Boulder 6",
                "sprite": "misc_boulder6.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "misc_boulder8": {
                "description": "Boulder 8",
                "sprite": "misc_boulder8.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "misc_boulder12": {
                "description": "Boulder 12",
                "sprite": "misc_boulder12.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "misc_boulder13": {
                "description": "Boulder 13",
                "sprite": "misc_boulder13.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "misc_boulder14": {
                "description": "Boulder 14",
                "sprite": "misc_boulder14.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "misc_boulder15": {
                "description": "Boulder 15",
                "sprite": "misc_boulder15.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "misc_boulder16": {
                "description": "Boulder 16",
                "sprite": "misc_boulder16.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "misc_boulder18": {
                "description": "Boulder 18",
                "sprite": "misc_boulder18.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "misc_boulder19": {
                "description": "Boulder 19",
                "sprite": "misc_boulder19.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "misc_dirtslope_l": {
                "description": "Dirt Slope L",
                "sprite": "dirtslope_left.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            }, 
            "misc_dirtslope_r": {
                "description": "Dirt Slope R",
                "sprite": "dirtslope_right.png",
                "scale": 50,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },               
            "misc_measure": {
                "description": "10 ft Ruler",
                "sprite": "ruler.svg",
                "scale": 110,
                "scalex": 1,
                "scaley": 1,
                "offsetx": -1,
                "offsety": 0,
                "group" : "other"
            },  
            "tent_1": {
                "description": "Tent 1",
                "sprite": "tent01.png",
                "scale": 104,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            }, 
            "tent_2": {
                "description": "Tent 2",
                "sprite": "tent02.png",
                "scale": 104,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            }, 
            "tent_3": {
                "description": "Tent 3",
                "sprite": "tent03.png",
                "scale": 136,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },
            "garbage": {
                "description": "Garbage",
                "sprite": "garbage.png",
                "scale": 64.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },  
            "shopping_cart": {
                "description": "Shopping Cart",
                "sprite": "shoppingcart.png",
                "scale": 32.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 0,
                "group" : "other"
            },  
            "boat_motor": {
                "description": "Motorboat",
                "sprite": "motorboat.png",
                "scale": 232.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 20,
                "group" : "other"
            },   
            "boat_sail": {
                "description": "Sailboat",
                "sprite": "sailboat.png",
                "scale": 232.9,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 30,
                "group" : "other"
            },                                            
            /* Markings and symbols */
            "Blank_Sign": {
                "description": "Blank Sign",
                "sprite": "sym_blanksign.svg",
                "scale": 45,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 105,
                "group" : "markings"
            }, 
            
            "OneWay_Left": {
                "description": "One Way, Left",
                "sprite": "sym_oneway_left.svg",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 100,
                "group" : "markings"
            },
            "OneWay_Right": {
                "description": "One Way, Right",
                "sprite": "sym_oneway_right.svg",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 100,
                "group" : "markings"
            },
            "No_turn1": {
                "description": "Straight Only, Up",
                "sprite": "sym_straight.svg",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 100,
                "group" : "markings"
            },
            "No_turn2": {
                "description": "Straight Only, Down",
                "sprite": "sym_straight2.svg",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 100,
                "group" : "markings"
            },              
            "Straight_LeftOnly": {
                "description": "Straight/Left Only",
                "sprite": "sym_straight_turnleft.svg",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 100,
                "group" : "markings"
            },
            "Straight_RightOnly": {
                "description": "Straight/Right Only",
                "sprite": "sym_straight_turnright.svg",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 100,
                "group" : "markings"
            }, 
            "Median_Turnlane": {
                "description": "Median Turn Lane",
                "sprite": "sym_turnboth.svg",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 100,
                "group" : "markings"
            },
            "Left_Turn": {
                "description": "Left Turn",
                "sprite": "sym_turn_left.svg",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 100,
                "group" : "markings"
            },
            "Left_Turn_Curve": {
                "description": "Left Turn Curve",
                "sprite": "sym_turnlane_left.svg",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 100,
                "group" : "markings"
            },                
            "Right_Turn": {
                "description": "Right Turn",
                "sprite": "sym_turn_right.svg",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 100,
                "group" : "markings"
            },
            "Right_Turn_Curve": {
                "description": "Right Turn Curve",
                "sprite": "sym_turnlane_right.svg",
                "scale": 35,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": 100,
                "group" : "markings"
            }, 
            "Stripe_Yellow": {
                "description": "Yellow Stripe",
                "sprite": "stripe_yellow.jpg",
                "scale": 21,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": -16,
                "group" : "markings"
            },
            "Stripe_White": {
                "description": "White Stripe",
                "sprite": "stripe_white.jpg",
                "scale": 21,
                "scalex": 1,
                "scaley": 1,
                "offsetx": 0,
                "offsety": -16,
                "group" : "markings"
            },               
        }
    }
    
    // END OF SPRITE DEFINITIONS
}


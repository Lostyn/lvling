const ZoneToAct = [
    [ "The Twilight Strand", "The Coast", "The Tidal Island", "The Mud Flats", "The Fetid Pool", "The Submerged Passage", "The Flooded Depths", "The Ledge", "The Climb", "The Lower Prison", "The Upper Prison", "Prisoner's Gate", "The Ship Graveyard", "The Cavern of Wrath", "The Ship Graveyard Cave", "The Cavern of Anger", "Lioneye's Watch" ],
    [ "The Southern Forest", "The Old Fields", "The Den", "The Crossroads", "The Chamber of Sins Level 1", "The Riverways", "The Fellshrine Ruins", "The Broken Bridge", "The Chamber of Sins Level 2", "The Crypt Level 1", "The Western Forest", "The Weaver's Chambers", "The Crypt Level 2", "The Wetlands", "The Vaal Ruins", "The Dread Thicket", "The Northern Forest", "The Caverns", "The Ancient Pyramid", "The Forest Encampment" ],
    [ "The City of Sarn", "The Slums", "The Crematorium", "The Sewers", "The Marketplace", "The Catacombs", "The Battlefront", "The Solaris Temple Level 1", "The Solaris Temple Level 2", "The Ebony Barracks", "The Lunaris Temple Level 1", "The Docks", "The Lunaris Temple Level 2", "The Imperial Gardens", "The Library", "The Archives", "The Sceptre of God", "The Upper Sceptre of God", "The Sarn Encampment" ],
    [ "The Aqueduct", "The Dried Lake", "The Mines Level 1", "The Mines Level 2", "The Crystal Veins", "Kaom's Dream", "Daresso's Dream", "Kaom's Stronghold", "The Grand Arena", "The Belly of the Beast Level 1", "The Belly of the Beast Level 2", "The Harvest", "The Ascent", "Highgate" ],
    [ "The Slave Pens", "The Control Blocks", "Oriath Square", "The Templar Courts", "The Chamber of Innocence", "The Ruined Square", "The Torched Courts", "The Ossuary", "The Reliquary", "The Cathedral Rooftop", "Overseer's Tower" ],
    [ "The Twilight Strand", "The Coast", "The Tidal Island", "The Mud Flats", "The Karui Fortress", "The Ridge", "The Lower Prison", "Shavronne's Tower", "Prisoner's Gate", "The Riverways", "The Wetlands", "The Western Forest", "The Southern Forest", "The Cavern of Anger", "The Beacon", "The Brine King's Reef", "Lioneye's Watch" ],
    [ "The Broken Bridge", "The Crossroads", "The Fellshrine Ruins", "The Crypt", "The Chamber of Sins Level 1", "The Chamber of Sins Level 2", "Maligaro's Sanctum", "The Den", "The Ashen Fields", "The Northern Forest", "The Dread Thicket", "The Causeway", "The Vaal City", "The Temple of Decay Level 1", "The Temple of Decay Level 2", "The Bridge Encampment" ],
    [ "The Sarn Ramparts", "The Toxic Conduits", "Doedre's Cesspool", "The Grand Promenade", "The Bath House", "The Quay", "The Grain Gate", "The Imperial Fields", "The Solaris Concourse", "The High Gardens", "The Lunaris Concourse", "The Solaris Temple Level 1", "The Solaris Temple Level 2", "The Lunaris Temple Level 1", "The Lunaris Temple Level 2", "The Harbour Bridge", "The Sarn Encampment" ],
    [ "The Blood Aqueduct", "The Descent", "The Vastiri Desert", "The Oasis", "The Foothills", "The Boiling Lake", "The Tunnel", "The Belly of the Beast", "The Quarry", "The Refinery", "The Rotting Core", "Highgate" ],
    [ "The Cathedral Rooftop", "The Ravaged Square", "The Torched Courts", "The Desecrated Chambers", "The Canals", "The Control Blocks", "The Feeding Trough", "The Reliquary", "The Ossuary", "Oriath Docks" ]
]

const TownToAct = [
    "Lioneye's Watch" ,
    "The Forest Encampment",
    "The Sarn Encampment",
    "Highgate",
    "Overseer's Tower",
    "Lioneye's Watch",
    "The Bridge Encampment",
    "The Sarn Encampment",
    "Highgate",
    "Oriath Docks"
]

export function findActFromTown(town: string) : string {
    return "Act " + (TownToAct.findIndex( o => o === town) + 1);
}

export function findActFromZone(zone: string) : string {
    return "Act " + (ZoneToAct.findIndex( o => o.includes(zone)) + 1);
}
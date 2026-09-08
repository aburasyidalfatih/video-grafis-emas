export interface GoldgenTopic {
  id: number;
  headline: string;
  subtitle: string;
  category: 'River & Placer' | 'Rocks & Minerals' | 'Equipment & Tools' | 'Geology & Formations' | 'History & Field Knowledge';
  list_header: string;
  list_points: string[];
}

export function formatTopicToIdea(topic: GoldgenTopic): string {
  const points = (topic.list_points || []).map(p => p.trim().replace(/\.$/, '')).join(', ');
  return `${topic.headline}: ${topic.subtitle} — Key Indicators: ${points}`;
}

export const GOLDGEN_TOPICS: GoldgenTopic[] = [
  {
    "id": 999,
    "headline": "MINI-GAME: SPOT THE GOLD",
    "subtitle": "Test your prospector eyes! Can you spot the hidden nugget?",
    "category": "History & Field Knowledge",
    "list_header": "HOW TO PLAY",
    "list_points": [
      "Inspect the labeled illustration.",
      "Explain which visual clue you noticed.",
      "Include the explanation in this post.",
      "An illustration cannot confirm a real mineral specimen."
    ]
  },
  {
    "id": 1,
    "headline": "READING THE RIVER",
    "subtitle": "Gold drops where water slows down.",
    "category": "River & Placer",
    "list_header": "KEY DEPOSIT ZONES",
    "list_points": [
      "Inside bends (Low Pressure Zone)",
      "Behind large boulders (Eddies)",
      "Bedrock cracks (Natural Riffles)",
      "Moss roots (Fine Gold Traps)"
    ]
  },
  {
    "id": 2,
    "headline": "BEDROCK TRAPS",
    "subtitle": "Bedrock Cracks: Places to Test, Not Promises of Gold",
    "category": "River & Placer",
    "list_header": "OBSERVE, TEST, AND COMPARE",
    "list_points": [
      "Describe cracks, depressions and rough bedrock as possible physical traps.",
      "Explain the local geometry without inventing chemical-trap mechanisms.",
      "Compare small accessible samples and record the observations.",
      "A promising shape does not establish gold presence."
    ]
  },
  {
    "id": 3,
    "headline": "QUARTZ INDICATORS",
    "subtitle": "Rusty and rotten holds the fortune.",
    "category": "Rocks & Minerals",
    "list_header": "WHAT TO LOOK FOR",
    "list_points": [
      "Iron staining (Red/Orange Oxide)",
      "Boxwork texture (Honeycombed)",
      "Sulfide presence (Pyrite/Arsenopyrite)",
      "Fractured structure (Not solid white)"
    ]
  },
  {
    "id": 4,
    "headline": "IRON STAINING",
    "subtitle": "Rust is the color of money.",
    "category": "Rocks & Minerals",
    "list_header": "OXIDATION SIGNS",
    "list_points": [
      "Red Hematite stains",
      "Orange Limonite crusts",
      "Black Manganese coatings",
      "Gossan caps on veins"
    ]
  },
  {
    "id": 5,
    "headline": "BLACK SAND SECRETS",
    "subtitle": "Black Sand but No Gold: What Should You Check Next?",
    "category": "Rocks & Minerals",
    "list_header": "OBSERVE, TEST, AND COMPARE",
    "list_points": [
      "Black sands can contain several heavy minerals, not only magnetite.",
      "Magnetic separation does not identify every mineral in the remaining concentrate.",
      "Black sand is a reason to sample, not proof of gold.",
      "Keep samples labeled and compare observations before drawing a conclusion."
    ]
  },
  {
    "id": 6,
    "headline": "GOLD VS PYRITE",
    "subtitle": "Is It Gold, Pyrite, or Mica? What a Photo Cannot Prove",
    "category": "Rocks & Minerals",
    "list_header": "OBSERVE, TEST, AND COMPARE",
    "list_points": [
      "Pyrite, chalcopyrite and weathered mica can resemble gold.",
      "Appearance in a picture is a clue, not a confirmed identification.",
      "Gold is malleable; brittle look-alikes behave differently under appropriate physical tests.",
      "For uncertain or valuable specimens, seek qualified identification rather than a confident photo diagnosis."
    ]
  },
  {
    "id": 7,
    "headline": "ANCIENT CHANNELS",
    "subtitle": "High benches hold forgotten wealth.",
    "category": "River & Placer",
    "list_header": "LOCATING BENCHES",
    "list_points": [
      "Rounded river rocks on hillsides",
      "Flat distinct terraces above river",
      "Color change in soil layers",
      "Old vegetation lines"
    ]
  },
  {
    "id": 8,
    "headline": "PLACER VS LODE",
    "subtitle": "Tracking the source upstream.",
    "category": "River & Placer",
    "list_header": "DEPOSIT TYPES",
    "list_points": [
      "Placer: Rounded & Smooth (Water worn)",
      "Lode: Jagged & Rough (Near source)",
      "Placer: Riverbeds & Benches",
      "Lode: Veins & Hard Rock"
    ]
  },
  {
    "id": 9,
    "headline": "RUBY COMPANIONS",
    "subtitle": "Garnets signal heavy ground.",
    "category": "Rocks & Minerals",
    "list_header": "IDENTIFICATION",
    "list_points": [
      "Deep red color",
      "Glassy luster",
      "Often dodecahedral shape",
      "Found with black sand"
    ]
  },
  {
    "id": 10,
    "headline": "FALSE BEDROCK",
    "subtitle": "Clay layers trap gold too.",
    "category": "River & Placer",
    "list_header": "CLAY SIGNS",
    "list_points": [
      "Impermeable sticky layer",
      "Blue or grey color often",
      "Gold sits ON TOP of it",
      "Don't dig through it!"
    ]
  },
  {
    "id": 11,
    "headline": "SULFIDES",
    "subtitle": "The invisible gold host.",
    "category": "Rocks & Minerals",
    "list_header": "KEY SULFIDE MINERALS",
    "list_points": [
      "Pyrite (Iron sulfide - Gold carrier)",
      "Arsenopyrite (Arsenic-iron sulfide)",
      "Chalcopyrite (Copper-iron sulfide)",
      "Pyrrhotite (Magnetic iron sulfide)"
    ]
  },
  {
    "id": 12,
    "headline": "GOSSAN CAPS",
    "subtitle": "The rusty hat of a gold vein.",
    "category": "Rocks & Minerals",
    "list_header": "GOSSAN INDICATORS",
    "list_points": [
      "Iron oxide cap (Rusty red/brown)",
      "Porous boxwork texture",
      "Sits above sulfide zone",
      "Limonite and hematite rich"
    ]
  },
  {
    "id": 13,
    "headline": "CONTACT ZONES",
    "subtitle": "Where geology changes.",
    "category": "Geology & Formations",
    "list_header": "CONTACT TYPES",
    "list_points": [
      "Intrusive-sedimentary contacts",
      "Limestone-granite boundaries",
      "Dike-host rock interfaces",
      "Metamorphic grade changes"
    ]
  },
  {
    "id": 14,
    "headline": "FAULT LINES",
    "subtitle": "Nature's gold plumbing.",
    "category": "Geology & Formations",
    "list_header": "FAULT ZONE FEATURES",
    "list_points": [
      "Crushed rock (Breccia zones)",
      "Quartz veins along fault",
      "Slickensides (Polished surfaces)",
      "Clay gouge (Fault filling)"
    ]
  },
  {
    "id": 15,
    "headline": "SKARN DEPOSITS",
    "subtitle": "Gold in limestone.",
    "category": "Geology & Formations",
    "list_header": "SKARN MINERALS",
    "list_points": [
      "Garnet (Red-brown crystals)",
      "Epidote (Green alteration)",
      "Magnetite (Black magnetic)",
      "Calcite replacement zones"
    ]
  },
  {
    "id": 16,
    "headline": "PORPHYRY SYSTEMS",
    "subtitle": "Low grade, huge tonnage.",
    "category": "Geology & Formations",
    "list_header": "PORPHYRY INDICATORS",
    "list_points": [
      "Stockwork vein networks",
      "Disseminated sulfides",
      "Potassic alteration (Pink)",
      "Large intrusive body"
    ]
  },
  {
    "id": 17,
    "headline": "EPITHERMAL VEINS",
    "subtitle": "Boiling zone bonanzas.",
    "category": "Geology & Formations",
    "list_header": "EPITHERMAL TEXTURES",
    "list_points": [
      "Banded quartz (Crustiform)",
      "Bladed calcite (After boiling)",
      "Colloform banding",
      "Platy calcite pseudomorphs"
    ]
  },
  {
    "id": 18,
    "headline": "GREENSTONE BELTS",
    "subtitle": "Ancient volcanic gold.",
    "category": "Geology & Formations",
    "list_header": "GREENSTONE FEATURES",
    "list_points": [
      "Metamorphosed volcanics",
      "Chlorite-rich (Green color)",
      "Shear zone hosted",
      "Archean age rocks"
    ]
  },
  {
    "id": 19,
    "headline": "SLATE BELTS",
    "subtitle": "The nugget factories.",
    "category": "Geology & Formations",
    "list_header": "SLATE BELT SIGNS",
    "list_points": [
      "Fine-grained metamorphic rock",
      "Quartz veins cutting slate",
      "Coarse gold common",
      "Historic mining areas"
    ]
  },
  {
    "id": 20,
    "headline": "GLACIAL GOLD",
    "subtitle": "Moraines and flour gold.",
    "category": "History & Field Knowledge",
    "list_header": "GLACIAL INDICATORS",
    "list_points": [
      "Rounded boulders (Glacial till)",
      "Fine flour gold",
      "Erratic gold distribution",
      "Moraine deposits"
    ]
  },
  {
    "id": 21,
    "headline": "DESERT PROSPECTING",
    "subtitle": "Dry washing tactics.",
    "category": "Equipment & Tools",
    "list_header": "DRY WASHING METHODS",
    "list_points": [
      "Dry washer equipment",
      "Wind classification",
      "Desert pavement indicators",
      "Arroyo concentrations"
    ]
  },
  {
    "id": 22,
    "headline": "BEACH PLACERS",
    "subtitle": "Wave action gold.",
    "category": "River & Placer",
    "list_header": "BEACH GOLD ZONES",
    "list_points": [
      "Black sand layers",
      "Storm berms",
      "Bedrock outcrops",
      "Tidal concentration zones"
    ]
  },
  {
    "id": 23,
    "headline": "ELUVIAL DEPOSITS",
    "subtitle": "Gold that hasn't moved.",
    "category": "Geology & Formations",
    "list_header": "ELUVIAL CHARACTERISTICS",
    "list_points": [
      "Angular gold pieces",
      "Still near source vein",
      "Weathered host rock",
      "Hillside deposits"
    ]
  },
  {
    "id": 24,
    "headline": "RESIDUAL DEPOSITS",
    "subtitle": "Weathered in place.",
    "category": "History & Field Knowledge",
    "list_header": "RESIDUAL FEATURES",
    "list_points": [
      "Laterite soil profile",
      "Gold enrichment at depth",
      "Tropical weathering",
      "Iron-rich surface"
    ]
  },
  {
    "id": 25,
    "headline": "SPECIFIC GRAVITY",
    "subtitle": "Why gold sinks.",
    "category": "Rocks & Minerals",
    "list_header": "DENSITY COMPARISON",
    "list_points": [
      "Gold: 19.3 g/cm³",
      "Magnetite: 5.2 g/cm³",
      "Quartz: 2.65 g/cm³",
      "Water: 1.0 g/cm³"
    ]
  },
  {
    "id": 26,
    "headline": "THE STREAK TEST",
    "subtitle": "Gold vs. Chalcopyrite.",
    "category": "Rocks & Minerals",
    "list_header": "STREAK COLORS",
    "list_points": [
      "Gold: Golden yellow streak",
      "Chalcopyrite: Greenish-black streak",
      "Pyrite: Greenish-black streak",
      "Use unglazed porcelain"
    ]
  },
  {
    "id": 27,
    "headline": "ARSENOPYRITE",
    "subtitle": "The garlic-smelling indicator.",
    "category": "Rocks & Minerals",
    "list_header": "ARSENOPYRITE SIGNS",
    "list_points": [
      "Silvery metallic luster",
      "Garlic smell when struck",
      "Often gold-bearing",
      "Orthorhombic crystals"
    ]
  },
  {
    "id": 28,
    "headline": "GALENA",
    "subtitle": "Silver-lead and gold friends.",
    "category": "Rocks & Minerals",
    "list_header": "GALENA INDICATORS",
    "list_points": [
      "Cubic cleavage (Perfect cubes)",
      "Lead-gray metallic",
      "Often with silver and gold",
      "Heavy mineral"
    ]
  },
  {
    "id": 29,
    "headline": "MAGNETITE VS HEMATITE",
    "subtitle": "Know your irons.",
    "category": "Rocks & Minerals",
    "list_header": "IRON OXIDE TYPES",
    "list_points": [
      "Magnetite: Black, magnetic",
      "Hematite: Red-brown, non-magnetic",
      "Magnetite: Fe3O4",
      "Hematite: Fe2O3"
    ]
  },
  {
    "id": 30,
    "headline": "SERPENTINE ROCK",
    "subtitle": "The green host.",
    "category": "Rocks & Minerals",
    "list_header": "SERPENTINE FEATURES",
    "list_points": [
      "Green waxy appearance",
      "Slippery feel",
      "Altered ultramafic rock",
      "Often with chromite"
    ]
  },
  {
    "id": 31,
    "headline": "CALCITE VS QUARTZ",
    "subtitle": "The acid test.",
    "category": "Rocks & Minerals",
    "list_header": "IDENTIFICATION TESTS",
    "list_points": [
      "Calcite: Fizzes in acid",
      "Quartz: No reaction",
      "Calcite: Softer (H=3)",
      "Quartz: Harder (H=7)"
    ]
  },
  {
    "id": 32,
    "headline": "BOXWORK TEXTURE",
    "subtitle": "Where sulfides used to be.",
    "category": "Rocks & Minerals",
    "list_header": "BOXWORK INDICATORS",
    "list_points": [
      "Honeycomb pattern",
      "Iron oxide framework",
      "Former sulfide location",
      "Porous structure"
    ]
  },
  {
    "id": 33,
    "headline": "BOILING ZONES",
    "subtitle": "Textures of epithermal gold.",
    "category": "History & Field Knowledge",
    "list_header": "BOILING TEXTURES",
    "list_points": [
      "Platy calcite (Bladed)",
      "Lattice bladed texture",
      "Colloform banding",
      "Crustiform layering"
    ]
  },
  {
    "id": 34,
    "headline": "NUGGET PATCHES",
    "subtitle": "Detecting shallow ground.",
    "category": "History & Field Knowledge",
    "list_header": "NUGGET INDICATORS",
    "list_points": [
      "Coarse gold in patches",
      "Shallow bedrock",
      "Detector targets",
      "Erratic distribution"
    ]
  },
  {
    "id": 35,
    "headline": "PAYSTREAKS",
    "subtitle": "Path of least resistance.",
    "category": "River & Placer",
    "list_header": "PAYSTREAK FEATURES",
    "list_points": [
      "Narrow gold-rich zones",
      "Follow old channels",
      "Bedrock irregularities",
      "Concentrated heavy minerals"
    ]
  },
  {
    "id": 36,
    "headline": "FLOOD GOLD",
    "subtitle": "Skim bars and moss mats.",
    "category": "River & Placer",
    "list_header": "FLOOD DEPOSITS",
    "list_points": [
      "High water deposits",
      "Skim bars (Surface gold)",
      "Moss and root mats",
      "Flood debris piles"
    ]
  },
  {
    "id": 37,
    "headline": "CREVICING",
    "subtitle": "Snipping gold from cracks.",
    "category": "River & Placer",
    "list_header": "CREVICING TOOLS",
    "list_points": [
      "Crevice tools (Picks, spoons)",
      "Snuffer bottle",
      "Bedrock cracks",
      "Exposed bedrock areas"
    ]
  },
  {
    "id": 38,
    "headline": "BOOMING",
    "subtitle": "Ancient water methods.",
    "category": "River & Placer",
    "list_header": "BOOMING TECHNIQUE",
    "list_points": [
      "Dam and release water",
      "Wash overburden away",
      "Expose bedrock",
      "Historic method"
    ]
  },
  {
    "id": 39,
    "headline": "MERCURY IN GOLD",
    "subtitle": "The amalgam danger.",
    "category": "History & Field Knowledge",
    "list_header": "MERCURY HAZARDS",
    "list_points": [
      "Toxic heavy metal",
      "Forms gold amalgam",
      "Historic use in mining",
      "Environmental contamination"
    ]
  },
  {
    "id": 40,
    "headline": "RIVER PHYSICS FOR GOLD",
    "subtitle": "Water does the sorting for you.",
    "category": "River & Placer",
    "list_header": "HYDROLOGICAL GOLD TRAPS",
    "list_points": [
      "Gold drops at velocity change points",
      "Inside bends = low energy = gold drops",
      "Bedrock steps create hydraulic jumps",
      "Flood events redistribute entire paystreaks"
    ]
  },
  {
    "id": 41,
    "headline": "DETECTOR GROUND BALANCE",
    "subtitle": "Ground Balance: Follow Your Detector and Site Conditions",
    "category": "Equipment & Tools",
    "list_header": "OBSERVE, TEST, AND COMPARE",
    "list_points": [
      "Mineralized ground can affect detector response.",
      "Follow the manual for the specific detector and ground-balance mode.",
      "Check the response on appropriate test ground before interpreting targets.",
      "Do not claim manual balance always outperforms automatic balance."
    ]
  },
  {
    "id": 42,
    "headline": "OROGENIC GOLD SIGNS",
    "subtitle": "Mountain building riches.",
    "category": "Geology & Formations",
    "list_header": "FIELD INDICATORS",
    "list_points": [
      "Quartz-carbonate veins in shear zones",
      "Visible sulfide blebs in quartz",
      "Chlorite alteration halos (green rock)",
      "Ribbon quartz = repeated fluid pulses"
    ]
  },
  {
    "id": 43,
    "headline": "READING BEDROCK COLOR",
    "subtitle": "The rock tells you where to dig.",
    "category": "River & Placer",
    "list_header": "COLOR INDICATORS",
    "list_points": [
      "Red/orange = iron oxide = sulfide weathering",
      "Green = chlorite = hydrothermal alteration",
      "White bleached = silica flooding",
      "Black = manganese = mineralized zone"
    ]
  },
  {
    "id": 44,
    "headline": "WITWATERSRAND",
    "subtitle": "The pebble conglomerates.",
    "category": "Geology & Formations",
    "list_header": "WITWATERSRAND TYPE",
    "list_points": [
      "Placer conglomerate",
      "Rounded quartz pebbles",
      "Pyrite and uraninite",
      "Ancient river deposits"
    ]
  },
  {
    "id": 45,
    "headline": "BRECCIA PIPES",
    "subtitle": "Exploded rock gold.",
    "category": "Geology & Formations",
    "list_header": "BRECCIA FEATURES",
    "list_points": [
      "Angular rock fragments",
      "Pipe-like structure",
      "Hydrothermal alteration",
      "Gold in matrix"
    ]
  },
  {
    "id": 46,
    "headline": "SHEAR ZONES",
    "subtitle": "Crushed rock pathways.",
    "category": "Geology & Formations",
    "list_header": "SHEAR ZONE SIGNS",
    "list_points": [
      "Foliated rock fabric",
      "Quartz veins parallel to shear",
      "Mylonite texture",
      "Linear structural trend"
    ]
  },
  {
    "id": 47,
    "headline": "FOLD HINGES",
    "subtitle": "Structural traps.",
    "category": "Geology & Formations",
    "list_header": "FOLD HINGE FEATURES",
    "list_points": [
      "Maximum curvature zone",
      "Dilation and fracturing",
      "Quartz vein concentration",
      "Gold enrichment"
    ]
  },
  {
    "id": 48,
    "headline": "SADDLE REEFS",
    "subtitle": "Gold at the top of the fold.",
    "category": "Geology & Formations",
    "list_header": "SADDLE REEF STRUCTURE",
    "list_points": [
      "Anticlinal fold crest",
      "Saddle-shaped quartz body",
      "Bedding-parallel veins",
      "Classic Victorian goldfields"
    ]
  },
  {
    "id": 49,
    "headline": "STOCKWORKS",
    "subtitle": "Networks of tiny veins.",
    "category": "Geology & Formations",
    "list_header": "STOCKWORK PATTERNS",
    "list_points": [
      "Dense vein networks",
      "Crosscutting veins",
      "Disseminated gold",
      "Porphyry and epithermal systems"
    ]
  },
  {
    "id": 50,
    "headline": "LATERITE GOLD",
    "subtitle": "Tropical weathering.",
    "category": "Geology & Formations",
    "list_header": "LATERITE PROFILE",
    "list_points": [
      "Deep weathering profile",
      "Iron-rich surface layer",
      "Gold enrichment at base",
      "Tropical climate formation"
    ]
  },
  {
    "id": 51,
    "headline": "METAL DETECTORS",
    "subtitle": "Electronic gold hunting.",
    "category": "Equipment & Tools",
    "list_header": "DETECTOR BASICS",
    "list_points": [
      "VLF vs PI technology",
      "Ground balance settings",
      "Discrimination modes",
      "Coil selection for gold"
    ]
  },
  {
    "id": 52,
    "headline": "SLUICE BOXES",
    "subtitle": "Your Sluice Is Packing Up: What to Observe Before Adjusting It",
    "category": "Equipment & Tools",
    "list_header": "OBSERVE, TEST, AND COMPARE",
    "list_points": [
      "Observe material movement, feed consistency and buildup.",
      "Use setup guidance for the specific sluice rather than one universal angle.",
      "Change one setting at a time and compare retained output material.",
      "A small test cannot establish perfect recovery or guaranteed yield."
    ]
  },
  {
    "id": 53,
    "headline": "GARNET GOLD CONNECTION",
    "subtitle": "Red gems point to riches.",
    "category": "Rocks & Minerals",
    "list_header": "WHY GARNETS SIGNAL GOLD",
    "list_points": [
      "Both form in high-pressure metamorphic zones",
      "Garnet-rich black sand = heavy mineral concentration",
      "Almandine garnet most common gold companion",
      "Deep red color visible even in murky water"
    ]
  },
  {
    "id": 54,
    "headline": "MAGNETITE GOLD TRAP",
    "subtitle": "Follow the black sand.",
    "category": "Rocks & Minerals",
    "list_header": "MAGNETITE AS GOLD INDICATOR",
    "list_points": [
      "Same specific gravity zone as fine gold",
      "Magnet test reveals concentration zones",
      "Black sand layers = natural sluice effect",
      "Magnetite-rich bedrock pockets trap nuggets"
    ]
  },
  {
    "id": 55,
    "headline": "SPRING RUNOFF",
    "subtitle": "High water opportunity.",
    "category": "River & Placer",
    "list_header": "RUNOFF ADVANTAGES",
    "list_points": [
      "Exposes new bedrock",
      "Moves heavy material",
      "Creates new deposits",
      "Cleans out crevices"
    ]
  },
  {
    "id": 56,
    "headline": "SAMPLING STRATEGIES",
    "subtitle": "Two Sample Spots, Same Amount of Material: How to Compare Fairly",
    "category": "Equipment & Tools",
    "list_header": "OBSERVE, TEST, AND COMPARE",
    "list_points": [
      "Label each location and compare similar sample volumes.",
      "Use a consistent panning method and note sampling conditions.",
      "Record observed gold separately from other heavy minerals.",
      "Two pans are an initial comparison, not proof of a continuous or economic paystreak."
    ]
  },
  {
    "id": 57,
    "headline": "SELLING YOUR GOLD",
    "subtitle": "Getting fair value.",
    "category": "History & Field Knowledge",
    "list_header": "SELLING OPTIONS",
    "list_points": [
      "Local refineries",
      "Online buyers",
      "Pawn shops (lowest price)",
      "Direct to jewelers"
    ]
  },
  {
    "id": 58,
    "headline": "GOLD RUSH HISTORY",
    "subtitle": "Learning from the past.",
    "category": "History & Field Knowledge",
    "list_header": "HISTORIC LESSONS",
    "list_points": [
      "Old workings show deposits",
      "Technology left gold behind",
      "Maps reveal patterns",
      "Tailings hold value"
    ]
  },
  {
    "id": 59,
    "headline": "NO GOLD FOUND",
    "subtitle": "No Gold Yet: Compare Your Samples Before Blaming Your Technique",
    "category": "Equipment & Tools",
    "list_header": "OBSERVE, TEST, AND COMPARE",
    "list_points": [
      "An empty test pan can reflect location, sampling variation or technique.",
      "Compare similarly sized samples and record where they came from.",
      "Check technique using retained practice material in a collecting tub.",
      "Neither quartz nor black sand guarantees a productive deposit."
    ]
  },
  {
    "id": 60,
    "headline": "PROSPECTING CLUBS",
    "subtitle": "Strength in numbers.",
    "category": "History & Field Knowledge",
    "list_header": "CLUB BENEFITS",
    "list_points": [
      "Access to claims",
      "Shared knowledge",
      "Group outings",
      "Equipment loans"
    ]
  },
  {
    "id": 61,
    "headline": "GOLD PANS",
    "subtitle": "The essential tool.",
    "category": "Equipment & Tools",
    "list_header": "PAN SELECTION",
    "list_points": [
      "Size: 10-14 inches",
      "Riffles vs smooth",
      "Green or black color",
      "Plastic vs metal"
    ]
  },
  {
    "id": 62,
    "headline": "ACID TESTING",
    "subtitle": "Chemical verification.",
    "category": "Equipment & Tools",
    "list_header": "ACID TEST PROCEDURE",
    "list_points": [
      "Scratch test surface",
      "Apply nitric acid",
      "Gold won't react",
      "Pyrite dissolves"
    ]
  },
  {
    "id": 63,
    "headline": "MINING PERMITS",
    "subtitle": "Legal requirements.",
    "category": "History & Field Knowledge",
    "list_header": "PERMIT TYPES",
    "list_points": [
      "Recreational permits",
      "Commercial licenses",
      "Environmental clearance",
      "Water rights"
    ]
  },
  {
    "id": 64,
    "headline": "AFTER FLOODS",
    "subtitle": "Nature's redistribution.",
    "category": "River & Placer",
    "list_header": "POST-FLOOD SIGNS",
    "list_points": [
      "New gravel bars",
      "Exposed bedrock",
      "Changed stream course",
      "Fresh concentrations"
    ]
  },
  {
    "id": 65,
    "headline": "FINE GOLD RECOVERY",
    "subtitle": "Fine Gold Cleanup: Why the Last Spoonful Is Difficult",
    "category": "History & Field Knowledge",
    "list_header": "OBSERVE, TEST, AND COMPARE",
    "list_points": [
      "Separate initial concentration from the slower final cleanup.",
      "Work with manageable portions and retain material for rechecking.",
      "Compare mechanical cleanup methods appropriate to particle size and equipment.",
      "Do not recommend mercury, chemical extraction or guaranteed recovery percentages."
    ]
  },
  {
    "id": 66,
    "headline": "ASSAYING",
    "subtitle": "Professional analysis.",
    "category": "Equipment & Tools",
    "list_header": "ASSAY METHODS",
    "list_points": [
      "Fire assay (most accurate)",
      "XRF analysis",
      "ICP testing",
      "Sample preparation"
    ]
  },
  {
    "id": 67,
    "headline": "FAMOUS NUGGETS",
    "subtitle": "Legendary finds.",
    "category": "History & Field Knowledge",
    "list_header": "RECORD NUGGETS",
    "list_points": [
      "Welcome Stranger (72kg)",
      "Hand of Faith (27kg)",
      "Pepita Canaã (60kg)",
      "Great Triangle (36kg)"
    ]
  },
  {
    "id": 68,
    "headline": "GOLD PRICING",
    "subtitle": "Understanding value.",
    "category": "History & Field Knowledge",
    "list_header": "PRICING FACTORS",
    "list_points": [
      "Spot price per ounce",
      "Purity percentage",
      "Buyer's premium",
      "Specimen vs melt value"
    ]
  },
  {
    "id": 69,
    "headline": "EQUIPMENT FAILURES",
    "subtitle": "Field repairs.",
    "category": "Equipment & Tools",
    "list_header": "COMMON FAILURES",
    "list_points": [
      "Detector coil damage",
      "Sluice riffle loss",
      "Pan cracks",
      "Pump failures"
    ]
  },
  {
    "id": 70,
    "headline": "TAILINGS",
    "subtitle": "Old Tailings Are a Sampling Question, Not Guaranteed Gold",
    "category": "Equipment & Tools",
    "list_header": "OBSERVE, TEST, AND COMPARE",
    "list_points": [
      "Historical recovery methods and deposits differed.",
      "Do not assume all older equipment missed fine gold.",
      "Compare documented samples before claiming material has recoverable gold.",
      "New equipment alone does not establish that a site is productive."
    ]
  },
  {
    "id": 71,
    "headline": "DREDGES",
    "subtitle": "Underwater mining.",
    "category": "Equipment & Tools",
    "list_header": "DREDGE BASICS",
    "list_points": [
      "Suction power (HP)",
      "Nozzle size selection",
      "Sluice box design",
      "Legal restrictions"
    ]
  },
  {
    "id": 72,
    "headline": "ENVIRONMENTAL RULES",
    "subtitle": "Protecting waterways.",
    "category": "Rocks & Minerals",
    "list_header": "ENVIRONMENTAL LAWS",
    "list_points": [
      "No stream pollution",
      "Restore disturbed areas",
      "Protect fish habitat",
      "Proper waste disposal"
    ]
  },
  {
    "id": 73,
    "headline": "DRONE PROSPECTING",
    "subtitle": "Aerial reconnaissance.",
    "category": "History & Field Knowledge",
    "list_header": "DRONE APPLICATIONS",
    "list_points": [
      "Mapping terrain",
      "Spotting outcrops",
      "Access scouting",
      "Thermal imaging"
    ]
  },
  {
    "id": 74,
    "headline": "GHOST TOWNS",
    "subtitle": "Mining camp remnants.",
    "category": "History & Field Knowledge",
    "list_header": "GHOST TOWN CLUES",
    "list_points": [
      "Old workings nearby",
      "Tailings piles",
      "Equipment remains",
      "Historical records"
    ]
  },
  {
    "id": 75,
    "headline": "SPECIMEN GOLD",
    "subtitle": "Collectible pieces.",
    "category": "Rocks & Minerals",
    "list_header": "SPECIMEN VALUE",
    "list_points": [
      "Natural crystal form",
      "Attached quartz matrix",
      "Aesthetic appeal",
      "Worth more than melt"
    ]
  },
  {
    "id": 77,
    "headline": "FIELD TESTS FOR GOLD",
    "subtitle": "Identify gold on the spot — no lab needed.",
    "category": "History & Field Knowledge",
    "list_header": "PRACTICAL TESTS",
    "list_points": [
      "Acid test (nitric acid reaction)",
      "Magnet test (gold is non-magnetic)",
      "Float test (gold sinks fast)",
      "Scratch test on unglazed ceramic"
    ]
  },
  {
    "id": 78,
    "headline": "MINERAL IDENTIFICATION",
    "subtitle": "Know what you're holding before you celebrate.",
    "category": "Rocks & Minerals",
    "list_header": "KEY MINERALS TO KNOW",
    "list_points": [
      "Pyrite (Fool's Gold) — cubic, brittle",
      "Chalcopyrite — brassy yellow, iridescent",
      "Mica — flaky, lightweight",
      "Magnetite — black, magnetic"
    ]
  },
  {
    "id": 79,
    "headline": "GOLD DEPOSIT TYPES",
    "subtitle": "Not all gold is found the same way.",
    "category": "Geology & Formations",
    "list_header": "DEPOSIT CATEGORIES",
    "list_points": [
      "Placer deposits (rivers & streams)",
      "Lode/vein deposits (hard rock)",
      "Alluvial fans (ancient waterways)",
      "Residual deposits (weathered bedrock)"
    ]
  },
  {
    "id": 80,
    "headline": "GEOLOGICAL FORMATIONS",
    "subtitle": "Read the rocks, find the gold.",
    "category": "Geology & Formations",
    "list_header": "KEY FORMATIONS",
    "list_points": [
      "Skarn zones (contact metamorphism)",
      "Greenstone belts (ancient volcanic)",
      "Shear zones (fault-related gold)",
      "Intrusive contacts (granite margins)"
    ]
  },
  {
    "id": 81,
    "headline": "DRY WASHING",
    "subtitle": "Desert Prospecting Without Water",
    "category": "Equipment & Tools",
    "list_header": "HOW IT WORKS",
    "list_points": [
      "Uses air bellows or fans",
      "Vibration mimics water flow",
      "Static electricity catches fine gold",
      "Requires bone-dry dirt"
    ]
  },
  {
    "id": 82,
    "headline": "METAL DETECTOR COILS",
    "subtitle": "DD vs Mono Coils",
    "category": "Equipment & Tools",
    "list_header": "COIL CHOICE MATTERS",
    "list_points": [
      "Mono: Deeper punch, sharp target center",
      "DD: Better in mineralized ground",
      "Small coils: Great for tiny nuggets/crevices",
      "Large coils: Max depth for big targets"
    ]
  },
  {
    "id": 83,
    "headline": "SNIPING FOR GOLD",
    "subtitle": "Underwater Treasure Hunting",
    "category": "River & Placer",
    "list_header": "SNIPING TACTICS",
    "list_points": [
      "Wear a wetsuit and snorkel",
      "Use a bulb snifter or hand dredge",
      "Fanning away sand to expose bedrock",
      "Look into deep cracks others miss"
    ]
  },
  {
    "id": 84,
    "headline": "CLASSIFYING DIRT",
    "subtitle": "Size Matters for Recovery",
    "category": "Equipment & Tools",
    "list_header": "WHY CLASSIFY?",
    "list_points": [
      "Matches material to water flow speed",
      "Prevents large rocks from washing gold out",
      "Speeds up panning significantly",
      "Use 1/4 or 1/2 inch mesh screens"
    ]
  },
  {
    "id": 85,
    "headline": "BLACK SAND RECOVERY",
    "subtitle": "Extracting the Invisible Gold",
    "category": "Rocks & Minerals",
    "list_header": "CLEANUP METHODS",
    "list_points": [
      "Super-magnets to remove magnetite",
      "Blue bowl concentrators",
      "Miller tables for fine separation",
      "Tapping the pan to walk gold up"
    ]
  },
  {
    "id": 86,
    "headline": "HIGHBANKING 101",
    "subtitle": "Processing Dirt Faster",
    "category": "Equipment & Tools",
    "list_header": "HIGHBANKER ADVANTAGES",
    "list_points": [
      "Water pump allows working away from river",
      "Built-in grizzly classifying screen",
      "Continuous feeding without bending",
      "Processes 10x more than a pan"
    ]
  },
  {
    "id": 87,
    "headline": "GROUND BALANCING",
    "subtitle": "Silencing the Earth's Noise",
    "category": "History & Field Knowledge",
    "list_header": "DETECTOR CALIBRATION",
    "list_points": [
      "Cancels out iron-rich 'hot rocks'",
      "Pump coil over clean ground to set",
      "Re-balance when soil color changes",
      "Crucial for hearing faint nugget signals"
    ]
  },
  {
    "id": 88,
    "headline": "HISTORICAL TAILINGS",
    "subtitle": "Reworking the Old Timers' Waste",
    "category": "Equipment & Tools",
    "list_header": "WHY HUNT TAILINGS?",
    "list_points": [
      "Old technology missed fine gold",
      "Detectors can find nuggets they threw out",
      "Often safe, public access areas",
      "Look for quartz piles and crushed rock"
    ]
  },
  {
    "id": 89,
    "headline": "MOSS & ROOT TRAPS",
    "subtitle": "Nature's Catchers",
    "category": "River & Placer",
    "list_header": "VEGETATION GOLD",
    "list_points": [
      "Moss acts like miner's moss/carpet",
      "Tree roots slow water during floods",
      "Carefully pluck moss and wash in bucket",
      "Often yields very fine 'flour gold'"
    ]
  },
  {
    "id": 90,
    "headline": "THE SPECIFIC GRAVITY",
    "subtitle": "Why Gold Sinks Rapidly",
    "category": "Rocks & Minerals",
    "list_header": "UNDERSTANDING WEIGHT",
    "list_points": [
      "Gold is 19.3 times heavier than water",
      "Over 6 times heavier than typical gravel",
      "Will sink through shaking and vibration",
      "Never stops until it hits bedrock or clay"
    ]
  },
  {
    "id": 91,
    "headline": "CALICHE DEPOSITS",
    "subtitle": "Cemented Desert Wealth",
    "category": "Geology & Formations",
    "list_header": "BREAKING THE HARDPAN",
    "list_points": [
      "Caliche acts like natural concrete",
      "Traps ancient gold deposits tightly",
      "Requires picks, hammers, or soaking",
      "Often confused with barren bedrock"
    ]
  },
  {
    "id": 92,
    "headline": "SLUICE BOX RIFFLES",
    "subtitle": "Catching Different Gold Sizes",
    "category": "Equipment & Tools",
    "list_header": "RIFFLE PROFILES",
    "list_points": [
      "Hungarian Riffles: Creates strong vortexes",
      "Expanded Metal: Catches fine flour gold",
      "V-Matting: Great for early stage catching",
      "Angle matters more than riffle type"
    ]
  },
  {
    "id": 93,
    "headline": "VLF DETECTORS",
    "subtitle": "The Coin Shooter's Upgrade",
    "category": "Equipment & Tools",
    "list_header": "VLF CAPABILITIES",
    "list_points": [
      "Very Low Frequency technology",
      "Excellent discrimination against iron junk",
      "Highly sensitive to tiny nuggets",
      "Struggles in extremely mineralized ground"
    ]
  },
  {
    "id": 94,
    "headline": "PULSE INDUCTION",
    "subtitle": "Punching Deep for Nuggets",
    "category": "Equipment & Tools",
    "list_header": "PI DETECTOR PROS",
    "list_points": [
      "Ignores highly mineralized hot rocks",
      "Achieves extreme depth penetration",
      "Must dig almost every signal (low discrimination)",
      "The choice of professional prospectors"
    ]
  },
  {
    "id": 95,
    "headline": "THE PANNING ANGLE",
    "subtitle": "Finding the Perfect Rhythm",
    "category": "Equipment & Tools",
    "list_header": "PANNING TECHNIQUE",
    "list_points": [
      "Start with vigorous horizontal shaking",
      "Tilt at a 30-degree angle to the water",
      "Wash lighter sands off the front lip",
      "Keep gold safely in the back corner"
    ]
  },
  {
    "id": 96,
    "headline": "FLOOD GOLD ZONES",
    "subtitle": "Post-Storm Riches",
    "category": "River & Placer",
    "list_header": "FRESH DEPOSITS",
    "list_points": [
      "Floods rip gold from banks and banks",
      "Look for new gravel bars after high water",
      "Skim panning surface layers",
      "Gold is usually small and flat (flakes)"
    ]
  },
  {
    "id": 97,
    "headline": "AVOIDING CLAIM JUMPING",
    "subtitle": "Stay Legal, Stay Safe",
    "category": "History & Field Knowledge",
    "list_header": "IDENTIFYING CLAIMS",
    "list_points": [
      "Look for PVC pipes, wood posts, or rock cairns",
      "Check BLM or local government databases",
      "Noting 'No Trespassing' or claim signs",
      "Always ask permission if unsure"
    ]
  },
  {
    "id": 98,
    "headline": "MERCURY WARNINGS",
    "subtitle": "Toxic Legacies of the Past",
    "category": "River & Placer",
    "list_header": "HANDLING AMALGAM",
    "list_points": [
      "Old miners used mercury to catch fine gold",
      "Looks like silver-coated gold or dull beads",
      "Never heat or burn it in open air",
      "Store in water and dispose as hazmat"
    ]
  },
  {
    "id": 99,
    "headline": "TEST PANNING",
    "subtitle": "Sampling Before You Sweat",
    "category": "Equipment & Tools",
    "list_header": "WHY SAMPLE?",
    "list_points": [
      "Never move yards of dirt blindly",
      "Pan a small sample from top, middle, bottom",
      "Follow the best color count",
      "Saves hours of wasted energy"
    ]
  },
  {
    "id": 100,
    "headline": "LEAVE NO TRACE",
    "subtitle": "The Prospector's Ethics",
    "category": "History & Field Knowledge",
    "list_header": "RESPECTING THE LAND",
    "list_points": [
      "Always fill your holes back in",
      "Pack out all your trash (and others')",
      "Don't dig into live tree roots or banks",
      "Preserve access for future generations"
    ]
  },
  {
    "id": 10001,
    "headline": "CHECK YOUR SLUICE TAILINGS",
    "subtitle": "Check retained output before guessing whether gold is being lost.",
    "category": "Equipment & Tools",
    "list_header": "A PRACTICAL CHECK",
    "list_points": [
      "Collect a manageable representative portion of processed output for checking.",
      "Keep test material labeled so different settings are not mixed.",
      "Change one setting at a time, following the equipment manual.",
      "A limited test does not establish a recovery percentage or perfect capture."
    ]
  },
  {
    "id": 10002,
    "headline": "PRACTICE PANNING IN A CATCH TUB",
    "subtitle": "Practice with retained material instead of losing track of your mistakes.",
    "category": "Equipment & Tools",
    "list_header": "PRACTICE AND RECHECK",
    "list_points": [
      "Use a stable collecting tub so practice material can be recovered.",
      "Work with manageable portions and repeat the same technique.",
      "Recheck collected material to understand what was washed out.",
      "Do not release practice material into streams or equate practice success with finding a deposit."
    ]
  }
];

export const CONTENT_IDEAS: string[] = GOLDGEN_TOPICS.map(formatTopicToIdea);

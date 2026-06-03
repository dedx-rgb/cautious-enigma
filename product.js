const PRODUCTS = [
  {
    id: "j-01",
    name: "Apex Hardshell Field Jacket",
    category: "Jackets",
    price: 289.00,
    originalPrice: 320.00,
    rating: 4.8,
    reviewsCount: 142,
    badge: "Best Seller",
    description: "Engineered for harsh environments, this 3-layer hardshell offers complete windproof and waterproof protection with a 20K/20K breathability rating. Features reinforced elbows, pack-compatible pockets, and an adjustable tactical storm hood.",
    specs: [
      "Material: 3-Layer Ripstop Nylon with DWR",
      "Waterproof Rating: 20,000mm hydrostatic head",
      "Pockets: 2 hand warmer, 2 bicep, 1 internal chest",
      "Features: YKK AquaGuard zippers, pit zips, adjustable hem"
    ],
    colors: [
      { name: "Ranger Green", hex: "#394438" },
      { name: "Matte Black", hex: "#1A1A1A" },
      { name: "Coyote Brown", hex: "#8F8265" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    tag: "Waterproof",
    image: "assets/j01_ranger.png",
    // We will generate the main image or represent it beautifully
    isNew: false
  },
  {
    id: "j-02",
    name: "Stealth Recon Softshell",
    category: "Jackets",
    price: 189.00,
    rating: 4.9,
    reviewsCount: 88,
    badge: "New Arrival",
    description: "A lightweight, breathable, and highly mobile softshell jacket lined with grid fleece for insulation. The outer stretch-woven face resists light precipitation and blocks 95% of wind, making it ideal for active maneuvers.",
    specs: [
      "Material: 4-Way Stretch DWR Softshell",
      "Insulation: Grid fleece lining",
      "Features: Hook-and-loop patch fields, comms routing port",
      "Weight: 620g (Size L)"
    ],
    colors: [
      { name: "Matte Black", hex: "#1A1A1A" },
      { name: "Gunmetal Gray", hex: "#4A4D4C" }
    ],
    sizes: ["S", "M", "L", "XL"],
    tag: "Windproof",
    image: "assets/j02_black.png",
    isNew: true
  },
  {
    id: "p-01",
    name: "ARMS FIT Combat Pant",
    category: "Pants",
    price: 219.00,
    rating: 4.7,
    reviewsCount: 215,
    badge: "Heavy Duty",
    description: "Designed for ultimate durability and comfort, featuring integrated knee pad pockets, stretch panels around the knees and lower back, and 10 tactical utility pockets for gear storage.",
    specs: [
      "Material: 50/50 NYCO Ripstop (Cordura Nylon/Cotton)",
      "Reinforcements: 500D Cordura knees and seat",
      "Pockets: Double thigh cargo, knife pocket, rear zip pocket",
      "Knee Pads: Fits AirFlex Combat Knee Pads (sold separately)"
    ],
    colors: [
      { name: "Coyote Brown", hex: "#8F8265" },
      { name: "Ranger Green", hex: "#394438" },
      { name: "Matte Black", hex: "#1A1A1A" }
    ],
    sizes: ["30R", "32R", "34R", "36R", "38R"],
    tag: "Ripstop",
    image: "assets/p01_coyote.png",
    isNew: false
  },
  {
    id: "p-02",
    name: "Operator Cargo Pant",
    category: "Pants",
    price: 149.00,
    originalPrice: 169.00,
    rating: 4.6,
    reviewsCount: 97,
    badge: "Sale",
    description: "A clean-cut, low-profile tactical pant that transitions from field operations to urban environments. Constructed from flexible ripstop canvas with hidden pocket configurations.",
    specs: [
      "Material: Flex-Tac Ripstop Fabric (65% Polyester / 35% Cotton)",
      "Finish: Teflon treated to resist stains and soil",
      "Pockets: Low profile cargo, utility magazine pocket",
      "Features: Gusseted construction, double-thick seat"
    ],
    colors: [
      { name: "Gunmetal Gray", hex: "#4A4D4C" },
      { name: "Coyote Brown", hex: "#8F8265" },
      { name: "Matte Black", hex: "#1A1A1A" }
    ],
    sizes: ["30R", "32R", "34R", "36R"],
    tag: "Flex-Tac",
    image: "assets/p02_gunmetal.png",
    isNew: false
  },
  {
    id: "s-01",
    name: "Tactical Assault Combat Shirt",
    category: "Tactical Shirts",
    price: 119.00,
    rating: 4.8,
    reviewsCount: 110,
    badge: "Elite Spec",
    description: "Optimized for armor carrier compatibility. The torso is made of ultra-breathable, moisture-wicking knit fabric, while the sleeves feature high-durability ripstop with integrated elbow pad slots.",
    specs: [
      "Sleeve Fabric: 50/50 NYCO Ripstop",
      "Torso Fabric: Lycra/Polyester knit with antimicrobial treatment",
      "Features: Zippered shoulder pockets, pen slots, adjustable cuffs",
      "Fit: Athletic, snug-to-skin torso"
    ],
    colors: [
      { name: "Ranger Green", hex: "#394438" },
      { name: "Coyote Brown", hex: "#8F8265" },
      { name: "Matte Black", hex: "#1A1A1A" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    tag: "Wicking",
    image: "assets/s01_ranger.png",
    isNew: false
  },
  {
    id: "s-02",
    name: "Grid-Fleece Operator Pullover",
    category: "Tactical Shirts",
    price: 98.00,
    rating: 4.5,
    reviewsCount: 64,
    badge: "Insulator",
    description: "A mid-layer fleece designed to manage sweat and retain body heat. The grid pattern creates air channels to maximize insulation while keeping weight down.",
    specs: [
      "Material: 100% Recycled Grid Fleece Polyester",
      "Neckline: 1/4 zip front for rapid ventilation",
      "Features: Flatlock seams for comfort under gear",
      "Weight: 310g"
    ],
    colors: [
      { name: "Gunmetal Gray", hex: "#4A4D4C" },
      { name: "Ranger Green", hex: "#394438" }
    ],
    sizes: ["S", "M", "L", "XL"],
    tag: "Warmth",
    image: "assets/s02_gunmetal.png",
    isNew: false
  },
  {
    id: "f-01",
    name: "SpecOps Waterproof Combat Boot",
    category: "Footwear",
    price: 249.00,
    rating: 4.9,
    reviewsCount: 153,
    badge: "All-Terrain",
    description: "A lightweight, heavy-duty duty boot featuring an eVent waterproof membrane, vibram outsole, and puncture-resistant board. Engineered to keep feet dry and stable over rocky or muddy terrains.",
    specs: [
      "Material: Full-grain leather & 1000D Cordura panels",
      "Membrane: eVent breathable waterproof liner",
      "Outsole: Vibram Megagrip lug sole",
      "Insole: Ortholite high-rebound cushioning"
    ],
    colors: [
      { name: "Matte Black", hex: "#1A1A1A" },
      { name: "Coyote Brown", hex: "#8F8265" }
    ],
    sizes: ["8", "9", "10", "11", "12"],
    tag: "Vibram",
    image: "assets/f01_black.png",
    isNew: true
  },
  {
    id: "f-02",
    name: "All-Terrain Recon Boot",
    category: "Footwear",
    price: 195.00,
    originalPrice: 215.00,
    rating: 4.7,
    reviewsCount: 76,
    badge: "Sale",
    description: "A hybrid trail-running combat boot designed for speed and agility. Provides the ankle support of a tactical boot with the responsive cushioning of a modern running shoe.",
    specs: [
      "Material: Synthetic leather & ripstop mesh",
      "Support: TPU shank for torsional stability",
      "Lacing: Speed lacing system with lace pocket",
      "Weight: 450g per boot (Size 9)"
    ],
    colors: [
      { name: "Coyote Brown", hex: "#8F8265" },
      { name: "Matte Black", hex: "#1A1A1A" }
    ],
    sizes: ["8", "9", "10", "11", "12"],
    tag: "Lightweight",
    image: "assets/f02_coyote.png",
    isNew: false
  },
  {
    id: "a-01",
    name: "Modular Plate Carrier Belt",
    category: "Accessories",
    price: 125.00,
    rating: 4.8,
    reviewsCount: 82,
    badge: "MOLLE System",
    description: "A two-belt tactical setup featuring an inner hook-and-loop belt and an outer load-bearing belt with AustriAlpin Cobra buckles. Offers laser-cut MOLLE attachment slots.",
    specs: [
      "Material: 1000D Cordura Nylon webbing",
      "Buckle: AustriAlpin Cobra Quick-Release (18kN rated)",
      "MOLLE: Dual row laser cut slots",
      "Size: Fully adjustable sizing grid"
    ],
    colors: [
      { name: "Matte Black", hex: "#1A1A1A" },
      { name: "Ranger Green", hex: "#394438" },
      { name: "Coyote Brown", hex: "#8F8265" }
    ],
    sizes: ["S/M", "L/XL"],
    tag: "Laser Cut",
    image: "assets/a01_black.png",
    isNew: false
  },
  {
    id: "a-02",
    name: "Tactical Hard-Knuckle Gloves",
    category: "Accessories",
    price: 59.00,
    rating: 4.6,
    reviewsCount: 104,
    badge: "Impact Guard",
    description: "Constructed with premium synthetic leather palm for grip and touch screen compatibility, backed by molded thermal plastic rubber knuckles for impact protection.",
    specs: [
      "Palm: Touchscreen compatible synthetic suede leather",
      "Knuckle Protection: Anatomically shaped thermo-plastic plate",
      "Ventilation: Mesh padding on back of hand",
      "Cuff: TPR strap with hook-and-loop closure"
    ],
    colors: [
      { name: "Matte Black", hex: "#1A1A1A" },
      { name: "Coyote Brown", hex: "#8F8265" }
    ],
    sizes: ["S", "M", "L", "XL"],
    tag: "Touchscreen",
    image: "assets/a02_black.png",
    isNew: false
  },
  {
    id: "a-03",
    name: "ARMS FIT Ripstop Backpack",
    category: "Accessories",
    price: 165.00,
    rating: 4.9,
    reviewsCount: 189,
    badge: "New Arrival",
    description: "A 35L rugged tactical backpack featuring a clamshell design, padded laptop compartment, hydration bladder bladder sleeve, and robust modular attachments for extended missions.",
    specs: [
      "Capacity: 35 Liters",
      "Material: 1050D Cordura Ballistic Nylon",
      "Zippers: YKK Self-repairing coil zippers",
      "Dimensions: 20\" H x 12\" W x 9\" D"
    ],
    colors: [
      { name: "Ranger Green", hex: "#394438" },
      { name: "Matte Black", hex: "#1A1A1A" },
      { name: "Coyote Brown", hex: "#8F8265" }
    ],
    sizes: ["One Size"],
    tag: "35L Capacity",
    image: "assets/a03_ranger.png",
    isNew: true
  }
];

// Export to window object for browser access
window.PRODUCTS = PRODUCTS;

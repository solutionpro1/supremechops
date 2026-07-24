// 1. Gourmet Platters (Default Main Packs) - Sorted Lowest to Highest
const rawPlatters = [
  {
    id: "pack-economy",
    name: "Economy Pack",
    category: "Gourmet Platters",
    price: 1400,
    contents: ["1 Spring Roll", "1 Samosa", "4 Mosa", "5 Puff Puff", "1 Corndog"]
  },
  {
    id: "pack-solo",
    name: "Solo Pack",
    category: "Gourmet Platters",
    price: 1700,
    contents: ["1 Spring Roll", "1 Samosa", "4 Mosa", "5 Puff Puff", "1 Peppered Gizzard"]
  },
  {
    id: "pack-snack",
    name: "Snack Pack",
    category: "Gourmet Platters",
    price: 2200,
    contents: ["1 Spring Roll", "1 Samosa", "4 Mosa", "5 Puff Puff", "1 Crispy Chicken"]
  },
  {
    id: "pack-bellefull",
    name: "Belle-Full Pack",
    category: "Gourmet Platters",
    price: 2500,
    contents: ["1 Spring Roll", "1 Samosa", "4 Mosa", "5 Puff Puff", "1 Crispy Chicken", "1 Peppered Gizzard"]
  },
  {
    id: "pack-delight",
    name: "Delight Pack",
    category: "Gourmet Platters",
    price: 3000,
    contents: ["1 Spring Roll", "1 Samosa", "4 Mosa", "5 Puff Puff", "1 Crispy Chicken", "1 Peppered Gizzard", "1 Moneybag", "1 Corndog"]
  },
  {
    id: "pack-supreme-p",
    name: "Supreme Pack",
    category: "Gourmet Platters",
    price: 3400,
    contents: ["1 Spring Roll", "1 Samosa", "4 Mosa", "5 Puff Puff", "1 Crispy Chicken", "1 Peppered Gizzard", "1 Moneybag", "1 Corndog", "1 Prawn-in-Batter"]
  },
  {
    id: "pack-raff",
    name: "Raff Pack",
    category: "Gourmet Platters",
    price: 3500,
    contents: ["1 Spring Roll", "1 Samosa", "4 Mosa", "5 Puff Puff", "1 Crispy Chicken", "1 Peppered Snail", "1 Fish-in-Batter", "1 Prawn-in-Batter"]
  },
  {
    id: "pack-executive",
    name: "Executive Pack",
    category: "Gourmet Platters",
    price: 6000,
    contents: ["2 Spring Roll", "2 Samosa", "4 Mosa", "5 Puff Puff", "1 Crispy Chicken", "1 Moneybag", "1 Corndog", "1 Prawn-in-Batter", "1 Peppered Snail"]
  },
  {
    id: "pack-chips",
    name: "Chicken & Chips",
    category: "Gourmet Platters",
    price: 6000,
    contents: ["4 Chicken Cut", "1 Portion of Chips"]
  },
  {
    id: "pack-vip-pack",
    name: "VIP Pack",
    category: "Gourmet Platters",
    price: 9000,
    contents: ["2 Prawnroll", "2 Samosa", "4 Mosa", "5 Puff Puff", "1 Crispy Chicken", "1 Corndog", "2 Peppered Gizzard", "1 Moneybag", "1 Fantail Prawn"]
  },
  {
    id: "pack-snack-box",
    name: "Snack Box",
    category: "Gourmet Platters",
    price: 10000,
    contents: ["2 Prawnroll", "2 Samosa", "15 Puff Puff", "10 Mosa", "2 Corndog", "1 Moneybag", "2 Crispy Chicken", "1 Peppered Snail", "1 Prawn-in-Batter", "3 Peppered Gizzard"]
  },
  {
    id: "pack-std-box",
    name: "Standard Box",
    category: "Gourmet Platters",
    price: 14000,
    contents: ["6 Springroll", "6 Samosa", "20 Puff Puff", "20 Mosa", "6 Peppered Gizzard", "6 Crispy Chicken"]
  },
  {
    id: "pack-delight-box",
    name: "Delight Box",
    category: "Gourmet Platters",
    price: 16000,
    contents: ["3 Springroll", "5 Samosa", "15 Puff Puff", "10 Mosa", "5 Crispy Chicken", "2 Peppered Snail", "3 Peppered Gizzard", "3 Fish-in-Batter"]
  },
  {
    id: "pack-supreme-box",
    name: "Supreme Box",
    category: "Gourmet Platters",
    price: 20000,
    contents: ["2 Prawnroll", "3 Springroll", "5 Beef Samosa", "15 Puff Puff", "10 Mosa", "5 Crispy Chicken", "3 Corndog", "3 Moneybag", "3 Peppered Snail", "3 Prawn-in-Batter"]
  },
  {
    id: "pack-std-platter",
    name: "Standard Platter",
    category: "Gourmet Platters",
    price: 25000,
    contents: ["10 Springroll", "10 Samosa", "40 Puff Puff", "30 Mosa", "10 Crispy Chicken", "10 Peppered Gizzard"]
  },
  {
    id: "pack-delight-platter",
    name: "Delight Platter",
    category: "Gourmet Platters",
    price: 29000,
    contents: ["10 Springroll", "10 Samosa", "40 Puff Puff", "30 Mosa", "10 Crispy Chicken", "6 Moneybag", "6 Corndog", "6 Peppered Gizzard"]
  },
  {
    id: "pack-vip-platter",
    name: "VIP Platter",
    category: "Gourmet Platters",
    price: 34000,
    contents: ["8 Prawnroll", "8 Chicken Samosa", "30 Puff Puff", "25 Mosa", "5 Corndog", "5 Peppered Chicken", "5 Peppered Snail", "5 Prawn-in-Batter", "5 Fantail Prawn"]
  },
  {
    id: "pack-bellefull-platter",
    name: "Belle-Full Platter",
    category: "Gourmet Platters",
    price: 38000,
    contents: ["15 Springroll", "15 Samosa", "50 Puff Puff", "40 Mosa", "15 Crispy Chicken", "15 Peppered Gizzard"]
  },
  {
    id: "pack-supreme-platter",
    name: "Supreme Platter",
    category: "Gourmet Platters",
    price: 40000,
    contents: ["10 Springroll", "10 Samosa", "30 Mosa", "40 Puff Puff", "6 Corndog", "10 Crispy Chicken", "6 Moneybag", "6 Peppered Snail", "6 Prawn-in-Batter", "6 Peppered Gizzard"]
  }
];

// 2. Customize Your Packs (A-La-Carte Individual Items) - Sorted Lowest to Highest
const rawCustomizations = [
  { id: "add-veg-springroll", name: "Vegetable Spring Roll", price: 250, category: "Customize Your Packs" },
  { id: "add-beef-samosa", name: "Beef Samosa", price: 250, category: "Customize Your Packs" },
  { id: "add-chk-springroll", name: "Chicken Spring Roll", price: 300, category: "Customize Your Packs" },
  { id: "add-chk-samosa", name: "Chicken Samosa", price: 300, category: "Customize Your Packs" },
  { id: "add-corndog", name: "Corndog", price: 350, category: "Customize Your Packs" },
  { id: "add-moneybag", name: "Money Bag", price: 350, category: "Customize Your Packs" },
  { id: "add-gizzard", name: "Peppered Gizzard", price: 400, category: "Customize Your Packs" },
  { id: "add-shrimp-samosa", name: "Shrimp Samosa", price: 450, category: "Customize Your Packs" },
  { id: "add-fish-batter", name: "Fish-in-Batter", price: 450, category: "Customize Your Packs" },
  { id: "add-stickmeat", name: "Peppered Stick-Meat", price: 450, category: "Customize Your Packs" },
  { id: "add-prawn-batter", name: "Prawn-in-Batter", price: 500, category: "Customize Your Packs" },
  { id: "add-fantail", name: "Fantail Prawn", price: 600, category: "Customize Your Packs" },
  { id: "add-prawnroll", name: "Prawn Roll", price: 800, category: "Customize Your Packs" },
  { id: "add-puff5", name: "x5 Puff Puff", price: 800, category: "Customize Your Packs" },
  { id: "add-mosa5", name: "x5 Mosa", price: 800, category: "Customize Your Packs" },
  { id: "add-snail", name: "Peppered Snail", price: 900, category: "Customize Your Packs" },
  { id: "add-crispy-chk", name: "Crispy Chicken", price: 1000, category: "Customize Your Packs" },
  { id: "add-peppered-chk", name: "Peppered Chicken", price: 1100, category: "Customize Your Packs" },
  { id: "add-bbq-chk", name: "BBQ Chicken", price: 1100, category: "Customize Your Packs" },
  { id: "add-chk-kebab", name: "Chicken Kebab", price: 1200, category: "Customize Your Packs" },
  { id: "add-beef-kebab", name: "Beef Kebab", price: 1500, category: "Customize Your Packs" },
  { id: "add-prawn-kebab", name: "Prawn Kebab", price: 1800, category: "Customize Your Packs" }
];

// 3. Frozen Bulk Prep Packs - Sorted Lowest to Highest
const rawFrozen = [
  { id: "froz-springroll", name: "Springroll", price: 200, category: "Frozen Packs" },
  { id: "froz-samosa", name: "Samosa", price: 200, category: "Frozen Packs" },
  { id: "froz-chk-springroll", name: "Chicken springroll", price: 250, category: "Frozen Packs" },
  { id: "froz-chk-samosa", name: "Chicken samosa", price: 250, category: "Frozen Packs" },
  { id: "froz-moneybag", name: "Money bag", price: 300, category: "Frozen Packs" },
  { id: "froz-shrimp-samosa", name: "Shrimp samosa", price: 400, category: "Frozen Packs" },
  { id: "froz-prawn-springroll", name: "Prawn spring roll with mayo", price: 700, category: "Frozen Packs" },
  { id: "froz-marinated-chk", name: "Marinated chicken", price: 900, category: "Frozen Packs" },
  { id: "froz-chk-kebab", name: "Chicken kebab", price: 1000, category: "Frozen Packs" },
  { id: "froz-beef-kebab", name: "Beef kebab", price: 1400, category: "Frozen Packs" },
  { id: "froz-prawn-kebab", name: "Prawn kebab", price: 1600, category: "Frozen Packs" }
];

export const smallChopsMenu = [...rawPlatters].sort((a, b) => a.price - b.price);
export const customAddOns = [...rawCustomizations].sort((a, b) => a.price - b.price);
export const frozenChops = [...rawFrozen].sort((a, b) => a.price - b.price);

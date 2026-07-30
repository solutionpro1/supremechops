import React from 'react';

export default function MenuCatalog({ onAddToCart, activeTab, setActiveTab }) {
  // Navigation categories mapping your exact menu structure
  const tabs = [
    { id: 'packs', label: '🎁 Platters & Packs' },
    { id: 'customize', label: '🍢 Customize Pack' },
    { id: 'frozen', label: '❄️ Frozen Chops' }
  ];

  // FIXED: Datasets sorted directly from lowest to highest price manually
  const menuItems = {
    packs: [
      { id: 'p19', name: 'Economy Pack', price: 1400, desc: '1 Spring Roll, 1 Samosa, 4 Mosa, 5 Puff Puff, 1 Corndog.' },
      { id: 'p18', name: 'Solo Pack', price: 1700, desc: '1 Spring Roll, 1 Samosa, 4 Mosa, 5 Puff Puff, 1 Peppered Gizzard.' },
      { id: 'p17', name: 'Snack Pack', price: 2200, desc: '1 Spring Roll, 1 Samosa, 4 Mosa, 5 Puff Puff, 1 Crispy Chicken.' },
      { id: 'p16', name: 'Belle-Full Pack', price: 2500, desc: '1 Spring Roll, 1 Samosa, 4 Mosa, 5 Puff Puff, 1 Crispy Chicken, 1 Peppered Gizzard.' },
      { id: 'p15', name: 'Delight Pack', price: 3000, desc: '1 Spring Roll, 1 Samosa, 4 Mosa, 5 Puff Puff, 1 Crispy Chicken, 1 Peppered Gizzard, 1 Moneybag, 1 Corndog.' },
      { id: 'p14', name: 'Supreme Pack', price: 3400, desc: '1 Spring Roll, 1 Samosa, 4 Mosa, 5 Puff Puff, 1 Crispy Chicken, 1 Peppered Gizzard, 1 Moneybag, 1 Corndog, 1 Prawn-in-Batter.' },
      { id: 'p13', name: 'Raff Pack', price: 3500, desc: '1 Spring Roll, 1 Samosa, 4 Mosa, 5 Puff Puff, 1 Crispy Chicken, 1 Peppered Snail, 1 Fish-in-Batter, 1 Prawn-in-Batter.' },
      { id: 'p11', name: 'Chicken & Chips', price: 6000, desc: '4 Chicken Cut & 1 Portion of Chips.' },
      { id: 'p12', name: 'Executive Pack', price: 6000, desc: '2 Spring Roll, 2 Samosa, 4 Mosa, 5 Puff Puff, 1 Crispy Chicken, 1 Moneybag, 1 Corndog, 1 Prawn-in-Batter, 1 Peppered Snail.' },
      { id: 'p10', name: 'VIP Pack', price: 9000, desc: '2 Prawnroll, 2 Samosa, 4 Mosa, 5 Puff Puff, 1 Crispy Chicken, 1 Corndog, 2 Peppered Gizzard, 1 Moneybag, 1 Fantail Prawn.' },
      { id: 'p9', name: 'Snack Box', price: 10000, desc: '2 Prawnroll, 2 Samosa, 15 Puff Puff, 10 Mosa, 2 Corndog, 1 Moneybag, 2 Crispy Chicken, 1 Peppered Snail, 1 Prawn-in-Batter, 3 Peppered Gizzard.' },
      { id: 'p8', name: 'Standard Box', price: 14000, desc: '6 Springroll, 6 Samosa, 20 Puff Puff, 20 Mosa, 6 Peppered Gizzard, 6 Crispy Chicken.' },
      { id: 'p7', name: 'Delight Box', price: 16000, desc: '3 Springroll, 5 Samosa, 15 Puff Puff, 10 Mosa, 5 Crispy Chicken, 2 Peppered Snail, 3 Peppered Gizzard, 3 Fish-in-Batter.' },
      { id: 'p6', name: 'Supreme Box', price: 20000, desc: '2 Prawnroll, 3 Springroll, 5 Beef Samosa, 15 Puff Puff, 10 Mosa, 5 Crispy Chicken, 3 Corndog, 3 Moneybag, 3 Peppered Snail, 3 Prawn-in-Batter.' },
      { id: 'p5', name: 'Standard Platter', price: 25000, desc: '10 Springroll, 10 Samosa, 40 Puff Puff, 30 Mosa, 10 Crispy Chicken, 10 Peppered Gizzard.' },
      { id: 'p4', name: 'Delight Platter', price: 29000, desc: '10 Springroll, 10 Samosa, 40 Puff Puff, 30 Mosa, 10 Crispy Chicken, 6 Moneybag, 6 Corndog, 6 Peppered Gizzard.' },
      { id: 'p3', name: 'VIP Platter', price: 34000, desc: '8 Prawnroll, 8 Chicken Samosa, 30 Puff Puff, 25 Mosa, 5 Corndog, 5 Peppered Chicken, 5 Peppered Snail, 5 Prawn-in-Batter, 5 Fantail Prawn.' },
      { id: 'p2', name: 'Belle-Full Platter', price: 38000, desc: '15 Springroll, 15 Samosa, 50 Puff Puff, 40 Mosa, 15 Crispy Chicken, 15 Peppered Gizzard.' },
      { id: 'p1', name: 'Supreme Platter', price: 40000, desc: '10 Springroll, 10 Samosa, 30 Mosa, 40 Puff Puff, 6 Corndog, 10 Crispy Chicken, 6 Moneybag, 6 Peppered Snail, 6 Prawn-in-Batter, 6 Peppered Gizzard.' }
    ],
    customize: [
      { id: 'c7', name: 'Vegetable Spring Roll', price: 250 },
      { id: 'c8', name: 'Beef Samosa', price: 250 },
      { id: 'c9', name: 'Chicken Spring Roll', price: 300 },
      { id: 'c10', name: 'Chicken Samosa', price: 300 },
      { id: 'c6', name: 'Corndog', price: 350 },
      { id: 'c13', name: 'Money Bag', price: 350 },
      { id: 'c5', name: 'Peppered Gizzard', price: 400 },
      { id: 'c12', name: 'Shrimp Samosa', price: 450 },
      { id: 'c19', name: 'Fish-in-Batter', price: 450 },
      { id: 'c22', name: 'Peppered Stick-Meat', price: 450 },
      { id: 'c16', name: 'Prawn-in-Batter', price: 500 },
      { id: 'c18', name: 'Fantail Prawn', price: 600 },
      { id: 'c11', name: 'Prawn Roll', price: 800 },
      { id: 'c14', name: 'x5 Puff Puff', price: 800 },
      { id: 'c15', name: 'x5 Mosa', price: 800 },
      { id: 'c20', name: 'Peppered Snail', price: 900 },
      { id: 'c1', name: 'Crispy Chicken', price: 1000 },
      { id: 'c2', name: 'Peppered Chicken', price: 1100 },
      { id: 'c3', name: 'BBQ Chicken', price: 1100 },
      { id: 'c4', name: 'Chicken Kebab', price: 1200 },
      { id: 'c21', name: 'Beef Kebab', price: 1500 },
      { id: 'c17', name: 'Prawn Kebab', price: 1800 }
    ],
    frozen: [
      { id: 'f1', name: 'Springroll (Frozen)', price: 200 },
      { id: 'f2', name: 'Samosa (Frozen)', price: 200 },
      { id: 'f3', name: 'Chicken Springroll (Frozen)', price: 250 },
      { id: 'f4', name: 'Chicken Samosa (Frozen)', price: 250 },
      { id: 'f7', name: 'Money Bag (Frozen)', price: 300 },
      { id: 'f6', name: 'Shrimp Samosa (Frozen)', price: 400 },
      { id: 'f5', name: 'Prawn Spring Roll with Mayo (Frozen)', price: 700 },
      { id: 'f8', name: 'Marinated Chicken (Frozen)', price: 900 },
      { id: 'f9', name: 'Chicken Kebab (Frozen)', price: 1000 },
      { id: 'f10', name: 'Beef Kebab (Frozen)', price: 1400 },
      { id: 'f11', name: 'Prawn Kebab (Frozen)', price: 1600 }
    ]
  };

  const activeItems = menuItems[activeTab] || menuItems['packs'];

  return (
    <div id="menu-catalog" className="space-y-8 animate-fade-in">
      
      {/* 🚀 HIGHLY RESPONSIVE SLIDING CATEGORIES TABS */}
      <div className="flex border-b border-neutral-200 overflow-x-auto no-scrollbar gap-2 p-1 bg-neutral-100 rounded-2xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 whitespace-nowrap text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all duration-300 transform active:scale-95 ${
                isActive
                  ? 'bg-white text-orange-600 shadow-md scale-[1.02]'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 🍲 ANIMATED GRID SYSTEM FOR SUPREME CHOPS PRODUCTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-500">
        {activeItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-neutral-200/70 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-orange-500/60 hover:shadow-2xl hover:-translate-y-1.5 bg-gradient-to-br from-white to-neutral-50/30"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-3">
                <h4 className="font-black text-sm text-neutral-900 tracking-tight group-hover:text-orange-600 transition-colors duration-200">
                  {item.name}
                </h4>
                <span className="font-mono text-xs font-black text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200/40 whitespace-nowrap">
                  ₦{item.price.toLocaleString()}
                </span>
              </div>
              {item.desc && (
                <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">
                  {item.desc}
                </p>
              )}
            </div>

            <div className="pt-5 mt-auto">
              <button
                onClick={(e) => onAddToCart(item, activeTab, e)}
                className="w-full bg-neutral-50 group-hover:bg-orange-600 group-hover:text-white border border-neutral-200/80 group-hover:border-orange-600 text-neutral-800 font-black text-[10px] uppercase tracking-widest py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 transform active:scale-95 shadow-sm group-hover:shadow-orange-500/20"
              >
                <span>➕ Add to Pack</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
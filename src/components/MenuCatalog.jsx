import React from 'react';

// Dynamic asset fetch helper with fallback image
const getAssetImage = (fileName) => {
  try {
    return new URL(`../assets/${fileName}`, import.meta.url).href;
  } catch (e) {
    return 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=600&q=80';
  }
};

export default function MenuCatalog({ onAddToCart, activeTab, setActiveTab }) {
  const tabs = [
    { id: 'packs', label: 'Platters & Packs' },
    { id: 'customize', label: 'Customize Pack' },
    { id: 'frozen', label: 'Frozen Chops' }
  ];

  const menuItems = {
    packs: [
      { id: 'p19', name: 'Economy Pack', price: 1400, desc: '1 Spring Roll, 1 Samosa, 4 Mosa, 5 Puff Puff, 1 Corndog.', image: getAssetImage('economy-pack.jpg') },
      { id: 'p18', name: 'Solo Pack', price: 1700, desc: '1 Spring Roll, 1 Samosa, 4 Mosa, 5 Puff Puff, 1 Peppered Gizzard.', image: getAssetImage('solo-pack.jpg') },
      { id: 'p17', name: 'Snack Pack', price: 2200, desc: '1 Spring Roll, 1 Samosa, 4 Mosa, 5 Puff Puff, 1 Crispy Chicken.', image: getAssetImage('snack-pack.jpg') },
      { id: 'p16', name: 'Belle-Full Pack', price: 2500, desc: '1 Spring Roll, 1 Samosa, 4 Mosa, 5 Puff Puff, 1 Crispy Chicken, 1 Peppered Gizzard.', image: getAssetImage('belle-full-pack.jpg') },
      { id: 'p15', name: 'Delight Pack', price: 3000, desc: '1 Spring Roll, 1 Samosa, 4 Mosa, 5 Puff Puff, 1 Crispy Chicken, 1 Peppered Gizzard, 1 Moneybag, 1 Corndog.', image: getAssetImage('delight-pack.jpg') },
      { id: 'p14', name: 'Supreme Pack', price: 3400, desc: '1 Spring Roll, 1 Samosa, 4 Mosa, 5 Puff Puff, 1 Crispy Chicken, 1 Peppered Gizzard, 1 Moneybag, 1 Corndog, 1 Prawn-in-Batter.', image: getAssetImage('supreme-pack.jpg') },
      { id: 'p13', name: 'Raff Pack', price: 3500, desc: '1 Spring Roll, 1 Samosa, 4 Mosa, 5 Puff Puff, 1 Crispy Chicken, 1 Peppered Snail, 1 Fish-in-Batter, 1 Prawn-in-Batter.', image: getAssetImage('raff-pack.jpg') },
      { id: 'p11', name: 'Chicken & Chips', price: 6000, desc: '4 Chicken Cut & 1 Portion of Chips.', image: getAssetImage('chicken-and-chips.jpg') },
      { id: 'p12', name: 'Executive Pack', price: 6000, desc: '2 Spring Roll, 2 Samosa, 4 Mosa, 5 Puff Puff, 1 Crispy Chicken, 1 Moneybag, 1 Corndog, 1 Prawn-in-Batter, 1 Peppered Snail.', image: getAssetImage('executive-pack.jpg') },
      { id: 'p10', name: 'VIP Pack', price: 9000, desc: '2 Prawnroll, 2 Samosa, 4 Mosa, 5 Puff Puff, 1 Crispy Chicken, 1 Corndog, 2 Peppered Gizzard, 1 Moneybag, 1 Fantail Prawn.', image: getAssetImage('vip-pack.jpg') },
      { id: 'p9', name: 'Snack Box', price: 10000, desc: '2 Prawnroll, 2 Samosa, 15 Puff Puff, 10 Mosa, 2 Corndog, 1 Moneybag, 2 Crispy Chicken, 1 Peppered Snail, 1 Prawn-in-Batter, 3 Peppered Gizzard.', image: getAssetImage('snack-box.jpg') },
      { id: 'p8', name: 'Standard Box', price: 14000, desc: '6 Springroll, 6 Samosa, 20 Puff Puff, 20 Mosa, 6 Peppered Gizzard, 6 Crispy Chicken.', image: getAssetImage('standard-box.jpg') },
      { id: 'p7', name: 'Delight Box', price: 16000, desc: '3 Springroll, 5 Samosa, 15 Puff Puff, 10 Mosa, 5 Crispy Chicken, 2 Peppered Snail, 3 Peppered Gizzard, 3 Fish-in-Batter.', image: getAssetImage('delight-box.jpg') },
      { id: 'p6', name: 'Supreme Box', price: 20000, desc: '2 Prawnroll, 3 Springroll, 5 Beef Samosa, 15 Puff Puff, 10 Mosa, 5 Crispy Chicken, 3 Corndog, 3 Moneybag, 3 Peppered Snail, 3 Prawn-in-Batter.', image: getAssetImage('supreme-box.jpg') },
      { id: 'p5', name: 'Standard Platter', price: 25000, desc: '10 Springroll, 10 Samosa, 40 Puff Puff, 30 Mosa, 10 Crispy Chicken, 10 Peppered Gizzard.', image: getAssetImage('standard-platter.jpg') },
      { id: 'p4', name: 'Delight Platter', price: 29000, desc: '10 Springroll, 10 Samosa, 40 Puff Puff, 30 Mosa, 10 Crispy Chicken, 6 Moneybag, 6 Corndog, 6 Peppered Gizzard.', image: getAssetImage('delight-platter.jpg') },
      { id: 'p3', name: 'VIP Platter', price: 34000, desc: '8 Prawnroll, 8 Chicken Samosa, 30 Puff Puff, 25 Mosa, 5 Corndog, 5 Peppered Chicken, 5 Peppered Snail, 5 Prawn-in-Batter, 5 Fantail Prawn.', image: getAssetImage('vip-platter.jpg') },
      { id: 'p2', name: 'Belle-Full Platter', price: 38000, desc: '15 Springroll, 15 Samosa, 50 Puff Puff, 40 Mosa, 15 Crispy Chicken, 15 Peppered Gizzard.', image: getAssetImage('belle-full-platter.jpg') },
      { id: 'p1', name: 'Supreme Platter', price: 40000, desc: '10 Springroll, 10 Samosa, 30 Mosa, 40 Puff Puff, 6 Corndog, 10 Crispy Chicken, 6 Moneybag, 6 Peppered Snail, 6 Prawn-in-Batter, 6 Peppered Gizzard.', image: getAssetImage('supreme-platter.jpg') }
    ],
    customize: [
      { id: 'c7', name: 'Vegetable Spring Roll', price: 250, image: getAssetImage('vegetable-spring-roll.jpg') },
      { id: 'c8', name: 'Beef Samosa', price: 250, image: getAssetImage('beef-samosa.jpg') },
      { id: 'c9', name: 'Chicken Spring Roll', price: 300, image: getAssetImage('chicken-spring-roll.jpg') },
      { id: 'c10', name: 'Chicken Samosa', price: 300, image: getAssetImage('chicken-samosa.jpg') },
      { id: 'c6', name: 'Corndog', price: 350, image: getAssetImage('corndog.jpg') },
      { id: 'c13', name: 'Money Bag', price: 350, image: getAssetImage('money-bag.jpg') },
      { id: 'c5', name: 'Peppered Gizzard', price: 400, image: getAssetImage('peppered-gizzard.jpg') },
      { id: 'c12', name: 'Shrimp Samosa', price: 450, image: getAssetImage('shrimp-samosa.jpg') },
      { id: 'c19', name: 'Fish-in-Batter', price: 450, image: getAssetImage('fish-in-batter.jpg') },
      { id: 'c22', name: 'Peppered Stick-Meat', price: 450, image: getAssetImage('peppered-stick-meat.jpg') },
      { id: 'c16', name: 'Prawn-in-Batter', price: 500, image: getAssetImage('prawn-in-batter.jpg') },
      { id: 'c18', name: 'Fantail Prawn', price: 600, image: getAssetImage('fantail-prawn.jpg') },
      { id: 'c11', name: 'Prawn Roll', price: 800, image: getAssetImage('prawn-roll.jpg') },
      { id: 'c14', name: 'x5 Puff Puff', price: 800, image: getAssetImage('puff-puff.jpg') },
      { id: 'c15', name: 'x5 Mosa', price: 800, image: getAssetImage('mosa.jpg') },
      { id: 'c20', name: 'Peppered Snail', price: 900, image: getAssetImage('peppered-snail.jpg') },
      { id: 'c1', name: 'Crispy Chicken', price: 1000, image: getAssetImage('crispy-chicken.jpg') },
      { id: 'c2', name: 'Peppered Chicken', price: 1100, image: getAssetImage('peppered-chicken.jpg') },
      { id: 'c3', name: 'BBQ Chicken', price: 1100, image: getAssetImage('bbq-chicken.jpg') },
      { id: 'c4', name: 'Chicken Kebab', price: 1200, image: getAssetImage('chicken-kebab.jpg') },
      { id: 'c21', name: 'Beef Kebab', price: 1500, image: getAssetImage('beef-kebab.jpg') },
      { id: 'c17', name: 'Prawn Kebab', price: 1800, image: getAssetImage('prawn-kebab.jpg') }
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
    <div id="menu-catalog" className="space-y-8 scroll-mt-24">
      {/* Category Selection Tabs */}
      <div className="flex border-b border-neutral-200 overflow-x-auto no-scrollbar gap-2 p-1.5 bg-neutral-100/80 rounded-2xl backdrop-blur-sm">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 whitespace-nowrap text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all duration-300 transform active:scale-95 ${
                isActive
                  ? 'bg-white text-orange-600 shadow-md scale-[1.01]'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conditionally Render Layout Based on Active Tab */}
      {activeTab === 'customize' ? (
        /* Customize Pack List View with Small Thumbnail on the Left */
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="border-b border-neutral-100 pb-3 mb-4 flex justify-between items-center">
            <span className="text-xs font-black uppercase text-neutral-400 tracking-wider">Customize Item & Thumbnail</span>
            <span className="text-xs font-black uppercase text-neutral-400 tracking-wider">Unit Price & Add</span>
          </div>

          <div className="divide-y divide-neutral-100">
            {activeItems.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-orange-50/40 px-3 rounded-2xl transition-colors">
                <div className="flex items-center gap-3.5">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-xl border border-neutral-200 shrink-0 shadow-sm"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-neutral-900">{item.name}</h4>
                    <span className="font-mono text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-100 inline-block mt-1">
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => onAddToCart(item, activeTab, e)}
                  className="bg-neutral-900 hover:bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 transform active:scale-95 shadow-sm shrink-0"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  <span>Add</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'frozen' ? (
        /* Frozen Chops List View (No Pictures) */
        <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="border-b border-neutral-100 pb-3 mb-4 flex justify-between items-center">
            <span className="text-xs font-black uppercase text-neutral-400 tracking-wider">Frozen Item Name</span>
            <span className="text-xs font-black uppercase text-neutral-400 tracking-wider">Unit Price</span>
          </div>

          <div className="divide-y divide-neutral-100">
            {activeItems.map((item) => (
              <div key={item.id} className="py-3.5 flex justify-between items-center gap-4 hover:bg-orange-50/40 px-3 rounded-xl transition-colors">
                <div>
                  <h4 className="font-extrabold text-sm text-neutral-900">{item.name}</h4>
                  <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Ready for deep-fry / home preparation</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono text-xs font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                    ₦{item.price.toLocaleString()}
                  </span>

                  <button
                    onClick={(e) => onAddToCart(item, activeTab, e)}
                    className="bg-neutral-900 hover:bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 transform active:scale-95 shadow-sm"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Platters & Packs Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {activeItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-neutral-200/80 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-orange-500/60 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="h-44 w-full relative overflow-hidden bg-neutral-100">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3">
                  <span className="font-mono text-xs font-black text-neutral-900 bg-white/95 backdrop-blur-md text-orange-600 px-3 py-1.5 rounded-xl border border-neutral-200/80 shadow-md">
                    ₦{item.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-neutral-900 tracking-tight group-hover:text-orange-600 transition-colors duration-200">
                    {item.name}
                  </h4>
                  {item.desc && (
                    <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => onAddToCart(item, activeTab, e)}
                  className="w-full bg-neutral-900 hover:bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 shadow-sm hover:shadow-orange-600/20 mt-auto"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  <span>Add to Pack</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

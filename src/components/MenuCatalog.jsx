import React, { useState } from 'react';
import { smallChopsMenu, customAddOns, frozenChops } from '../data/menuData';

export default function MenuCatalog({ onAddToCart, activeTab, setActiveTab }) {
  const categories = ['menu', 'addons', 'frozen'];
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    const currentIndex = categories.indexOf(activeTab);

    if (isLeftSwipe && currentIndex < categories.length - 1) {
      setActiveTab(categories[currentIndex + 1]);
    } else if (isRightSwipe && currentIndex > 0) {
      setActiveTab(categories[currentIndex - 1]);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div 
      className="space-y-8 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex bg-neutral-200/60 p-1.5 rounded-2xl gap-2 max-w-lg shadow-inner">
        <button 
          onClick={() => setActiveTab('menu')} 
          className={`flex-1 text-center py-3 font-black text-xs rounded-xl transition-all ${activeTab === 'menu' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
        >
          Gourmet Platters
        </button>
        <button 
          onClick={() => setActiveTab('addons')} 
          className={`flex-1 text-center py-3 font-black text-xs rounded-xl transition-all ${activeTab === 'addons' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
        >
          Customize Your Packs
        </button>
        <button 
          onClick={() => setActiveTab('frozen')} 
          className={`flex-1 text-center py-3 font-black text-xs rounded-xl transition-all ${activeTab === 'frozen' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
        >
          Frozen Packs
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'menu' && (
          <div className="space-y-4">
            {smallChopsMenu.map((item) => (
              <div key={item.id} className="bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center hover:border-orange-400 hover:shadow-md transition-all duration-300">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-neutral-900 tracking-tight">{item.name}</h3>
                    <span className="text-[9px] font-black tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded uppercase">Platter Pack</span>
                  </div>
                  
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-neutral-500">
                    {item.contents.map((content, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-orange-500 text-[10px]">✔</span>
                        {content}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-100 w-full md:w-auto flex justify-between md:justify-end items-center gap-6">
                  <span className="font-black text-neutral-900 text-lg">₦{item.price.toLocaleString()}</span>
                  <button 
                    onClick={(e) => onAddToCart(item, 'pack', e)} 
                    className="bg-neutral-950 text-white hover:bg-orange-600 font-bold px-6 py-3 rounded-xl text-xs transition-all active:scale-95"
                  >
                    + Add Pack
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {(activeTab === 'addons' || activeTab === 'frozen') && (
          <div className="bg-white border border-neutral-200/50 rounded-2xl overflow-hidden shadow-sm divide-y divide-neutral-100">
            {(activeTab === 'addons' ? customAddOns : frozenChops).map((item) => (
              <div key={item.id} className="p-5 flex justify-between items-center hover:bg-neutral-50/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center justify-center text-lg">
                    {activeTab === 'addons' ? '🍢' : '❄️'}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-neutral-900">{item.name}</h4>
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-black text-sm text-neutral-900">₦{item.price.toLocaleString()}</span>
                  <button 
                    onClick={(e) => onAddToCart(item, activeTab, e)} 
                    className="bg-neutral-950 text-white hover:bg-orange-600 font-bold px-4 py-2 rounded-xl text-xs transition-all active:scale-95"
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-[10px] text-neutral-400">
        💡 Mobile Swipe Shortcut: Swipe horizontally across the menu sheet to seamlessly switch tabs!
      </p>
    </div>
  );
}
